import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllListings,
  deleteUser,
  deleteListing,
  // Enhanced User Management
  updateUserDetails,
  toggleBanUser,
  changeUserRole,
  getUserActivity,
  // Enhanced Listing Management
  approveListing,
  rejectListing,
  updateListingDetails,
  toggleFeatureListing,
  bulkApproveListings,
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

// ============================================
// STATS & OVERVIEW
// ============================================
router.get('/stats', getAdminStats);

// ============================================
// USER MANAGEMENT
// ============================================
router.get('/users', getAllUsers);
router.get('/user/:id/activity', getUserActivity);
router.put('/user/:id', updateUserDetails);
router.put('/user/:id/ban', toggleBanUser);
router.put('/user/:id/role', changeUserRole);
router.delete('/user/:id', deleteUser);

// ============================================
// LISTING MANAGEMENT
// ============================================
router.get('/listings', getAllListings);
router.put('/listing/:id/approve', approveListing);
router.put('/listing/:id/reject', rejectListing);
router.put('/listing/:id', updateListingDetails);
router.put('/listing/:id/feature', toggleFeatureListing);
router.post('/listings/bulk-approve', bulkApproveListings);
router.delete('/listing/:id', deleteListing);

// ============================================
// ORDER MANAGEMENT
// ============================================
router.get('/orders', getAllOrders);
router.put('/order/:id/status', updateOrderStatus);
router.put('/order/:id/cancel', cancelOrder);

export default router;
