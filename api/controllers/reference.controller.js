import District from '../models/location.model.js';
import CropType from '../models/cropType.model.js';
import LivestockBreed from '../models/livestockBreed.model.js';

// Get all districts
export const getDistricts = async (req, res, next) => {
  try {
    const { region } = req.query;

    const filter = {};
    if (region) filter.region = region;

    const districts = await District.find(filter)
      .select('name region code subcounties')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      districts,
      total: districts.length
    });
  } catch (error) {
    console.error('Get districts error:', error);
    next(error);
  }
};

// Get subcounties for a district
export const getSubcounties = async (req, res, next) => {
  try {
    const { district } = req.params;

    const districtDoc = await District.findOne({ name: district }).lean();

    if (!districtDoc) {
      return res.status(404).json({ message: 'District not found' });
    }

    return res.status(200).json({
      success: true,
      district: districtDoc.name,
      subcounties: districtDoc.subcounties || []
    });
  } catch (error) {
    console.error('Get subcounties error:', error);
    next(error);
  }
};

// Get parishes for a subcounty
export const getParishes = async (req, res, next) => {
  try {
    const { district, subcounty } = req.params;

    const districtDoc = await District.findOne({ name: district }).lean();

    if (!districtDoc) {
      return res.status(404).json({ message: 'District not found' });
    }

    const subcountyDoc = districtDoc.subcounties?.find(s => s.name === subcounty);

    if (!subcountyDoc) {
      return res.status(404).json({ message: 'Subcounty not found' });
    }

    return res.status(200).json({
      success: true,
      district: districtDoc.name,
      subcounty: subcountyDoc.name,
      parishes: subcountyDoc.parishes || []
    });
  } catch (error) {
    console.error('Get parishes error:', error);
    next(error);
  }
};

// Get all crop types
export const getCropTypes = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const cropTypes = await CropType.find(filter)
      .select('name category commonVarieties seasonality icon')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      cropTypes,
      total: cropTypes.length
    });
  } catch (error) {
    console.error('Get crop types error:', error);
    next(error);
  }
};

// Get livestock breeds
export const getLivestockBreeds = async (req, res, next) => {
  try {
    const { animalType, search } = req.query;

    const filter = {};
    if (animalType) filter.animalType = animalType;
    if (search) filter.$text = { $search: search };

    const breeds = await LivestockBreed.find(filter)
      .select('name animalType purpose characteristics icon')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      breeds,
      total: breeds.length
    });
  } catch (error) {
    console.error('Get livestock breeds error:', error);
    next(error);
  }
};

// Get agriculture categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = {
      'Crops': {
        subcategories: ['Grains & Cereals', 'Legumes & Pulses', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops'],
        icon: '🌾',
        description: 'Agricultural crops and produce'
      },
      'Livestock': {
        subcategories: ['Cattle', 'Goats & Sheep', 'Poultry', 'Pigs', 'Fish & Aquaculture', 'Other Livestock'],
        icon: '🐄',
        description: 'Livestock and animals'
      },
      'Agricultural Inputs': {
        subcategories: ['Seeds & Seedlings', 'Fertilizers', 'Pesticides & Chemicals', 'Animal Feed', 'Veterinary Products'],
        icon: '🌱',
        description: 'Farm inputs and supplies'
      },
      'Equipment & Tools': {
        subcategories: ['Tractors & Machinery', 'Hand Tools', 'Irrigation Equipment', 'Processing Equipment', 'Transport Equipment'],
        icon: '🚜',
        description: 'Agricultural equipment and tools'
      },
      'Agricultural Services': {
        subcategories: ['Land Preparation', 'Planting Services', 'Harvesting Services', 'Transport & Logistics', 'Veterinary Services', 'Agronomy Services'],
        icon: '🤝',
        description: 'Agricultural services'
      }
    };

    return res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    next(error);
  }
};

// Get valid units
export const getUnits = async (req, res, next) => {
  try {
    const units = {
      weight: ['kg', 'bags', 'tonnes'],
      volume: ['litres', 'crates'],
      count: ['pieces', 'bunches', 'animals'],
      area: ['acres', 'hectares'],
      time: ['hours', 'days'],
      other: ['units']
    };

    return res.status(200).json({
      success: true,
      units
    });
  } catch (error) {
    console.error('Get units error:', error);
    next(error);
  }
};
