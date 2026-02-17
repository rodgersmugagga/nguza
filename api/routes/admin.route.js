import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  // Enhanced User Management
  updateUserDetails,
  toggleBanUser,
  changeUserRole,
  getUserActivity,
  // Product Moderation / Management
  approveProduct,
  rejectProduct,
  getAllProductsAdmin,
  deleteProductAdmin,
  updateProductDetailsAdmin,
  toggleFeatureProduct,
  // Enhanced Order Management
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.get('/user/:id/activity', getUserActivity);
router.put('/user/:id', updateUserDetails);
router.put('/user/:id/ban', toggleBanUser);
router.put('/user/:id/role', changeUserRole);
router.delete('/user/:id', deleteUser);

// Product Management
router.get('/products', getAllProductsAdmin);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);
router.put('/products/:id', updateProductDetailsAdmin);
router.put('/products/:id/feature', toggleFeatureProduct);
router.delete('/products/:id', deleteProductAdmin);

// Order Management
router.get('/orders', getAllOrders);
router.put('/order/:id/status', updateOrderStatus);
router.put('/order/:id/cancel', cancelOrder);

export default router;
