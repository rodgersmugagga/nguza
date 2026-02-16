import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Crop types reference collection
const cropTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grains & Cereals', 'Legumes & Pulses', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops']
  },
  commonVarieties: [{
    type: String,
    trim: true
  }],
  seasonality: {
    firstSeason: [{ type: Number, min: 1, max: 12 }],  // Months (1-12)
    secondSeason: [{ type: Number, min: 1, max: 12 }],
    yearRound: { type: Boolean, default: false }
  },
  averageYield: {
    value: Number,
    unit: String
  },
  description: String,
  icon: String  // Emoji or icon identifier
}, { timestamps: true });

// Indexes
cropTypeSchema.index({ name: 1 });
cropTypeSchema.index({ category: 1 });
cropTypeSchema.index({ name: 'text', 'commonVarieties': 'text' });

const CropType = mongoose.model('CropType', cropTypeSchema);

export default CropType;
