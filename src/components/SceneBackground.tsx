'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The meadow video that sits behind the whole site. Landing and auth pages show it almost unfiltered;
 * app pages (dashboard, lessons, labs) soften it so the content stays easy to read.
 * It stays still when the visitor prefers reduced motion, has Data Saver on, or presses the pause button.
 */
export default function SceneBackground() {
  const path = usePathname() ?? '';
  const calm = /^\/(bn|en)\/(dashboard|lessons|manipulatives)/.test(path);
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean((navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData);
    const sync = () => {
      const paused = document.documentElement.dataset.scene === 'paused' || reduce || saveData;
      if (paused) v.pause();
      else v.play().catch(() => undefined);
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scene'] });
    return () => mo.disconnect();
  }, []);

  return (
    <div className="scene" data-density={calm ? 'calm' : 'clear'} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="scene-plate" src="/meadowbell/plate_crisp.webp" alt="" />
      <video ref={ref} className={`scene-video${on ? ' on' : ''}`} src="/meadowbell/scene_motion.mp4" autoPlay loop muted playsInline preload="auto" disablePictureInPicture onPlaying={() => setOn(true)} />
      <div className="scene-wash" />
    </div>
  );
}
