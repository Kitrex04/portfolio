'use client';

import { useEffect, useRef } from 'react';
import { initShapeGrid } from '@/lib/shapeGridEngine';

export default function ShapeGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    initShapeGrid(container, {
      shape: 'dot',
      direction: 'diagonal',
      lineColor: '#2a2734',
      hoverColor: '#c5c5c9',
      hoverFillColor: '#ffffff',
      fillOpacity: 0.15,
      cellSize: 40,
      speed: 0.2,
      tiltX: 19,
      tiltY: 0,
      rainbow: false,
      lineWidth: 1.5,
      radius: 0,
      trail: 0.1,
      glow: 1,
      twinkle: 0.2,
      clickCascade: false,
      fade: 1,
    });

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="shapeGridRoot"
      className="shape-grid-bg"
      aria-hidden="true"
    />
  );
}
