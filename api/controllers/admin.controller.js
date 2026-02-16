import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { invalidateCache } from '../middlewares/cache.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });

    // Simple valuation: sum of all regular prices
    const totalMarketValue = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: "$regularPrice" } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        totalMarketValue: totalMarketValue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      listings
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete an administrative account" });
    }

    // Delete all user's listings first
    await Listing.deleteMany({ userRef: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    // Refresh public caches
    invalidateCache('/api/listing');

    res.status(200).json({ success: true, message: "User and their listings deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Cleanup images from Cloudinary if needed (similar to listing.controller.js)
    try {
      if (listing.imagePublicIds && listing.imagePublicIds.length > 0) {
        const cloudinary = (await import('../utils/cloudinary.js')).default;
        await Promise.all(
          listing.imagePublicIds.map(pid => cloudinary.uploader.destroy(pid).catch(() => { }))
        );
      }
    } catch (err) {
      console.error('Admin cleanup error:', err);
    }

    await Listing.findByIdAndDelete(req.params.id);

    // Refresh public caches
    invalidateCache('/api/listing');

    res.status(200).json({ success: true, message: "Listing moderated successfully" });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENHANCED USER MANAGEMENT
// ============================================

// Update user details (admin only)
export const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, role, isSeller } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent editing admin users unless requester is also admin
    if (user.isAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Cannot edit admin users' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role !== undefined) user.role = role;
    if (isSeller !== undefined) user.isSeller = isSeller;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ban/Unban user
export const toggleBanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change user role
export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isAdmin, isSeller } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update role fields
    if (role !== undefined) user.role = role;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isSeller !== undefined) user.isSeller = isSeller;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity/stats
export const getUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get user's listings count
    const listingsCount = await Listing.countDocuments({ userRef: id });

    // Get user's orders (if Order model exists)
    let ordersCount = 0;
    try {
      const Order = (await import('../models/order.model.js')).default;
      ordersCount = await Order.countDocuments({ user: id });
    } catch (err) {
      // Order model might not exist
    }

    res.status(200).json({
      success: true,
      user,
      activity: {
        listingsCount,
        ordersCount,
        joinedAt: user.createdAt,
        lastActive: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENHANCED LISTING MANAGEMENT
// ============================================

// Approve listing
export const approveListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.status = 'active';
    listing.approvedAt = new Date();
    listing.approvedBy = req.user._id;
    await listing.save();

    invalidateCache('/api/listing');

    res.status(200).json({
      success: true,
      message: 'Listing approved successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Reject listing
export const rejectListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.status = 'rejected';
    listing.rejectionReason = reason || 'Does not meet platform guidelines';
    listing.rejectedAt = new Date();
    listing.rejectedBy = req.user._id;
    await listing.save();

    invalidateCache('/api/listing');

    res.status(200).json({
      success: true,
      message: 'Listing rejected',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Update listing details
export const updateListingDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id' && key !== 'userRef') {
        listing[key] = updates[key];
      }
    });

    listing.updatedAt = new Date();
    await listing.save();

    invalidateCache('/api/listing');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Toggle feature listing
export const toggleFeatureListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.isFeatured) {
      // Unfeature
      listing.isFeatured = false;
      listing.featuredUntil = null;
    } else {
      // Feature
      listing.isFeatured = true;
      listing.featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    await listing.save();
    invalidateCache('/api/listing');

    res.status(200).json({
      success: true,
      message: `Listing ${listing.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Bulk approve listings
export const bulkApproveListings = async (req, res, next) => {
  try {
    const { listingIds } = req.body;

    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return res.status(400).json({ message: 'Invalid listing IDs' });
    }

    const result = await Listing.updateMany(
      { _id: { $in: listingIds } },
      {
        $set: {
          status: 'active',
          approvedAt: new Date(),
          approvedBy: req.user._id
        }
      }
    );

    invalidateCache('/api/listing');

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} listings approved`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENHANCED ORDER MANAGEMENT
// ============================================

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const Order = (await import('../models/order.model.js')).default;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;

    // Update specific status fields
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order (admin)
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const Order = (await import('../models/order.model.js')).default;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by admin';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const Order = (await import('../models/order.model.js')).default;
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};
