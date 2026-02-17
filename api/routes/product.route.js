import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
  getSearchSuggestions,
  promoteProduct,
  trackContactClick
} from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

// Public discovery
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/:id', validateObjectIdParam('id'), getProductById);

// Protected actions
router.post('/', authMiddleware, upload.array('images', 10), createProduct);
router.get('/view/myproducts', authMiddleware, getMyProducts);
router.put('/:id', authMiddleware, validateObjectIdParam('id'), updateProduct);
router.delete('/:id', authMiddleware, validateObjectIdParam('id'), deleteProduct);

// Interactions
router.post('/:id/reviews', authMiddleware, validateObjectIdParam('id'), createProductReview);
router.post('/:id/contact', validateObjectIdParam('id'), trackContactClick);

// Promotion
router.post('/:id/promote', authMiddleware, validateObjectIdParam('id'), promoteProduct);

export default router;
