import express from 'express'; 
import { test, updateUser, updateAvatar, deleteUser, getListings, getUser } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.js";// Cloudinary upload
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/test', test);

// Update profile with optional avatar
router.patch('/update/:id', authMiddleware, validateObjectIdParam('id'), upload.single('avatar'), updateUser);

// Update avatar only
router.patch("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

// Delete user account
router.delete('/delete/:id', authMiddleware, validateObjectIdParam('id'), deleteUser);

// Note: signout is handled in auth routes; removed incorrect mapping that called deleteUser.

// Update profile with optional avatar
router.get('/listings/:id', authMiddleware, validateObjectIdParam('id'), getListings);

// 
router.get('/:id', authMiddleware, validateObjectIdParam('id'), getUser);


export default router;
