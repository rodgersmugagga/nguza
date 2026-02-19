const SITE_NAME = 'Nguza';
const SITE_URL = 'https://nguza.onrender.com';

// Comprehensive Uganda city/neighborhood data with search variations
const UG_CITIES = [
  { name: 'Kampala', aliases: ['Kampala', 'KCCA', 'Kampala City'] },
  { name: 'Entebbe', aliases: ['Entebbe', 'Entebbe City'] },
  { name: 'Jinja', aliases: ['Jinja', 'Jinja City'] },
  { name: 'Mbarara', aliases: ['Mbarara', 'Mbarara City'] },
  { name: 'Gulu', aliases: ['Gulu', 'Gulu City'] },
  { name: 'Mbale', aliases: ['Mbale', 'Mbale Town'] },
  { name: 'Fort Portal', aliases: ['Fort Portal', 'Fort-Portal'] },
  { name: 'Masaka', aliases: ['Masaka', 'Masaka City'] },
  { name: 'Kabale', aliases: ['Kabale', 'Kabale Town'] },
  { name: 'Soroti', aliases: ['Soroti', 'Soroti City'] },
  { name: 'Lira', aliases: ['Lira', 'Lira City'] },
  { name: 'Hoima', aliases: ['Hoima', 'Hoima City'] },
];

const NEIGHBORHOODS = {
  'Kampala': ['Kampala CBD', 'Kololo', 'Nakasero', 'Muyenga', 'Buziga', 'Bunga', 'Makindye', 'Nakawa', 'Lubaga', 'Kawempe'],
  'Entebbe': ['Entebbe Town', 'Port Bell', 'Zzansi', 'Kitoro'],
  'Jinja': ['Jinja Town', 'Jinja Industrial', 'Mbulamutumbi'],
  'Mbarara': ['Mbarara Town', 'Kamukuzi', 'Nyamityobora'],
};

// Agriculture-specific brand examples (optional)
const AGRI_BRANDS = ['John Deere', 'New Holland', 'AGCO', 'Ugama', 'NASECO'];

/**
 * Slugify text: lowercase, remove special chars, dash-separated
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Find city from address/location string
 */
function extractCity(addressOrDetails) {
  if (!addressOrDetails) return null;
  const lowercase = addressOrDetails.toString().toLowerCase();
  for (const cityData of UG_CITIES) {
    for (const alias of cityData.aliases) {
      if (lowercase.includes(alias.toLowerCase())) {
        return cityData.name;
      }
    }
  }
  return null;
}

/**
 * Extract neighborhood from address (if applicable)
 */
function extractNeighborhood(address, city) {
  if (!address || !city || !NEIGHBORHOODS[city]) return null;
  const lowercase = address.toString().toLowerCase();
  for (const hood of NEIGHBORHOODS[city]) {
    if (lowercase.includes(hood.toLowerCase())) {
      return hood;
    }
  }
  return null;
}

/**
 * Generate SEO metadata for Crop listings
 */
