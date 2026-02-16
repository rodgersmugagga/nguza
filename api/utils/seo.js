const SITE_NAME = process.env.SITE_NAME || 'Agrova';
const SITE_URL = process.env.SITE_URL || 'https://agrova.example.com';

function slugify(text) {
  if (!text) return '';
  return text.toString().normalize('NFKD').replace(/[\u0000-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

function short(s, n) { return s ? s.substring(0, n) : ''; }

function generateCropsSeo(subCategory, details = {}, location = {}, listingName = '') {
  const district = location?.district || 'Uganda';
  const crop = details?.cropType || subCategory || listingName || 'Produce';
  const variety = details?.variety ? ` ${details.variety}` : '';
  const title = short(`${crop}${variety} for sale in ${district} | ${SITE_NAME}`, 70);
  const description = short(`Buy ${crop}${variety} in ${district}. ${details?.quantity ? `Available: ${details.quantity} ${details.unit || ''}. ` : ''}${details?.organic ? 'Organic produce. ' : ''}Find trusted sellers on ${SITE_NAME}.`, 160);
  const keywords = [
    `${crop} for sale`,
    `${crop} in ${district}`,
    `${subCategory}`,
    ...(details?.variety ? [details.variety] : []),
    ...(details?.organic ? ['organic'] : []),
    'agriculture', 'produce for sale', district
  ];
  const slug = slugify(`${crop} ${variety} ${district}`);
  const canonical = `${SITE_URL}/crops/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateLivestockSeo(subCategory, details = {}, location = {}, listingName = '') {
  const district = location?.district || 'Uganda';
  const animal = details?.animalType || subCategory || listingName || 'Livestock';
  const breed = details?.breed ? ` ${details.breed}` : '';
  const title = short(`${animal}${breed} for sale in ${district} | ${SITE_NAME}`, 70);
  const description = short(`Find ${animal}${breed} in ${district}. ${details?.quantity ? `Quantity: ${details.quantity}. ` : ''}${details?.healthStatus ? `${details.healthStatus}. ` : ''}Trusted sellers on ${SITE_NAME}.`, 160);
  const keywords = [
    `${animal} for sale`, `${animal} in ${district}`, ...(details?.breed ? [details.breed] : []), 'livestock', district
  ];
  const slug = slugify(`${animal} ${breed} ${district}`);
  const canonical = `${SITE_URL}/livestock/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateInputsSeo(subCategory, details = {}, location = {}, listingName = '') {
  const district = location?.district || 'Uganda';
  const product = details?.productName || subCategory || listingName || 'Input';
  const title = short(`${product} available in ${district} | ${SITE_NAME}`, 70);
  const description = short(`Buy ${product} in ${district}. ${details?.brand ? `Brand: ${details.brand}. ` : ''}${details?.quantity ? `Quantity: ${details.quantity} ${details.unit || ''}. ` : ''}Get certified inputs on ${SITE_NAME}.`, 160);
  const keywords = [product.toLowerCase(), `${product} ${district}`, 'fertilizer', 'seeds', 'agricultural inputs', district];
  const slug = slugify(`${product} ${district}`);
  const canonical = `${SITE_URL}/inputs/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateEquipmentSeo(subCategory, details = {}, location = {}, listingName = '') {
  const district = location?.district || 'Uganda';
  const equipment = details?.equipmentType || subCategory || listingName || 'Equipment';
  const title = short(`${equipment} for sale in ${district} | ${SITE_NAME}`, 70);
  const description = short(`Buy ${equipment} in ${district}. ${details?.brand ? `Brand: ${details.brand}. ` : ''}${details?.condition ? `${details.condition}. ` : ''}Find reliable equipment on ${SITE_NAME}.`, 160);
  const keywords = [equipment.toLowerCase(), `${equipment} ${district}`, 'agricultural equipment', district];
  const slug = slugify(`${equipment} ${district}`);
  const canonical = `${SITE_URL}/equipment/${slug}`;
  return { title, description, keywords, canonical, slug };
}

function generateServicesSeo(subCategory, details = {}, location = {}, listingName = '') {
  const district = location?.district || 'Uganda';
  const service = details?.serviceType || subCategory || listingName || 'Service';
  const title = short(`${service} in ${district} | ${SITE_NAME}`, 70);
  const description = short(`${service} available in ${district}. ${details?.priceModel ? `Price model: ${details.priceModel}. ` : ''}${details?.experience ? `Experience: ${details.experience}. ` : ''}Find trusted service providers on ${SITE_NAME}.`, 160);
  const keywords = [service.toLowerCase(), `${service} ${district}`, 'agricultural services', district];
  const slug = slugify(`${service} ${district}`);
  const canonical = `${SITE_URL}/services/${slug}`;
  return { title, description, keywords, canonical, slug };
}

export function generateSeo(category, subCategory, details = {}, location = {}, listingName = '') {
  if (!category) {
    return {
      title: `Agrova - Agriculture Marketplace`,
      description: `Buy and sell crops, livestock, inputs, equipment and services across Uganda on Agrova.`,
      keywords: ['agriculture', 'crops', 'livestock', 'agricultural inputs', 'equipment'],
      canonical: `${SITE_URL}/listings`,
      slug: 'listings'
    };
  }

  switch (category) {
    case 'Crops':
      return generateCropsSeo(subCategory, details, location, listingName);
    case 'Livestock':
      return generateLivestockSeo(subCategory, details, location, listingName);
    case 'Agricultural Inputs':
      return generateInputsSeo(subCategory, details, location, listingName);
    case 'Equipment & Tools':
      return generateEquipmentSeo(subCategory, details, location, listingName);
    case 'Agricultural Services':
      return generateServicesSeo(subCategory, details, location, listingName);
    default:
      return {
        title: `${subCategory || category} | ${SITE_NAME}`,
        description: `Find ${subCategory || category} across Uganda on ${SITE_NAME}.`,
        keywords: [category.toLowerCase(), 'agriculture', 'Uganda'],
        canonical: `${SITE_URL}/${slugify(category)}/${slugify(subCategory || '')}`,
        slug: slugify(`${category} ${subCategory || ''}`)
      };
  }
}

export default { generateSeo };