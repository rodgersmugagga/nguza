import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus
} from '../controllers/order.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(authMiddleware, addOrderItems)
  .get(authMiddleware, getOrders); // Protected Admin route ideally

router.route('/myorders').get(authMiddleware, getMyOrders);

router.route('/:id').get(authMiddleware, getOrderById);

router.route('/:id/pay').put(authMiddleware, updateOrderToPaid);
router.route('/:id/deliver').put(authMiddleware, updateOrderToDelivered);
router.route('/:id/status').put(authMiddleware, updateOrderStatus);

export default router;
