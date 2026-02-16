/**
 * Image optimization utilities for responsive images
 * Generates multiple sizes and formats for optimal performance
 */

/**
 * Generate Cloudinary image URLs with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Transformation options
 * @returns {object} URLs for different sizes and formats
 */
export function generateImageVariants(publicId, options = {}) {
  if (!publicId) return null;

  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const defaults = {
    quality: 'auto', // Auto-optimize quality
    fetchFormat: 'auto', // Auto-select format (WebP, AVIF, JPG)
  };

  const transformations = { ...defaults, ...options };
  const params = new URLSearchParams(transformations).toString();

  return {
    // Thumbnail (small previews)
    thumbnail: `${baseUrl}/w_150,h_150,c_fill,${params}/${publicId}`,
    
    // Mobile size
    mobile: `${baseUrl}/w_400,h_300,c_fill,${params}/${publicId}`,
    
    // Tablet size
    tablet: `${baseUrl}/w_800,h_600,c_fill,${params}/${publicId}`,
    
    // Desktop size
    desktop: `${baseUrl}/w_1200,h_800,c_fill,${params}/${publicId}`,
    
    // Full resolution (for gallery)
    full: `${baseUrl}/w_1600,h_1200,c_fill,${params}/${publicId}`,
    
    // WebP versions for modern browsers
    webp: {
      thumbnail: `${baseUrl}/w_150,h_150,c_fill,f_webp,${params}/${publicId}`,
      mobile: `${baseUrl}/w_400,h_300,c_fill,f_webp,${params}/${publicId}`,
      tablet: `${baseUrl}/w_800,h_600,c_fill,f_webp,${params}/${publicId}`,
      desktop: `${baseUrl}/w_1200,h_800,c_fill,f_webp,${params}/${publicId}`,
    },
  };
}

/**
 * Generate responsive srcSet for img elements
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} srcSet attribute value
 */
export function generateSrcSet(publicId) {
  if (!publicId) return '';

  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const params = 'q_auto,f_auto';

  return `
    ${baseUrl}/w_400,h_300,c_fill,${params}/${publicId} 400w,
    ${baseUrl}/w_800,h_600,c_fill,${params}/${publicId} 800w,
    ${baseUrl}/w_1200,h_800,c_fill,${params}/${publicId} 1200w,
    ${baseUrl}/w_1600,h_1200,c_fill,${params}/${publicId} 1600w
  `.trim();
}

/**
 * Middleware to attach image optimization helpers to response
 */
export default function imageOptimizationMiddleware(req, res, next) {
  // Attach helper functions to res
  res.locals.generateImageVariants = generateImageVariants;
  res.locals.generateSrcSet = generateSrcSet;
  next();
}
