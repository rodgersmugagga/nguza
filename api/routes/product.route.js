import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
  getSearchSuggestions,
} from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import multer from 'multer';

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(authMiddleware, upload.array('images', 10), createProduct);

router.route('/top').get(getTopProducts);
router.route('/myproducts').get(authMiddleware, getMyProducts);
router.route('/suggestions').get(getSearchSuggestions);

router.route('/:id/reviews').post(authMiddleware, createProductReview);

router.route('/:id')
  .get(getProductById)
  .delete(authMiddleware, deleteProduct);

export default router;
