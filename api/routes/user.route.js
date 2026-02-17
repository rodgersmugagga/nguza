import express from 'express';
import { test, updateUser, updateAvatar, deleteUser, getUserProducts, getUser, registerVendor } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.js";
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/test', test);

// Profile & Account
router.patch('/update/:id', authMiddleware, validateObjectIdParam('id'), upload.single('avatar'), updateUser);
router.patch("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);
router.delete('/delete/:id', authMiddleware, validateObjectIdParam('id'), deleteUser);

// Vendor Registration
router.post('/register-vendor', authMiddleware, upload.single('businessLogo'), registerVendor);

// User Products (Inventory)
router.get('/products/:id', authMiddleware, validateObjectIdParam('id'), getUserProducts);

// Public User Data
router.get('/:id', validateObjectIdParam('id'), getUser);

export default router;
