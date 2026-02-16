import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Livestock breeds reference collection
const livestockBreedSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  animalType: {
    type: String,
    required: true,
    enum: ['Cattle', 'Goats', 'Sheep', 'Poultry', 'Pigs', 'Fish', 'Rabbits', 'Other']
  },
  purpose: [{
    type: String,
    enum: ['Dairy', 'Meat', 'Breeding', 'Layers', 'Dual Purpose', 'Draught']
  }],
  characteristics: {
    averageWeight: {
      value: Number,
      unit: { type: String, default: 'kg' }
    },
    maturityAge: String,
    productionRate: String
  },
  description: String,
  icon: String  // Emoji or icon identifier
}, { timestamps: true });

// Indexes
livestockBreedSchema.index({ name: 1 });
livestockBreedSchema.index({ animalType: 1 });
livestockBreedSchema.index({ name: 'text' });

const LivestockBreed = mongoose.model('LivestockBreed', livestockBreedSchema);

export default LivestockBreed;
