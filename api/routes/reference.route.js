import express from 'express';
import {
  getDistricts,
  getSubcounties,
  getParishes,
  getVillages,
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
router.get('/districts/:district/subcounties/:subcounty/parishes/:parish/villages', getVillages);

// Agriculture reference data
router.get('/crop-types', getCropTypes);
router.get('/livestock-breeds', getLivestockBreeds);
router.get('/categories', getCategories);
router.get('/units', getUnits);

export default router;
