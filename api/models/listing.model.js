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

// Main listing schema
const listingSchema = new Schema({
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
    maxlength: 1000
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

  // Pricing
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
  negotiable: {
    type: Boolean,
    default: false
  },

  // Category-specific details (polymorphic)
  details: {
    // Crops fields
    cropType: String,
    variety: String,
    quantity: Number,
    unit: {
      type: String,
      enum: ['kg', 'bags', 'tonnes', 'crates', 'bunches', 'pieces', 'litres', 'acres', 'hectares', 'units', 'animals', 'hours', 'days']
    },
    pricePerUnit: Number,
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
    availability: {
      type: String,
      enum: ['In Stock', 'Pre-order', 'Seasonal', 'On Request'],
      default: 'In Stock'
    },

    // Livestock fields
    animalType: String,
    breed: String,
    age: String,
    weight: Number,
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Mixed']
    },
    healthStatus: String,
    purpose: {
      type: String,
      enum: ['Dairy', 'Meat', 'Breeding', 'Layers', 'Dual Purpose', 'Draught']
    },

    // Inputs fields
    productName: String,
    brand: String,
    composition: String,
    expiryDate: Date,
    certification: String,

    // Equipment fields
    equipmentType: String,
    model: String,
    condition: {
      type: String,
      enum: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair', 'Refurbished']
    },
    yearOfManufacture: Number,
    specifications: String,
    warranty: String,

    // Services fields
    serviceType: String,
    coverage: [String],
    priceModel: {
      type: String,
      enum: ['Per Acre', 'Per Hour', 'Per Day', 'Fixed Rate', 'Negotiable']
    },
    experience: String,
    certifications: [String]
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

  // Promotion metadata
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  featuredUntil: Date,
  featuredDistricts: [String],  // District-level promotion
  boosted: {
    type: Boolean,
    default: false
  },
  boostedUntil: Date,

  // Engagement tracking
  views: {
    type: Number,
    default: 0
  },
  contactClicks: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'suspended'],
    default: 'active',
    index: true
  },
  expiresAt: Date
}, {
  timestamps: true
});

// INDEXES (Agriculture-optimized)

// Text search index for agriculture-specific terms
listingSchema.index(
  {
    name: 'text',
    'details.cropType': 'text',
    'details.variety': 'text',
    'details.breed': 'text',
    'details.productName': 'text',
    'details.brand': 'text',
    'location.district': 'text',
    description: 'text'
  },
  {
    weights: {
      'details.cropType': 10,
      'details.variety': 8,
      'details.breed': 8,
      name: 5,
      'location.district': 4,
      'details.productName': 4,
      description: 1
    }
  }
);

// Compound indexes for common queries
listingSchema.index({ category: 1, subCategory: 1, 'location.district': 1, status: 1 });
listingSchema.index({ 'location.district': 1, 'location.subcounty': 1, category: 1, status: 1 });
listingSchema.index({ category: 1, 'details.cropType': 1, 'location.district': 1, status: 1 });
listingSchema.index({ 'details.harvestDate': 1, category: 1, status: 1 });
listingSchema.index({ userRef: 1, createdAt: -1 });
listingSchema.index({ regularPrice: 1, category: 1, status: 1 });
listingSchema.index({ 'details.pricePerUnit': 1, category: 1, status: 1 });
listingSchema.index({ isFeatured: 1, featuredUntil: -1, 'location.district': 1 });
listingSchema.index({ boosted: 1, boostedUntil: -1, status: 1 });
listingSchema.index({ createdAt: -1, status: 1 });
listingSchema.index({ status: 1, expiresAt: 1 });

// Geospatial index for location-based search
listingSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for calculating total price
listingSchema.virtual('totalPrice').get(function () {
  if (this.details?.pricePerUnit && this.details?.quantity) {
    return this.details.pricePerUnit * this.details.quantity;
  }
  return this.regularPrice;
});

// Pre-save middleware to calculate expiry date
listingSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const now = new Date();

    if (this.category === 'Crops' && this.details?.harvestDate) {
      // Expire 2 weeks after harvest for fresh produce
      this.expiresAt = new Date(this.details.harvestDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else if (this.category === 'Livestock') {
      // Expire after 60 days for livestock
      this.expiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    } else if (this.category === 'Agricultural Services') {
      // Services don't expire
      this.expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      // Default: 90 days
      this.expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

// Method to check if listing is expired
listingSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Method to increment views
listingSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save();
};

// Method to increment contact clicks
listingSchema.methods.incrementContactClicks = async function () {
  this.contactClicks += 1;
  return this.save();
};

const Listing = mongoose.model('Listing', listingSchema);

export { AGRICULTURE_CATEGORIES };
export default Listing;
