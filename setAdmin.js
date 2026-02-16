import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './api/models/user.model.js';

dotenv.config();

const setAdmin = async (phoneNumber) => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted ${user.username} to Admin.`);
    } else {
      console.log('User not found with that phone number.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const phone = process.argv[2];
if (!phone) {
  console.log('Usage: node setAdmin.js <phoneNumber>');
  process.exit(1);
}

setAdmin(phone);
