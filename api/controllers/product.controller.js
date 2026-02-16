import Product, { AGRICULTURE_CATEGORIES } from "../models/product.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import { generateSeo } from '../utils/seo.js';

// Agriculture-specific validation (Reused)
function validateAgricultureDetails(category, subCategory, details) {
  const errors = [];
  if (category === 'Crops') {
    if (!details.cropType) errors.push('Crop type is required for crops');
    // Quantity validation deferred to stock check
  }
  // Add other validations as needed
  return errors;
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res, next) => {
  const uploadedImages = [];
  try {
    const payload = req.body || {};

    // Basic validation
    if ((!req.files || req.files.length < 1) && (!payload.imageUrls || payload.imageUrls.length < 1)) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    // Validate category
    if (!payload.category || !AGRICULTURE_CATEGORIES[payload.category]) {
      return res.status(400).json({ message: 'Invalid or missing category.' });
    }

    const userRef = req.user?.user?.id || req.user?.id || payload.userRef;
    if (!userRef) return res.status(401).json({ message: 'Missing user reference.' });

    // Handle Image Uploads
    let imageUrls = payload.imageUrls || [];
    let imagePublicIds = payload.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const uploadPromises = req.files.map(async (file) => {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'Nguza_products',
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
        });
        return { url: result.secure_url || result.url, public_id: result.public_id };
      });

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(r => r.url);
      imagePublicIds = results.map(r => r.public_id);
      uploadedImages.push(...imagePublicIds);
    }

    // Resolve seller info
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
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      category: payload.category,
      subCategory: payload.subCategory,
      location: payload.location,
      regularPrice: payload.regularPrice,
      discountedPrice: payload.discountedPrice,
      offer: payload.offer || false,
      countInStock: payload.countInStock || 0,
      hasVariants: payload.hasVariants || false,
      variants: payload.variants ? JSON.parse(payload.variants) : [], // Expecting JSON string for complex fields if multipart/form-data
      details: payload.details ? (typeof payload.details === 'string' ? JSON.parse(payload.details) : payload.details) : {},
      imageUrls,
      imagePublicIds,
      userRef,
      sellerEmail: resolvedSellerEmail,
      contactPhone: resolvedContactPhone,
      isFeatured: payload.isFeatured || false,
      status: 'active'
    };

    const product = await Product.create(toCreate);
    res.status(201).json({ success: true, product });

  } catch (error) {
    console.error('Create product error:', error);
    // Cleanup images
    if (uploadedImages.length > 0) {
      try {
        const cloudinary = (await import('../utils/cloudinary.js')).default;
        await Promise.all(uploadedImages.map(pid => cloudinary.uploader.destroy(pid)));
      } catch (e) { console.error('Cleanup error', e); }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Filtering
    const filter = { status: 'active' };

    // Keyword Search
    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    // Category Filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Brand Filter
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.regularPrice = {};
      if (req.query.minPrice) filter.regularPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.regularPrice.$lte = Number(req.query.maxPrice);
    }

    // Rating Filter
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: Newest
    let projection = {};

    if (req.query.keyword) {
      // If searching, default to relevance score
      projection = { score: { $meta: "textScore" } };
      sort = { score: { $meta: "textScore" } };
    }

    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc': sort = { regularPrice: 1 }; break;
        case 'price_desc': sort = { regularPrice: -1 }; break;
        case 'rating': sort = { rating: -1 }; break;
        case 'views': sort = { views: -1 }; break;
        case 'relevance':
          if (req.query.keyword) sort = { score: { $meta: "textScore" } };
          break;
        default:
          if (!req.query.keyword) sort = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter, projection)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sort);

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get search suggestions
// @route   GET /api/products/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const regex = new RegExp(query, 'i');

    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    })
      .select('name image category _id brand imageUrls')
      .limit(6);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user products
// @route   GET /api/products/myproducts
// @access  Private
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userRef: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save({ validateBeforeSave: false });
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.userRef.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};


// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = await Review.create({
      name: req.user.username || req.user.email, // Adjust based on User model
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: req.params.id
    });

    // Update Product stats
    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
};
