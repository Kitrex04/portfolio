'use client';

import { useEffect, useRef } from 'react';
import { mountLanyard } from '@/lib/lanyardEngine';
import { FRONT_IMG_B64, BACK_IMG_B64, LANYARD_CONFIG } from '@/data/lanyardAssets';

interface LanyardInstance {
  destroy?: () => void;
  flip?: () => void;
}

export default function Lanyard3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<LanyardInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = mountLanyard(containerRef.current, {
      ...LANYARD_CONFIG,
      frontImage: FRONT_IMG_B64,
      backImage: BACK_IMG_B64,
    }) as unknown as LanyardInstance;
    instanceRef.current = instance;

    return () => {
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full relative" />
    </div>
  );
}
