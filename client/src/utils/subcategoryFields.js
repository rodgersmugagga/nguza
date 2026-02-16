/**
 * Define which fields are required/optional for each subcategory
 * This ensures each subcategory has its own specific field set
 */
export const SUBCATEGORY_FIELDS = {
  'Crops': {
    'Grains & Cereals': {
      fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'harvestDate', 'grade', 'organic', 'season', 'availability'],
      required: ['cropType', 'quantity', 'unit', 'pricePerUnit']
    },
    'Legumes & Pulses': { fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'harvestDate', 'grade', 'organic'], required: ['cropType', 'quantity', 'unit', 'pricePerUnit'] },
    'Vegetables': { fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'harvestDate', 'organic'], required: ['cropType', 'quantity', 'unit', 'pricePerUnit'] },
    'Fruits': { fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'harvestDate', 'organic'], required: ['cropType', 'quantity', 'unit', 'pricePerUnit'] },
    'Root Crops': { fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'harvestDate'], required: ['cropType', 'quantity', 'unit', 'pricePerUnit'] },
    'Cash Crops': { fields: ['cropType', 'variety', 'quantity', 'unit', 'pricePerUnit', 'season'], required: ['cropType', 'quantity', 'unit', 'pricePerUnit'] }
  },
  'Livestock': {
    'Cattle': { fields: ['animalType', 'breed', 'quantity', 'age', 'weight', 'sex', 'healthStatus', 'purpose'], required: ['animalType', 'quantity'] },
    'Goats & Sheep': { fields: ['animalType', 'breed', 'quantity', 'age', 'weight', 'sex', 'healthStatus'], required: ['animalType', 'quantity'] },
    'Poultry': { fields: ['animalType', 'breed', 'quantity', 'age', 'weight', 'healthStatus'], required: ['animalType', 'quantity'] },
    'Pigs': { fields: ['animalType', 'breed', 'quantity', 'age', 'weight', 'healthStatus'], required: ['animalType', 'quantity'] },
    'Fish & Aquaculture': { fields: ['animalType', 'breed', 'quantity', 'age', 'weight', 'healthStatus'], required: ['animalType', 'quantity'] },
    'Other Livestock': { fields: ['animalType', 'breed', 'quantity', 'age', 'healthStatus'], required: ['animalType', 'quantity'] }
  },
  'Agricultural Inputs': {
    'Seeds & Seedlings': { fields: ['productName', 'brand', 'quantity', 'unit', 'expiryDate', 'certification'], required: ['productName', 'quantity', 'unit'] },
    'Fertilizers': { fields: ['productName', 'brand', 'quantity', 'unit', 'composition', 'certification'], required: ['productName', 'quantity', 'unit'] },
    'Pesticides & Chemicals': { fields: ['productName', 'brand', 'quantity', 'unit', 'composition', 'expiryDate', 'certification'], required: ['productName', 'quantity', 'unit'] },
    'Animal Feed': { fields: ['productName', 'brand', 'quantity', 'unit', 'composition'], required: ['productName', 'quantity', 'unit'] },
    'Veterinary Products': { fields: ['productName', 'brand', 'quantity', 'unit', 'expiryDate', 'certification'], required: ['productName', 'quantity', 'unit'] }
  },
  'Equipment & Tools': {
    'Tractors & Machinery': { fields: ['equipmentType', 'brand', 'model', 'condition', 'yearOfManufacture', 'specifications', 'warranty'], required: ['equipmentType', 'condition'] },
    'Hand Tools': { fields: ['equipmentType', 'brand', 'condition', 'specifications'], required: ['equipmentType'] },
    'Irrigation Equipment': { fields: ['equipmentType', 'brand', 'condition', 'specifications'], required: ['equipmentType'] },
    'Processing Equipment': { fields: ['equipmentType', 'brand', 'condition', 'specifications'], required: ['equipmentType'] },
    'Transport Equipment': { fields: ['equipmentType', 'brand', 'condition', 'specifications'], required: ['equipmentType'] }
  },
  'Agricultural Services': {
    'Land Preparation': { fields: ['serviceType', 'coverage', 'priceModel', 'availability', 'experience'], required: ['serviceType', 'priceModel'] },
    'Planting Services': { fields: ['serviceType', 'coverage', 'priceModel', 'availability'], required: ['serviceType', 'priceModel'] },
    'Harvesting Services': { fields: ['serviceType', 'coverage', 'priceModel', 'availability'], required: ['serviceType', 'priceModel'] },
    'Transport & Logistics': { fields: ['serviceType', 'coverage', 'priceModel', 'availability'], required: ['serviceType'] },
    'Veterinary Services': { fields: ['serviceType', 'coverage', 'priceModel', 'experience', 'certifications'], required: ['serviceType'] },
    'Agronomy Services': { fields: ['serviceType', 'coverage', 'priceModel', 'experience'], required: ['serviceType'] }
  }
};

/**
 * Get field configuration for a specific subcategory
 */
export const getSubcategoryConfig = (category, subCategory) => {
  return SUBCATEGORY_FIELDS[category]?.[subCategory] || { fields: [], required: [] };
};

/**
 * Get all fields for rendering in a subcategory
 */
export const getFieldsForSubcategory = (category, subCategory) => {
  const config = getSubcategoryConfig(category, subCategory);
  return config.fields || [];
};

/**
 * Check if a field is required for a subcategory
 */
