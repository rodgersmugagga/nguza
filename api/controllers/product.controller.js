import Product, { AGRICULTURE_CATEGORIES } from "../models/product.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import { generateSeo } from '../utils/seo.js';

// Agriculture-specific validation
function validateAgricultureDetails(category, subCategory, details) {
  const errors = [];
  if (category === 'Crops') {
    if (!details.cropType) errors.push('Crop type is required for crops');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (!details.unit) errors.push('Unit is required (kg, bags, tonnes, etc.)');
  }
  if (category === 'Livestock') {
    if (!details.animalType) errors.push('Animal type is required for livestock');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
  }
  return errors;
}

// @desc    Create a product
export const createProduct = async (req, res, next) => {
  const uploadedImages = [];
  try {
    const payload = req.body || {};
    if ((!req.files || req.files.length < 1) && (!payload.imageUrls || payload.imageUrls.length < 1)) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }
    if (!payload.category || !AGRICULTURE_CATEGORIES[payload.category]) {
      return res.status(400).json({ message: 'Invalid or missing category.' });
    }

    const details = payload.details ? (typeof payload.details === 'string' ? JSON.parse(payload.details) : payload.details) : {};
    const detailErrors = validateAgricultureDetails(payload.category, payload.subCategory, details);
    if (detailErrors.length > 0) return res.status(400).json({ message: 'Invalid details', errors: detailErrors });

    const userRef = req.user?.user?.id || req.user?.id || payload.userRef;
    if (!userRef) return res.status(401).json({ message: 'Missing user reference.' });

    let imageUrls = payload.imageUrls || [];
    let imagePublicIds = payload.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const uploadPromises = req.files.map(async (file) => {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'Nguzza_products',
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
        });
        return { url: result.secure_url || result.url, public_id: result.public_id };
      });
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(r => r.url);
      imagePublicIds = results.map(r => r.public_id);
      uploadedImages.push(...imagePublicIds);
    }

    let resolvedSellerEmail = payload.sellerEmail;
    let resolvedContactPhone = payload.contactPhone;
    if (!resolvedSellerEmail || !resolvedContactPhone) {
      const userDoc = await User.findById(userRef).lean();
      if (userDoc) {
        resolvedSellerEmail = resolvedSellerEmail || userDoc.email;
        resolvedContactPhone = resolvedContactPhone || userDoc.phoneNumber;
      }
    }

    const toCreate = {
      ...payload,
      details,
      imageUrls,
      imagePublicIds,
      userRef,
      sellerEmail: resolvedSellerEmail,
      contactPhone: resolvedContactPhone,
      moderationStatus: 'pending',
      status: 'active'
    };

    const product = await Product.create(toCreate);
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (uploadedImages.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      await Promise.all(uploadedImages.map(pid => cloudinary.uploader.destroy(pid).catch(() => { })));
    }
    next(error);
  }
};

// @desc    Upload product images (standalone, for two-step creation flow)
export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ success: false, message: 'No images provided.' });
    }

    const cloudinary = (await import('../utils/cloudinary.js')).default;
    const uploadPromises = req.files.map(async (file) => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'Nguzza_products',
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
      });
      return { url: result.secure_url || result.url, public_id: result.public_id };
    });

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(r => r.url);
    const publicIds = results.map(r => r.public_id);

    res.status(200).json({
      success: true,
      imageUrls,
      publicIds,
      images: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
export const getProducts = async (req, res) => {
  try {
    const {
      category, subCategory, district, keyword, search,
      minPrice, maxPrice, sort, pageNumber = 1, pageSize = 12
    } = req.query;

    const filter = { status: 'active', moderationStatus: 'approved' };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (district) filter['location.district'] = district;
    if (keyword || search) filter.$text = { $search: keyword || search };

    if (minPrice || maxPrice) {
      filter.regularPrice = {};
      if (minPrice) filter.regularPrice.$gte = Number(minPrice);
      if (maxPrice) filter.regularPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { regularPrice: 1 };
    if (sort === 'price_desc') sortOption = { regularPrice: -1 };
    if (sort === 'views') sortOption = { views: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(Number(pageSize))
      .skip(Number(pageSize) * (Number(pageNumber) - 1))
      .sort(sortOption);

    res.json({ products, page: Number(pageNumber), pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.incrementViews();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userRef.toString() !== (req.user?.user?.id || req.user?.id) && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userRef.toString() !== (req.user?.user?.id || req.user?.id) && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promotions & Tracking
export const promoteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const days = req.body?.days || 7;
    product.isFeatured = true;
    product.featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackContactClick = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.incrementContactClicks();
      res.json({ success: true });
    } else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const regex = new RegExp(query, 'i');
    const products = await Product.find({
      $or: [{ name: { $regex: regex } }, { category: { $regex: regex } }],
      status: 'active', moderationStatus: 'approved'
    }).select('name imageUrls category _id').limit(6);
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get top rated products
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', moderationStatus: 'approved' })
      .sort({ rating: -1 })
      .limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userRef: req.user?._id || req.user?.user?.id });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    const alreadyReviewed = await Review.findOne({ product: req.params.id, user: req.user?._id || req.user?.user?.id });
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });
    const review = await Review.create({
      name: req.user?.username || req.user?.user?.username || 'Buyer',
      rating: Number(rating), comment,
      user: req.user?._id || req.user?.user?.id, product: req.params.id
    });
    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, i) => i.rating + acc, 0) / reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
