const SITE_URL = 'https://nguza.com';

/**
 * Generates SEO metadata for agricultural products
 * @param {string} category - Main category (Crops, Livestock, etc.)
 * @param {string} subCategory - Sub-category (e.g. Grains, Cattle)
 * @param {object} details - Specific attributes
 * @param {object} location - City/Region info
 * @param {string} productName - The actual title of the product
 * @returns {object} { title, description, keywords, canonical, slug }
 */

function generateCropsSeo(subCategory, details = {}, location = {}, productName = '') {
  const district = location?.district || 'Uganda';
  const crop = details?.cropType || subCategory || productName || 'Produce';
  return {
    title: `Buy ${crop} in ${district} | Fresh ${subCategory} - Nguza`,
    description: `Get high-quality ${crop} from verified farmers in ${district}. Direct from the source, best prices in Uganda.`,
    keywords: `${crop}, ${district}, agriculture Uganda, buy produce, ${subCategory}`,
    canonical: `${SITE_URL}/product/`,
    slug: 'product'
  };
}

function generateLivestockSeo(subCategory, details = {}, location = {}, productName = '') {
  const district = location?.district || 'Uganda';
  const animal = details?.animalType || subCategory || productName || 'Livestock';
  return {
    title: `${animal} for Sale in ${district} | Healthy Livestock - Nguza`,
    description: `Find healthy ${animal} in ${district}. Browse listings for cattle, goats, poultry and more from trusted breeders.`,
    keywords: `${animal}, livestock Uganda, poultry, cattle, ${district}`,
    canonical: `${SITE_URL}/product/`,
    slug: 'product'
  };
}

function generateInputsSeo(subCategory, details = {}, location = {}, productName = '') {
  const district = location?.district || 'Uganda';
  const product = details?.productName || subCategory || productName || 'Input';
  return {
    title: `${product} in ${district} | Agricultural Inputs - Nguza`,
    description: `Quality ${subCategory} available in ${district}. Find seeds, fertilizers, and pest control for your farm.`,
    keywords: `${product}, farm inputs, fertilizer, seeds Uganda, ${district}`,
    canonical: `${SITE_URL}/product/`,
    slug: 'product'
  };
}

function generateEquipmentSeo(subCategory, details = {}, location = {}, productName = '') {
  const district = location?.district || 'Uganda';
  const equipment = details?.equipmentType || subCategory || productName || 'Equipment';
  return {
    title: `${equipment} for Hire/Sale in ${district} | Farm Tools - Nguza`,
    description: `Rent or buy ${equipment} in ${district}. Explore tractors, irrigation tools, and harvesting machinery.`,
    keywords: `${equipment}, tractors Uganda, farm tools, irrigation, ${district}`,
    canonical: `${SITE_URL}/product/`,
    slug: 'product'
  };
}

function generateServicesSeo(subCategory, details = {}, location = {}, productName = '') {
  const district = location?.district || 'Uganda';
  const service = details?.serviceType || subCategory || productName || 'Service';
  return {
    title: `${service} Services in ${district} | Agri-Services - Nguza`,
    description: `Professional ${service} in ${district}. Connect with experts for land prep, spraying, and veterinary care.`,
    keywords: `${service}, farm services, vet services Uganda, ${district}`,
    canonical: `${SITE_URL}/product/`,
    slug: 'product'
  };
}

export function generateSeo(category, subCategory, details = {}, location = {}, productName = '') {
  if (!category) {
    return {
      title: 'Agricultural Marketplace | Nguza Uganda',
      description: 'The leading marketplace for farmers and buyers in Uganda. Trade produce, livestock, and equipment.',
      keywords: 'agriculture Uganda, farmers market, farm produce, livestock',
      canonical: `${SITE_URL}/products`,
      slug: 'products'
    };
  }

  const cat = category?.toLowerCase();
  switch (category) {
    case 'Crops':
      return generateCropsSeo(subCategory, details, location, productName);
    case 'Livestock':
      return generateLivestockSeo(subCategory, details, location, productName);
    case 'Agricultural Inputs':
      return generateInputsSeo(subCategory, details, location, productName);
    case 'Equipment & Tools':
      return generateEquipmentSeo(subCategory, details, location, productName);
    case 'Agricultural Services':
      return generateServicesSeo(subCategory, details, location, productName);
    default:
      return {
        title: `${productName || subCategory} in ${location?.district || 'Uganda'} | Nguza`,
        description: `Find ${productName || subCategory} and other agricultural items on Nguza.`,
        canonical: `${SITE_URL}/product/`,
        slug: 'product'
      };
  }
}