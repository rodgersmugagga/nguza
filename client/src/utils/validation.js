/**
 * Form Validation Utilities
 * Production-grade validation for all forms
 */

/**
 * Validate listing creation/update form
 * @param {Object} data - Form data
 * @returns {Array} Array of error messages
 */
export const validateListing = (data) => {
  const errors = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push('Listing name is required');
  } else if (data.name.trim().length < 5) {
    errors.push('Name must be at least 5 characters');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  if (!data.description?.trim()) {
    errors.push('Description is required');
  } else if (data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (data.description.trim().length > 2000) {
    errors.push('Description must not exceed 2000 characters');
  }

  if (!data.address?.trim()) {
    errors.push('Address is required');
  } else if (data.address.trim().length < 3) {
    errors.push('Address must be at least 3 characters');
  }

  // Price validation
  const regPrice = parseFloat(data.regularPrice);
  if (isNaN(regPrice) || regPrice <= 0) {
    errors.push('Regular price must be a positive number');
  }

  if (data.offer) {
    const discPrice = parseFloat(data.discountedPrice);
    if (isNaN(discPrice) || discPrice <= 0) {
      errors.push('Discounted price must be a positive number');
    } else if (discPrice >= regPrice) {
      errors.push('Discounted price must be less than regular price');
    }
  }

  // Image validation
  if (!data.imageUrls || data.imageUrls.length === 0) {
    errors.push('At least 1 image is required');
  } else if (data.imageUrls.length > 6) {
    errors.push('Maximum 6 images allowed');
  }

  // Category validation
  if (!data.category) {
    errors.push('Category is required');
  } else {
    const validCategories = ['Crops', 'Livestock', 'Agricultural Inputs', 'Equipment & Tools', 'Agricultural Services'];
    if (!validCategories.includes(data.category)) {
      errors.push('Invalid category selected');
    }
  }

  if (!data.subCategory) {
    errors.push('Subcategory is required');
  }

  // Category-specific validations
  // Category-specific validations for agriculture-first fields
  if (data.category === 'Crops') {
    if (!data.details?.cropType?.trim()) {
      errors.push('Crop type is required for crop listings');
    }
    if (typeof data.details?.quantity === 'undefined' || Number(data.details.quantity) <= 0) {
      errors.push('Quantity must be a positive number for crop listings');
    }
    if (!data.details?.unit) {
      errors.push('Unit (kg, bags, tonnes, etc.) is required for crop listings');
    }
    if (typeof data.details?.pricePerUnit === 'undefined' || Number(data.details.pricePerUnit) <= 0) {
      errors.push('Price per unit must be a positive number for crop listings');
    }
  }

  if (data.category === 'Livestock') {
    if (!data.details?.animalType?.trim()) {
      errors.push('Animal type is required for livestock listings');
    }
    if (typeof data.details?.quantity === 'undefined' || Number(data.details.quantity) <= 0) {
      errors.push('Quantity must be a positive number for livestock listings');
    }
  }

  if (data.category === 'Agricultural Inputs') {
    if (!data.details?.productName?.trim()) {
      errors.push('Product name is required for inputs');
    }
    if (typeof data.details?.quantity === 'undefined' || Number(data.details.quantity) <= 0) {
      errors.push('Quantity must be a positive number for inputs');
    }
  }

  if (data.category === 'Equipment & Tools') {
    if (!data.details?.equipmentType?.trim()) {
      errors.push('Equipment type is required');
    }
    if (!data.details?.condition) {
      errors.push('Condition is required for equipment listings');
    }
  }

  if (data.category === 'Agricultural Services') {
    if (!data.details?.serviceType?.trim()) {
      errors.push('Service type is required for service listings');
    }
    if (!data.details?.priceModel) {
      errors.push('Price model is required for service listings');
    }
  }

  return errors;
};

/**
 * Validate sign up form
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password
 * @param {string} phoneNumber - Phone number
 * @returns {Array} Array of error messages
 */
export const validateSignUp = (username, email, password, phoneNumber) => {
  const errors = [];

  // Username validation
  if (!username?.trim()) {
    errors.push('Username is required');
  } else if (username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  // Phone number validation
  if (!phoneNumber?.trim()) {
    errors.push('Phone number is required');
  } else {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      errors.push('Please enter a valid Ugandan phone number');
    }
  }

  // Email validation (Optional)
  if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

/**
 * Validate sign in form
 * @param {string} phoneNumber - Phone number
 * @param {string} password - Password
 * @returns {Array} Array of error messages
 */
export const validateSignIn = (phoneNumber, password) => {
  const errors = [];

  if (!phoneNumber?.trim()) {
    errors.push('Phone number is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};


/**
 * Validate image files
 * @param {File[]} files - Array of file objects
 * @returns {Array} Array of error messages
 */
export const validateImages = (files) => {
  const errors = [];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!files || files.length === 0) {
    errors.push('At least one image is required');
    return errors;
  }

  if (files.length > 6) {
    errors.push('Maximum 6 images allowed');
  }

  files.forEach((file, index) => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Image ${index + 1}: Only JPEG, PNG, WebP, and GIF are allowed`);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Image ${index + 1}: File size must be less than 5MB`);
    }
  });

  return errors;
};

/**
 * Validate profile update form
 * @param {Object} data - Form data (username, email, password)
 * @returns {Array} Array of error messages
 */
export const validateProfileUpdate = (data) => {
  const errors = [];

  // Username validation
  if (data.username?.trim()) {
    if (data.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    }
  }

  // Phone number validation
  if (data.phoneNumber?.trim()) {
    const cleanPhone = data.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      errors.push('Please enter a valid Ugandan phone number');
    }
  }

  // Email validation
  if (data.email?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Password validation
  if (data.password) {
    if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  }

  return errors;
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Trim and normalize input
 * @param {Object} data - Form data object
 * @returns {Object} Normalized data
 */
export const normalizeFormData = (data) => {
  const normalized = { ...data };

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim();
    }
  });

  return normalized;
};
