import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(authMiddleware, getWishlist);

router.route('/:id')
  .post(authMiddleware, addToWishlist)
  .delete(authMiddleware, removeFromWishlist);

export default router;
