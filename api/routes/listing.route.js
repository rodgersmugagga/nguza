import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  uploadImages,
  promoteListing,
  boostListing,
  getFeaturedListings,
  getListingsByDistrict,
  trackContactClick,
  getSearchSuggestions
} from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

// Create and upload
router.post('/create', authMiddleware, createListing);
router.post('/upload', authMiddleware, upload.array('images', 10), uploadImages);

// Suggestions
router.get('/suggestions', getSearchSuggestions);

// CRUD operations
router.get('/:id', validateObjectIdParam('id'), getListing);
router.get('/', getListings);
router.put('/:id', authMiddleware, validateObjectIdParam('id'), updateListing);
router.delete('/:id', authMiddleware, validateObjectIdParam('id'), deleteListing);

// Agriculture-specific endpoints
router.get('/featured/all', getFeaturedListings);
router.get('/district/:district', getListingsByDistrict);
router.post('/:id/contact', validateObjectIdParam('id'), trackContactClick);

// Promotion
router.post('/:id/promote', authMiddleware, validateObjectIdParam('id'), promoteListing);
router.post('/promote/webhook/:id', validateObjectIdParam('id'), promoteListing);
router.post('/:id/boost', authMiddleware, validateObjectIdParam('id'), boostListing);
router.post('/boost/webhook/:id', validateObjectIdParam('id'), boostListing);

export default router;