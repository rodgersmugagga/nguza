import mongoose from 'mongoose';

// Middleware factory to validate an ObjectId in req.params under the given param name (default: 'id')
export const validateObjectIdParam = (paramName = 'id') => (req, res, next) => {
  const id = req.params?.[paramName];
  if (!id) return next();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: `Invalid id for param '${paramName}'` });
  }
  return next();
};

// Helper to validate arbitrary id strings (body/query) - returns boolean
export const isValidObjectIdString = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

export default validateObjectIdParam;
