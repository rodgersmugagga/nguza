import compression from 'compression';

/**
 * Compression middleware for gzip and brotli compression
 * Reduces payload size by 60-80% for 3G networks
 */
export default compression({
  level: 6, // Balanced compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress images (already compressed by Cloudinary)
    if (req.headers['content-type']?.includes('image')) {
      return false;
    }
    // Use default compression filter
    return compression.filter(req, res);
  },
});
