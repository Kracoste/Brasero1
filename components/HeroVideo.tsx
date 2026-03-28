'use client';

import { useEffect, useState } from 'react';

export function HeroVideo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Wait for page to be idle before loading video
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/acceuil/video_brasero_hero.mp4" type="video/mp4" />
    </video>
  );
}
