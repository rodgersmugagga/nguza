import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cart.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(authMiddleware, getCart)
  .post(authMiddleware, addToCart)
  .delete(authMiddleware, clearCart);

router.route('/:id').delete(authMiddleware, removeFromCart);

export default router;
