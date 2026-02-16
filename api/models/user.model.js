//import mongoose
import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://res.cloudinary.com/dnj7dtnvx/image/upload/v1763294361/vecteezy_user-avatar-ui-button_13907861_j7b38y.jpg" },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    isSeller: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;