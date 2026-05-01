'use client';

export function HeroVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      tabIndex={-1}
      aria-hidden="true"
      poster="/acceuil/video_brasero_poster.webp"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    >
      <source src="/acceuil/video_brasero_accueil_compresse.mp4" type="video/mp4" />
    </video>
  );
}
