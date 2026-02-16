import Wishlist from '../models/wishlist.model.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
export const addToWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [id] });
    } else {
      // Check if product already exists
      if (!wishlist.products.includes(id)) {
        wishlist.products.push(id);
        await wishlist.save();
      }
    }

    // Populate to return full product details if needed, or just return success
    // await wishlist.populate('products'); 
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(prodId => prodId.toString() !== id);
      await wishlist.save();
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
