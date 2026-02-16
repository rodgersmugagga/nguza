import React, { useState, useEffect, useRef } from 'react';

// ProgressiveImage
// - Builds Cloudinary optimized URLs when possible
// - Emits srcSet for responsive sizes
// - Shows a tiny blurred placeholder + shimmer while the full image loads
// - Exposes `priority` prop to hint the browser for above-the-fold images

function isCloudinary(url) {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

function cloudinaryForWidth(url, width) {
  if (!isCloudinary(url)) return url;
  const parts = url.split('/upload/');
  if (parts.length < 2) return url;
  // Use automatic format/quality and limit to requested width
  return `${parts[0]}/upload/f_auto,q_auto,w_${width},c_limit/${parts[1]}`;
}

function buildSrcSet(url) {
  const sizes = [400, 800, 1200, 1600];
  if (!url) return '';
  if (!isCloudinary(url)) {
    // Fallback: return the same url at one descriptor
    return `${url} 800w`;
  }
  return sizes.map((w) => `${cloudinaryForWidth(url, w)} ${w}w`).join(', ');
}

export default function ProgressiveImage({ src, alt = '', className = '', sizes, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const [smallSrc, setSmallSrc] = useState('');
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    // build a tiny placeholder (LQIP) - request a very small width for subtle blur
    if (isCloudinary(src)) {
      setSmallSrc(cloudinaryForWidth(src, 20));
    } else {
      setSmallSrc(src);
    }
    setLoaded(false);
  }, [src]);

  const mainSrc = isCloudinary(src) ? cloudinaryForWidth(src, 800) : src;
  const srcSet = buildSrcSet(src);

  // If the image is already cached and complete, mark as loaded immediately.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth) {
      setLoaded(true);
      return;
    }

    const onLoad = () => setLoaded(true);
    const onError = () => setLoaded(true); // on error, stop showing placeholder

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [mainSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* tiny blurred placeholder */}
      {smallSrc && (
        <img
          src={smallSrc}
          alt={alt}
          aria-hidden
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300 pointer-events-none"
          style={{ opacity: loaded ? 0 : 0.6, transform: 'scale(1.02)' }}
        />
      )}

      {/* real responsive image */}
      <img
        ref={imgRef}
        src={mainSrc}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, 800px'}
        loading="lazy"
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        alt={alt}
        crossOrigin="anonymous"
        onError={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
      />

      {/* shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/60 via-gray-100/40 to-gray-200/60 animate-pulse" />
      )}
    </div>
  );
}
