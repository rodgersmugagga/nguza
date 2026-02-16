import express from 'express';
import {
  getDistricts,
  getSubcounties,
  getParishes,
  getCropTypes,
  getLivestockBreeds,
  getCategories,
  getUnits
} from '../controllers/reference.controller.js';

const router = express.Router();

// Location hierarchy
router.get('/districts', getDistricts);
router.get('/districts/:district/subcounties', getSubcounties);
router.get('/districts/:district/subcounties/:subcounty/parishes', getParishes);

// Agriculture reference data
router.get('/crop-types', getCropTypes);
router.get('/livestock-breeds', getLivestockBreeds);
router.get('/categories', getCategories);
router.get('/units', getUnits);

export default router;
