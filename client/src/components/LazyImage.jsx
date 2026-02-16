import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className = '', style = {}, onLoad = null }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // Use IntersectionObserver to defer setting the image `src` until it is
    // near the viewport. This reduces initial bandwidth and speeds up first
    // paint on navigation. Fallback to eager loading if IO isn't available.
    let mounted = true;

    const setSrc = () => {
      if (!mounted) return;
      setImageSrc(src);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSrc();
            io.disconnect();
          }
        });
      }, { rootMargin: '200px' });

      if (wrapperRef.current) io.observe(wrapperRef.current);

      return () => {
        mounted = false;
        io.disconnect();
      };
    }

    // Fallback for older browsers: load immediately
    setSrc();
    return () => { mounted = false; };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}
        style={style}
        onLoad={handleLoad}
      />
    </div>
  );
}
