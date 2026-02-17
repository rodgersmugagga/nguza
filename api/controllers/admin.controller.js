import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { invalidateCache } from '../middlewares/cache.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const pendingProducts = await Product.countDocuments({ moderationStatus: 'pending' });

    const totalMarketValue = await Product.aggregate([
      { $match: { status: 'active', moderationStatus: 'approved' } },
      { $group: { _id: null, total: { $sum: "$regularPrice" } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        activeProducts,
        pendingProducts,
        totalMarketValue: totalMarketValue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Cannot delete admin" });

    await Product.deleteMany({ userRef: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    invalidateCache('/api/products');
    res.status(200).json({ success: true, message: "User and their products deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const { moderationStatus } = req.query;
    const filter = {};
    if (moderationStatus) filter.moderationStatus = moderationStatus;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.moderationStatus = 'approved';
    product.status = 'active';
    await product.save();

    invalidateCache('/api/products');
    res.status(200).json({ success: true, message: 'Approved' });
  } catch (error) {
    next(error);
  }
};

export const rejectProduct = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.moderationStatus = 'rejected';
    product.rejectionReason = reason;
    await product.save();

    res.status(200).json({ success: true, message: 'Rejected' });
  } catch (error) {
    next(error);
  }
};

export const deleteProductAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.imagePublicIds?.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      await Promise.all(product.imagePublicIds.map(pid => cloudinary.uploader.destroy(pid).catch(() => { })));
    }

    await Product.findByIdAndDelete(req.params.id);
    invalidateCache('/api/products');
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateProductDetailsAdmin = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    invalidateCache('/api/products');
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const toggleFeatureProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isFeatured = !product.isFeatured;
    await product.save();
    invalidateCache('/api/products');
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getUserActivity = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const productsCount = await Product.countDocuments({ userRef: req.params.id });
    res.status(200).json({ success: true, user, activity: { productsCount } });
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const Order = (await import('../models/order.model.js')).default;
    const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const Order = (await import('../models/order.model.js')).default;
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const Order = (await import('../models/order.model.js')).default;
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