function generateCropSeo(subCategory, details, address) {
  const city = extractCity(address) || 'Uganda';
  const neighborhood = extractNeighborhood(address, city);
  const crop = details?.cropType || subCategory || '';
  const qty = details?.quantity ? `${details.quantity} ${details.unit || ''}`.trim() : '';
  const price = details?.pricePerUnit ? `${details.pricePerUnit}` : '';

  const locationStr = neighborhood ? `in ${neighborhood}, ${city}` : `in ${city}`;
  const title = `${crop} ${qty ? `- ${qty}` : ''} ${locationStr} | ${SITE_NAME}`.substring(0, 70);

  const description = `Purchase ${crop}${qty ? `: ${qty}` : ''} ${locationStr}. ${details?.organic ? 'Organic produce.' : ''} ${SITE_NAME} connects buyers and sellers across Uganda.`.substring(0, 160);

  const keywords = [
    `${crop} for sale`,
    `${crop} ${city}`,
    ...(neighborhood ? [`${crop} ${neighborhood}`] : []),
    ...(price ? [`${price} UGX per ${details.unit || 'unit'}`] : []),
    'crops Uganda',
    city
  ];

  const slug = slugify(`${crop} ${city}`);
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateLivestockSeo(subCategory, details, address) {
  const city = extractCity(address) || 'Uganda';
  const neighborhood = extractNeighborhood(address, city);
  const animal = details?.animalType || subCategory || '';
  const breed = details?.breed || '';
  const qty = details?.quantity ? `${details.quantity}` : '';

  const locationStr = neighborhood ? `in ${neighborhood}, ${city}` : `in ${city}`;
  const title = `${animal} ${breed ? `(${breed})` : ''} ${qty ? `- ${qty}` : ''} ${locationStr} | ${SITE_NAME}`.substring(0, 70);
  const description = `${animal} ${breed ? `(${breed})` : ''}${qty ? `: ${qty} available` : ''} ${locationStr}. Find healthy livestock and trusted sellers on ${SITE_NAME}.`.substring(0, 160);
  const keywords = [
    `${animal} for sale`,
    ...(breed ? [`${breed} ${animal}`] : []),
    city,
    'livestock Uganda'
  ];
  const slug = slugify(`${animal} ${city}`);
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateInputsSeo(subCategory, details, address) {
  const city = extractCity(address) || 'Uganda';
  const product = details?.productName || subCategory || '';
  const qty = details?.quantity ? `${details.quantity} ${details.unit || ''}`.trim() : '';
  const title = `${product} ${qty ? `- ${qty}` : ''} in ${city} | ${SITE_NAME}`.substring(0, 70);
  const description = `${product} ${qty ? `available: ${qty}` : ''} in ${city}. Buy quality farm inputs on ${SITE_NAME}.`.substring(0, 160);
  const keywords = [product, `${product} ${city}`, 'farm inputs', city];
  const slug = slugify(`${product} ${city}`);
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateEquipmentSeo(subCategory, details, address) {
  const city = extractCity(address) || 'Uganda';
  const equipment = details?.equipmentType || subCategory || '';
  const brand = details?.brand || '';
  const condition = details?.condition || '';
  const title = `${brand ? `${brand} ` : ''}${equipment} ${condition ? `- ${condition}` : ''} in ${city} | ${SITE_NAME}`.substring(0, 70);
  const description = `${brand ? `${brand} ` : ''}${equipment} ${condition ? `${condition}` : ''} available in ${city}. Find reliable farm machinery and tools on ${SITE_NAME}.`.substring(0, 160);
  const keywords = [equipment, brand, city, 'farm equipment'];
  const slug = slugify(`${brand} ${equipment} ${city}`);
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateServiceSeo(subCategory, details, address) {
  const city = extractCity(address) || 'Uganda';
  const service = details?.serviceType || subCategory || '';
  const title = `${service} in ${city} | ${SITE_NAME}`.substring(0, 70);
  const description = `${service} covering ${details?.coverage || city}. Experienced providers listed on ${SITE_NAME}.`.substring(0, 160);
  const keywords = [service, `${service} ${city}`, 'agricultural services', city];
  const slug = slugify(`${service} ${city}`);
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;
  return { title, description, keywords, canonical, slug };
}



/**
 * Advanced SEO generator - main export
 * @param {string} category - e.g., 'Crops', 'Livestock', 'Agricultural Inputs'
 * @param {string} subCategory - e.g., 'Grains & Cereals', 'Cattle', 'Fertilizers'
 * @param {object} details - Category-specific details (cropType, quantity, unit, breed, pricePerUnit, etc.)
 * @param {string|object} address - Full address/location string or location object
 * @returns {object} { title, description, keywords, canonical, slug }
 */
export function generateSeo(category, subCategory, details = {}, address = '') {
  // Validate inputs
  if (!category || !subCategory) {
    return {
      title: `Listings on ${SITE_NAME}`,
      description: `Find great deals and listings across Uganda on ${SITE_NAME}.`,
      keywords: ['listings', 'buy', 'sell', 'Uganda'],
      canonical: `${SITE_URL}/listings`,
      slug: 'listings',
    };
  }

  // Route to category-specific generator
  switch (category) {
    case 'Crops':
      return generateCropSeo(subCategory, details, address);
    case 'Livestock':
      return generateLivestockSeo(subCategory, details, address);
    case 'Agricultural Inputs':
      return generateInputsSeo(subCategory, details, address);
    case 'Equipment & Tools':
      return generateEquipmentSeo(subCategory, details, address);
    case 'Agricultural Services':
      return generateServiceSeo(subCategory, details, address);
    default:
      // Fallback for unknown categories
      return {
        title: `${subCategory} on ${SITE_NAME}`,
        description: `Find ${subCategory.toLowerCase()} across Uganda on ${SITE_NAME}.`,
        keywords: [subCategory.toLowerCase(), 'listings', 'Uganda'],
        canonical: `${SITE_URL}/${slugify(category)}/${slugify(subCategory)}`,
        slug: slugify(`${category} ${subCategory}`),
      };
  }
}

export default { generateSeo };
