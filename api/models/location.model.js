import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Location hierarchy for Uganda
const locationSchema = new Schema({
  district: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subcounty: {
    type: String,
    required: true,
    trim: true
  },
  parish: {
    type: String,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },
  // GeoJSON for location-based queries
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
}, { _id: false });

// District reference collection
const districtSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  region: { type: String, enum: ['Central', 'Eastern', 'Northern', 'Western'], required: true },
  code: { type: String, unique: true },
  subcounties: [{
    name: { type: String, required: true },
    parishes: [{ type: String }]
  }]
}, { timestamps: true });

// Indexes
districtSchema.index({ name: 1 });
districtSchema.index({ region: 1 });
districtSchema.index({ 'subcounties.name': 1 });

const District = mongoose.model('District', districtSchema);

export { locationSchema, District };
export default District;
