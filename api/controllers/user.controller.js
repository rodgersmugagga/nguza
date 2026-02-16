import cloudinary from '../utils/cloudinary.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import Listing from '../models/listing.model.js';



// Update avatar controller
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.user.user.id; // from auth middleware

    // Upload to Cloudinary



    // Upload buffer to Cloudinary (data URI)
    const mime = req.file.mimetype;
    const b64 = req.file.buffer.toString('base64');
    const dataUri = `data:${mime};base64,${b64}`;

    const result = await (await import('../utils/cloudinary.js')).default.uploader.upload(dataUri, {
      folder: 'listings_app_avatars',
      transformation: [{ width: 400, height: 400, crop: 'limit' }],
    });

    const avatarUrl = result.secure_url || result.url;

    if (!avatarUrl) return res.status(500).json({ message: 'Upload did not return a url' });

    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select('-password');

    return res.status(200).json({ message: 'Avatar updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const test = (req, res) => {
  res.json({
    message: "I am Rodgers Mugagga and i am the best software engineer in Africa",
  });
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const targetUserId = req.params.id;

    if (userId.toString() !== targetUserId.toString()) {
      return res.status(401).json({ message: 'You can only update your own profile!' });
    }

    // Validate email format if provided
    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: targetUserId }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Validate and normalize phone number if provided
    let normalizedPhone = null;
    if (req.body.phoneNumber) {
      const { normalizeUgandanPhone } = await import('../utils/phoneUtils.js');
      normalizedPhone = normalizeUgandanPhone(req.body.phoneNumber);
      if (!normalizedPhone) {
        return res.status(400).json({ message: 'Invalid Ugandan phone number format' });
      }

      const existingPhoneUser = await User.findOne({
        phoneNumber: normalizedPhone,
        _id: { $ne: targetUserId }
      });
      if (existingPhoneUser) {
        return res.status(400).json({ message: 'Phone number is already in use' });
      }
    }

    const updateData = {};

    // Only include fields that are actually provided
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (normalizedPhone) updateData.phoneNumber = normalizedPhone;


    // Handle password update with validation
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(req.body.password, salt);
    }

    // Handle avatar upload
    if (req.file) {
      // Upload buffer to Cloudinary
      const mime = req.file.mimetype;
      const b64 = req.file.buffer.toString('base64');
      const dataUri = `data:${mime};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'listings_app_avatars',
        transformation: [{ width: 400, height: 400, crop: 'limit' }],
      });

      updateData.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



export const deleteUser = async (req, res, next) => {

  try {

    const userId = req.user.user.id;
    const targetUserId = req.params.id;

    if (userId.toString() !== targetUserId.toString()) {
      return res.status(401).json({ message: 'You can only delete your own profile!' });
    }


    await User.findByIdAndDelete(targetUserId);

    res.status(200).json({
      success: true,
      message: 'User has been deleted!',

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }

}

export const getListings = async (req, res) => {

  try {

    const userId = req.user.user.id;
    const targetUserId = req.params.id;

    if (userId.toString() !== targetUserId.toString()) {
      return res.status(401).json({ message: 'You can only view your own listings!' });
    }


    const listings = await Listing.find({ userRef: targetUserId });

    res.status(200).json({ listings });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const { password: pass, ...rest } = user._doc;

    return res.status(201).json(rest);

  } catch (error) {
    next(error);

  }
};


