import mongoose from 'mongoose';
import { locationSchema } from './location.model.js';

const Schema = mongoose.Schema;

// Agriculture categories and subcategories
const AGRICULTURE_CATEGORIES = {
  'Crops': ['Grains & Cereals', 'Legumes & Pulses', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops'],
  'Livestock': ['Cattle', 'Goats & Sheep', 'Poultry', 'Pigs', 'Fish & Aquaculture', 'Other Livestock'],
  'Agricultural Inputs': ['Seeds & Seedlings', 'Fertilizers', 'Pesticides & Chemicals', 'Animal Feed', 'Veterinary Products'],
  'Equipment & Tools': ['Tractors & Machinery', 'Hand Tools', 'Irrigation Equipment', 'Processing Equipment', 'Transport Equipment'],
  'Agricultural Services': ['Land Preparation', 'Planting Services', 'Harvesting Services', 'Transport & Logistics', 'Veterinary Services', 'Agronomy Services']
};

const variantSchema = new Schema({
  name: { type: String, required: true }, // e.g., "50kg Bag", "Small", "Red"
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  weight: { type: Number }, // in kg
  images: [String]
});

// Main Product schema
const productSchema = new Schema({
  // Basic info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },

  // Brand/Manufacturer (optional)
  brand: {
    type: String,
    trim: true
  },

  // Category
  category: {
    type: String,
    required: true,
    enum: Object.keys(AGRICULTURE_CATEGORIES)
  },
  subCategory: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return AGRICULTURE_CATEGORIES[this.category]?.includes(v);
      },
      message: props => `${props.value} is not valid for ${props.instance.category}`
    }
  },

  // Location (hierarchical)
  location: {
    type: locationSchema,
    required: true
  },

  // Pricing & Inventory (Root level if no variants)
  regularPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  offer: {
    type: Boolean,
    default: false
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  // Variants (Optional)
  hasVariants: {
    type: Boolean,
    default: false
  },
  variants: {
    type: [variantSchema],
    default: []
  },

  // Category-specific details (polymorphic)
  details: {
    // Crops fields
    cropType: String,
    variety: String,
    harvestDate: Date,
    grade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C', 'Mixed', 'Premium', 'Standard']
    },
    organic: Boolean,
    season: {
      type: String,
      enum: ['First Season', 'Second Season', 'Year-round', 'Dry Season', 'Rainy Season']
    },

    // Livestock fields
    animalType: String,
    breed: String,
    age: String,
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Mixed']
    },
    healthStatus: String,

    // Inputs/Equipment fields
    expiryDate: Date,
    condition: {
      type: String,
      enum: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair', 'Refurbished']
    },

    // Services fields
    serviceType: String,
    coverage: [String]
  },

  // Images
  imageUrls: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length >= 1 && v.length <= 10;
      },
      message: 'Must have between 1 and 10 images'
    }
  },
  imagePublicIds: {
    type: [String],
    default: []
  },

  // Seller
  userRef: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sellerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },

  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },

  // Promotion metadata
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },

  // Engagement tracking
  views: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'suspended', 'draft'],
    default: 'active',
    index: true
  }

}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text', description: 'text', brand: 'text', 'details.cropType': 'text', 'details.variety': 'text' });
productSchema.index({ category: 1, subCategory: 1, 'location.district': 1, status: 1 });
productSchema.index({ 'location.district': 1, status: 1 });
productSchema.index({ userRef: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export { AGRICULTURE_CATEGORIES };
export default Product;
