'use client';

import { useEffect, useRef } from 'react';
import { technologies } from '@/data/technologies';

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

export default function OrbitImages() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const container: HTMLDivElement = el;

    const config = {
      images: technologies.map(t => ({ src: t.icon, alt: t.name })),
      baseWidth: 1400,
      radiusX: 580,
      radiusY: 380,
      rotation: -10,
      duration: 75,
      itemSize: 155,
      itemRadius: 32,
      depth: 0.75,
      showPath: true,
      pathColor: 'rgba(255, 255, 255, 0.12)',
      pathWidth: 1.5,
      pathDash: 14,
      hoverScale: 1.28,
      hoverSpeed: 0.05,
      clickToFront: true,
      draggable: true,
    };

    const SAMPLES = 720;
    const FRONT_GROW = 0.3;
    const BACK_SHRINK = 0.45;
    const BACK_DIM = 0.55;
    const DRAG_THRESHOLD = 5;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const wrapSigned = (v: number) => v - Math.round(v);

    const center = config.baseWidth / 2;
    const pathD = generateEllipsePath(center, center, config.radiusX, config.radiusY);
    const clipId = 'orbit-clip-' + Math.random().toString(36).substring(2, 9);

    container.className = 'orbit-container';
    container.style.width = '100%';
    container.style.setProperty(
      '--orbit-radius',
      typeof config.itemRadius === 'number'
        ? (config.itemRadius / config.itemSize) * 100 + '%'
        : config.itemRadius
    );
    container.style.setProperty('--orbit-shadow', '0.6');
    container.style.setProperty('--orbit-hover-scale', String(config.hoverScale));
    if (config.draggable) container.setAttribute('data-draggable', '');

    container.innerHTML = `
      <svg class="orbit-path-svg" data-orbit-svg="" preserveAspectRatio="none" style="z-index: 0; visibility: ${config.showPath ? 'visible' : 'hidden'};" aria-hidden="true">
        <path data-orbit-path="" data-orbit-stroke="" d="${pathD}" fill="none" stroke="${config.pathColor}" stroke-linecap="round" transform="rotate(${config.rotation} ${center} ${center})" />
      </svg>
      <svg class="orbit-path-svg" data-orbit-svg="" preserveAspectRatio="none" style="z-index: 105; visibility: ${config.showPath ? 'visible' : 'hidden'};" aria-hidden="true">
        <defs>
          <clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">
            <rect data-orbit-clip="" />
          </clipPath>
        </defs>
        <g clip-path="url(#${clipId})">
          <path data-orbit-stroke="" d="${pathD}" fill="none" stroke="${config.pathColor}" stroke-linecap="round" transform="rotate(${config.rotation} ${center} ${center})" />
        </g>
      </svg>
      ${config.images
        .map(
          (item, idx) => `
        <div class="orbit-item" data-orbit-item="${idx}" data-clickable="" role="button" tabindex="0" aria-label="${item.alt}">
          <div class="orbit-item-inner">
            <img src="${item.src}" alt="${item.alt}" draggable="false" decoding="async" class="orbit-image" />
          </div>
        </div>
      `
        )
        .join('')}
      <div class="orbit-center-content" data-orbit-center="">
        <div class="mattia-pill px-5 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl border border-white/10 backdrop-blur-md">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
            <span class="font-mono-code text-[11px] uppercase tracking-[0.2em] text-zinc-400">Core Stack</span>
          </div>
          <span class="text-xs font-semibold text-zinc-200">11 Production Tools</span>
        </div>
      </div>
    `;

    interface OrbitItemRef {
      el: HTMLElement;
      t: string;
      o: string;
      z: string;
    }

    interface DragState {
      id: number;
      x: number;
      y: number;
      active: boolean;
      samples: [number, number][];
      rate: number;
      anchor: number;
      manual: number;
    }

    interface SeekState {
      from: number;
      delta: number;
      t: number;
      dur: number;
    }

    const st = {
      lut: null as Float32Array | null,
      length: 0,
      front: 0,
      yMid: 0,
      yHalf: 1,
      bbox: [0, 0, 1, 1],
      width: 0,
      height: 0,
      scale: 0,
      size: 0,
      items: [] as OrbitItemRef[],
      strokes: [] as SVGElement[],
      lap: 0,
      manual: 0,
      glide: 0,
      speed: 1,
      drag: null as DragState | null,
      seek: null as SeekState | null,
      hovered: false,
      hoverIndex: -1,
      suppressUntil: 0,
      visible: true,
      raf: 0,
      last: 0,
      destroyed: false,
    };

    const pathEl = container.querySelector<SVGPathElement>('[data-orbit-path]');
    const itemEls = Array.from(container.querySelectorAll<HTMLElement>('[data-orbit-item]'));
    st.items = itemEls.map(element => ({ el: element, t: '', o: '', z: '' }));
    st.strokes = Array.from(container.querySelectorAll<SVGElement>('[data-orbit-stroke]'));

    function build() {
      let length = 0;
      try {
        length = pathEl ? pathEl.getTotalLength() : 0;
      } catch {
        length = 0;
      }
      if (!pathEl || !length || !isFinite(length)) return;

      const lut = new Float32Array(SAMPLES * 2);
      const angle = (config.rotation * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const origin = config.baseWidth / 2;
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      let front = 0;

      for (let i = 0; i < SAMPLES; i++) {
        const pt = pathEl.getPointAtLength((i / SAMPLES) * length);
        const dx = pt.x - origin;
        const dy = pt.y - origin;
        const x = origin + dx * cos - dy * sin;
        const y = origin + dx * sin + dy * cos;
        lut[i * 2] = x;
        lut[i * 2 + 1] = y;
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
        if (y > lut[front * 2 + 1] + 1e-6) front = i;
      }

      st.lut = lut;
      st.length = length;
      st.front = front / SAMPLES;
      st.yMid = (y0 + y1) / 2;
      st.yHalf = Math.max(1e-3, (y1 - y0) / 2);
      const depth = clamp(config.depth, 0, 1);
      const margin =
        (config.itemSize / 2) * (1 + depth * FRONT_GROW) * Math.max(1, config.hoverScale) + 4;
      st.bbox = [x0 - margin, y0 - margin, x1 + margin, y1 + margin];

      const aspect = (x1 - x0 + margin * 2) / (y1 - y0 + margin * 2);
      container.style.aspectRatio = String(aspect);
    }

    function layout() {
      st.width = container.clientWidth;
      st.height = container.clientHeight;
      if (!st.lut || !st.width || !st.height) return;

      const [bx0, by0, bx1, by1] = st.bbox;
      const scale = Math.min(st.width / (bx1 - bx0), st.height / (by1 - by0));
      st.scale = scale > 0 && isFinite(scale) ? scale : 0;
      st.size = config.itemSize * st.scale;

      for (const it of st.items) {
        it.el.style.width = `${st.size}px`;
        it.el.style.height = `${st.size}px`;
      }
      if (!st.scale) return;

      const vw = st.width / st.scale;
      const vh = st.height / st.scale;
      const cx = (bx0 + bx1) / 2;
      const cy = (by0 + by1) / 2;

      container.querySelectorAll('[data-orbit-svg]').forEach(svg => {
        svg.setAttribute('viewBox', `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`);
      });

      const clip = container.querySelector('[data-orbit-clip]');
      if (clip) {
        clip.setAttribute('x', String(cx - vw));
        clip.setAttribute('y', String(st.yMid));
        clip.setAttribute('width', String(vw * 2));
        clip.setAttribute('height', String(vh * 2));
      }

      const dash = config.pathDash > 0 && st.scale ? config.pathDash / st.scale : 0;
      for (const stroke of st.strokes) {
        stroke.style.strokeWidth = String(config.pathWidth / st.scale);
        stroke.style.strokeDasharray = dash ? `${dash} ${dash * 1.6}` : '';
      }
    }

    const sample = (u: number): [number, number] => {
      const f = (((u % 1) + 1) % 1) * SAMPLES;
      const i0 = Math.floor(f) % SAMPLES;
      const i1 = (i0 + 1) % SAMPLES;
      const t = f - Math.floor(f);
      const lut = st.lut!;
      return [
        lut[i0 * 2] + (lut[i1 * 2] - lut[i0 * 2]) * t,
        lut[i0 * 2 + 1] + (lut[i1 * 2 + 1] - lut[i0 * 2 + 1]) * t,
      ];
    };

    const progress = () => {
      const whole = Math.floor(st.lap);
      return whole + (st.lap - whole) + st.manual;
    };

    const offsetOf = (index: number, count: number) => {
      return index / Math.max(1, count);
    };

    const render = () => {
      if (!st.lut || !st.scale) return;
      const p = progress();
      const count = st.items.length;
      const depth = clamp(config.depth, 0, 1);
      const [bx0, by0, bx1, by1] = st.bbox;
      const cx = (bx0 + bx1) / 2;
      const cy = (by0 + by1) / 2;
      const half = st.size / 2;

      for (let i = 0; i < count; i++) {
        const it = st.items[i];
        const u = p + offsetOf(i, count);
        const [x, y] = sample(u);
        const d = clamp((y - st.yMid) / st.yHalf, -1, 1);
        const w = (d + 1) / 2;
        const scale = 1 + depth * (FRONT_GROW * w - BACK_SHRINK * (1 - w));
        const opacity = 1 - depth * BACK_DIM * (1 - w);
        const sx = (x - cx) * st.scale + st.width / 2 - half;
        const sy = (y - cy) * st.scale + st.height / 2 - half;
        let z =
          depth > 0
            ? d <= 0
              ? 10 + Math.round((d + 1) * 80)
              : 110 + Math.round(d * 80)
            : 1;
        if (i === st.hoverIndex) z += 200;

        const tStr = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0px) scale(${scale.toFixed(4)})`;
        if (it.t !== tStr) {
          it.t = tStr;
          it.el.style.transform = tStr;
        }
        const oStr = opacity > 0.999 ? '' : opacity.toFixed(3);
        if (it.o !== oStr) {
          it.o = oStr;
          it.el.style.opacity = oStr;
        }
        const zStr = String(z);
        if (it.z !== zStr) {
          it.z = zStr;
          it.el.style.zIndex = zStr;
        }
      }
    };

    const frame = (now: number) => {
      st.raf = 0;
      if (st.destroyed) return;
      const dt = st.last ? clamp((now - st.last) / 1000, 0, 0.1) : 0;
      st.last = now;

      const want = st.hovered ? clamp(config.hoverSpeed, 0, 1) : 1;
      if (st.speed !== want) {
        st.speed += (want - st.speed) * (1 - Math.exp(-dt / 0.35));
        if (Math.abs(st.speed - want) < 0.002) st.speed = want;
      }

      if (st.speed > 0 && config.duration > 0) {
        st.lap += (dt * st.speed) / config.duration;
      }

      if (st.seek) {
        st.seek.t = Math.min(1, st.seek.t + dt / st.seek.dur);
        const e =
          st.seek.t < 0.5 ? 4 * st.seek.t ** 3 : 1 - Math.pow(-2 * st.seek.t + 2, 3) / 2;
        st.manual = st.seek.from + st.seek.delta * e;
        if (st.seek.t >= 1) st.seek = null;
      } else if (st.glide) {
        st.manual += st.glide * dt;
        st.glide *= Math.exp(-dt / 0.7);
        if (Math.abs(st.glide) < 0.0004) st.glide = 0;
      }

      render();

      const whole = Math.floor(st.lap);
      if (whole) st.lap -= whole;
      if (!st.drag && !st.seek) st.manual -= Math.floor(st.manual);

      if (st.visible && !st.destroyed) st.raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (st.raf || st.destroyed || !st.visible) return;
      st.last = 0;
      st.raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent): [number, number] => {
      const r = container.getBoundingClientRect();
      const k = container.offsetWidth ? r.width / container.offsetWidth || 1 : 1;
      return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
    };

    const dragRate = () => {
      if (!st.lut || !st.scale) return 0;
      const a = sample(st.front - 3 / SAMPLES);
      const b = sample(st.front + 3 / SAMPLES);
      const along = ((b[0] - a[0]) / (6 / SAMPLES)) * st.scale;
      const floor = st.length * st.scale * 0.35;
      return Math.abs(along) < floor ? Math.sign(along || 1) * floor : along;
    };

    const itemIndex = (target: EventTarget | null) => {
      const targetElement = target instanceof Element ? target.closest('[data-orbit-item]') : null;
      return targetElement && container.contains(targetElement)
        ? Number(targetElement.getAttribute('data-orbit-item'))
        : -1;
    };

    const bringToFront = (index: number) => {
      if (!st.lut || index < 0) return;
      const u = progress() + offsetOf(index, st.items.length);
      const delta = wrapSigned(st.front - u);
      st.glide = 0;
      st.seek = { from: st.manual, delta, t: 0, dur: 0.45 + Math.abs(delta) * 1.4 };
      wake();
    };

    const onPointerEnter = () => {
      st.hovered = true;
      wake();
    };
    const onPointerLeave = () => {
      st.hovered = false;
      st.hoverIndex = -1;
      wake();
    };
    const onPointerOver = (e: PointerEvent) => {
      const idx = itemIndex(e.target);
      if (idx !== st.hoverIndex) {
        st.hoverIndex = idx;
        if (st.lut) render();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!config.draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if (e.target instanceof Element && e.target.closest('[data-orbit-center]')) return;
      const [x, y] = local(e);
      st.drag = {
        id: e.pointerId,
        x,
        y,
        active: false,
        samples: [],
        rate: dragRate(),
        anchor: 0,
        manual: 0,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      const [x, y] = local(e);
      const along = x - d.x;
      if (!d.active) {
        if (Math.abs(along) < DRAG_THRESHOLD) return;
        if (Math.abs(y - d.y) > Math.abs(along)) {
          st.drag = null;
          return;
        }
        d.active = true;
        d.anchor = along;
        d.manual = st.manual;
        st.seek = null;
        st.glide = 0;
        try {
          container.setPointerCapture(e.pointerId);
        } catch {}
        container.setAttribute('data-dragging', '');
      }
      if (d.rate) st.manual = d.manual + (along - d.anchor) / d.rate;
      const now = performance.now();
      d.samples.push([now, along]);
      while (d.samples.length > 2 && now - d.samples[0][0] > 100) d.samples.shift();
      wake();
    };

    const endDrag = (e: PointerEvent, cancelled: boolean) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      st.drag = null;
      if (!d.active) return;
      container.removeAttribute('data-dragging');
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
      const now = performance.now();
      st.suppressUntil = now + 400;
      const s = d.samples;
      if (!cancelled && s.length > 1 && d.rate) {
        const [t0, a0] = s[0];
        const [t1, a1] = s[s.length - 1];
        if (t1 > t0 && now - t1 < 80)
          st.glide = clamp((((a1 - a0) / (t1 - t0)) * 1000) / d.rate, -3, 3);
      }
      wake();
    };

    const onPointerUp = (e: PointerEvent) => endDrag(e, false);
    const onPointerCancel = (e: PointerEvent) => endDrag(e, true);
    const onClick = (e: MouseEvent) => {
      if (performance.now() < st.suppressUntil) {
        e.preventDefault();
        e.stopPropagation();
        st.suppressUntil = 0;
        return;
      }
      const idx = itemIndex(e.target);
      if (idx >= 0 && config.clickToFront) bringToFront(idx);
    };

    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerover', onPointerOver as EventListener);
    container.addEventListener('pointerdown', onPointerDown as EventListener);
    container.addEventListener('pointermove', onPointerMove as EventListener);
    container.addEventListener('pointerup', onPointerUp as EventListener);
    container.addEventListener('pointercancel', onPointerCancel as EventListener);
    container.addEventListener('lostpointercapture', onPointerCancel as EventListener);
    container.addEventListener('click', onClick);

    const resObs = new ResizeObserver(() => {
      layout();
      render();
      wake();
    });
    resObs.observe(container);

    const intObs = new IntersectionObserver(
      ([entry]) => {
        st.visible = entry.isIntersecting;
        if (st.visible) wake();
      },
      { threshold: 0.05 }
    );
    intObs.observe(container);

    build();
    layout();
    render();
    wake();

    return () => {
      st.destroyed = true;
      if (st.raf) cancelAnimationFrame(st.raf);
      resObs.disconnect();
      intObs.disconnect();
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerover', onPointerOver as EventListener);
      container.removeEventListener('pointerdown', onPointerDown as EventListener);
      container.removeEventListener('pointermove', onPointerMove as EventListener);
      container.removeEventListener('pointerup', onPointerUp as EventListener);
      container.removeEventListener('pointercancel', onPointerCancel as EventListener);
      container.removeEventListener('lostpointercapture', onPointerCancel as EventListener);
      container.removeEventListener('click', onClick);
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 select-none">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
