import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../utils/cloudinary.js';

export const test = (req, res) => {
  res.json({ message: "I am Rodgers Mugagga and i am the best software engineer in Africa" });
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const targetUserId = req.params.id;
    if (userId.toString() !== targetUserId.toString()) return res.status(401).json({ message: 'Unauthorized' });

    const updateData = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phoneNumber) {
      const { normalizeUgandanPhone } = await import('../utils/phoneUtils.js');
      updateData.phoneNumber = normalizeUgandanPhone(req.body.phoneNumber);
    }
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(req.body.password, salt);
    }

    if (req.file) {
      const mime = req.file.mimetype;
      const b64 = req.file.buffer.toString('base64');
      const dataUri = `data:${mime};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'nguza_avatars',
        transformation: [{ width: 400, height: 400, crop: 'limit' }],
      });
      updateData.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, { $set: updateData }, { new: true }).select('-password');
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const b64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataUri, { folder: 'nguza_avatars' });
    const user = await User.findByIdAndUpdate(req.user.user.id, { avatar: result.secure_url }, { new: true }).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.user.id !== req.params.id) return res.status(401).json({ message: 'Unauthorized' });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ userRef: req.params.id });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const registerVendor = async (req, res) => {
  try {
    const { businessName, businessDescription, businessAddress } = req.body;
    const user = await User.findById(req.user.user.id);
    user.vendorProfile = { businessName, businessDescription, businessAddress, verificationStatus: 'pending' };
    user.role = 'seller';
    user.isSeller = true;
    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: 'vendor_logos' });
      user.vendorProfile.businessLogo = result.secure_url;
    }
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};
