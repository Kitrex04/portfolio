'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PixelTitle() {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const text = lang === 'EN' ? 'PORTFOLIO' : 'PORTAFOLIO';

    // 1. Render text in low-resolution offscreen canvas
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    const lowW = 210;
    const lowH = 34;
    offCanvas.width = lowW;
    offCanvas.height = lowH;

    offCtx.clearRect(0, 0, lowW, lowH);
    offCtx.fillStyle = '#eae6dc';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.font = 'bold 22px Georgia, "Playfair Display", "Times New Roman", serif';
    offCtx.fillText(text, lowW / 2, lowH / 2 + 1);

    // 2. Scale up without smoothing for crisp serif pixel look
    const targetW = 950;
    const targetH = Math.round(targetW * (lowH / lowW));
    canvas.width = targetW;
    canvas.height = targetH;

    ctx.imageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefixes for maximum browser compatibility
    ctx.mozImageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefixes
    ctx.webkitImageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefixes
    ctx.msImageSmoothingEnabled = false;

    ctx.clearRect(0, 0, targetW, targetH);
    ctx.drawImage(offCanvas, 0, 0, targetW, targetH);
  }, [lang]);

  return (
    <div className="relative w-full max-w-xl sm:max-w-2xl py-2">
      <canvas
        ref={canvasRef}
        id="pixelTextCanvas"
        className="w-full h-auto block drop-shadow-sm select-none"
        aria-label="PORTAFOLIO"
      />
    </div>
  );
}
