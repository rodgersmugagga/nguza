import multer from 'multer';

// Use memory storage so controllers can upload buffers to Cloudinary directly.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const mimetype = allowed.test(file.mimetype);
    if (mimetype) return cb(null, true);
    cb(new Error('Unsupported file type'));
  },
});

export default upload;