export const isFieldRequired = (category, subCategory, fieldName) => {
  const config = getSubcategoryConfig(category, subCategory);
  return config.required?.includes(fieldName) || false;
};

/**
 * Field metadata for rendering (label, type, options, etc.)
 * Now category-aware for better examples
 */
export const FIELD_METADATA = {
  // Agriculture-first metadata
  cropType: { label: 'Crop Type', type: 'text', placeholder: 'e.g., Maize, Beans' },
  variety: { label: 'Variety', type: 'text', placeholder: 'e.g., Longe 10H' },
  quantity: { label: 'Quantity', type: 'number', min: 0 },
  unit: { label: 'Unit', type: 'select', options: [ { value: 'kg', label: 'kg' }, { value: 'bags', label: 'bags' }, { value: 'tonnes', label: 'tonnes' }, { value: 'crates', label: 'crates' }, { value: 'bunches', label: 'bunches' }, { value: 'pieces', label: 'pieces' }, { value: 'litres', label: 'litres' }, { value: 'acres', label: 'acres' }, { value: 'hectares', label: 'hectares' }, { value: 'units', label: 'units' }, { value: 'animals', label: 'animals' }, { value: 'hours', label: 'hours' }, { value: 'days', label: 'days' } ] },
  pricePerUnit: { label: 'Price per Unit (UGX)', type: 'number', min: 0 },
  harvestDate: { label: 'Harvest Date', type: 'text', placeholder: 'YYYY-MM-DD' },
  grade: { label: 'Grade', type: 'select', options: [ { value: 'Grade A', label: 'Grade A' }, { value: 'Grade B', label: 'Grade B' }, { value: 'Mixed', label: 'Mixed' } ] },
  organic: { label: 'Organic', type: 'radio', options: [ { value: true, label: 'Yes' }, { value: false, label: 'No' } ] },
  season: { label: 'Season', type: 'select', options: [ { value: 'First Season', label: 'First Season' }, { value: 'Second Season', label: 'Second Season' }, { value: 'Year-round', label: 'Year-round' }, { value: 'Dry Season', label: 'Dry Season' }, { value: 'Rainy Season', label: 'Rainy Season' } ] },
  availability: { label: 'Availability', type: 'select', options: [ { value: 'In Stock', label: 'In Stock' }, { value: 'Pre-order', label: 'Pre-order' }, { value: 'Seasonal', label: 'Seasonal' }, { value: 'On Request', label: 'On Request' } ] },

  // Livestock
  animalType: { label: 'Animal Type', type: 'text', placeholder: 'e.g., Cattle, Goats' },
  breed: { label: 'Breed', type: 'text', placeholder: 'e.g., Friesian' },
  age: { label: 'Age', type: 'text', placeholder: 'e.g., 6 months' },
  weight: { label: 'Weight (kg)', type: 'number', min: 0 },
  sex: { label: 'Sex', type: 'select', options: [ { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Mixed', label: 'Mixed' } ] },
  healthStatus: { label: 'Health Status', type: 'text', placeholder: 'e.g., Vaccinated' },
  purpose: { label: 'Purpose', type: 'select', options: [ { value: 'Dairy', label: 'Dairy' }, { value: 'Meat', label: 'Meat' }, { value: 'Breeding', label: 'Breeding' } ] },

  // Inputs/Equipment/Services
  productName: { label: 'Product Name', type: 'text', placeholder: 'e.g., NPK Fertilizer' },
  brand: { label: 'Brand', type: 'text', placeholder: 'e.g., Bayer' },
  composition: { label: 'Composition', type: 'text', placeholder: 'e.g., 17-17-17' },
  expiryDate: { label: 'Expiry Date', type: 'text', placeholder: 'YYYY-MM-DD' },
  certification: { label: 'Certification', type: 'text', placeholder: 'e.g., Certified' },
  equipmentType: { label: 'Equipment Type', type: 'text', placeholder: 'e.g., Tractor' },
  model: { label: 'Model', type: 'text' },
  condition: { label: 'Condition', type: 'select', options: [ { value: 'New', label: 'New' }, { value: 'Used - Excellent', label: 'Used - Excellent' }, { value: 'Used - Good', label: 'Used - Good' }, { value: 'Used - Fair', label: 'Used - Fair' } ] },
  specifications: { label: 'Specifications', type: 'text', placeholder: 'Technical specifications' },
  warranty: { label: 'Warranty', type: 'text', placeholder: 'Warranty details' },
  serviceType: { label: 'Service Type', type: 'text', placeholder: 'e.g., Land Preparation' },
  coverage: { label: 'Coverage (districts)', type: 'text', placeholder: 'e.g., Lwengo, Kyazanga' },
  priceModel: { label: 'Price Model', type: 'select', options: [ { value: 'Per Acre', label: 'Per Acre' }, { value: 'Per Hour', label: 'Per Hour' }, { value: 'Fixed Rate', label: 'Fixed Rate' } ] },
  experience: { label: 'Experience (years)', type: 'text' },
  certifications: { label: 'Certifications', type: 'text', placeholder: 'Comma-separated' },
  // Some fields are stored as arrays in the model; UI may accept comma-separated input
  coverageArray: { label: 'Coverage Districts (comma-separated)', type: 'text', placeholder: 'e.g., Lwengo, Kyazanga' },
  certificationsArray: { label: 'Certifications (comma-separated)', type: 'text', placeholder: 'e.g., NAGRC, ISO' }
};
