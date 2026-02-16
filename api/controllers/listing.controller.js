import Listing, { AGRICULTURE_CATEGORIES } from "../models/listing.model.js";
import User from "../models/user.model.js";
import { generateSeo } from '../utils/seo.js';

// Agriculture-specific validation
function validateAgricultureDetails(category, subCategory, details) {
  const errors = [];

  if (category === 'Crops') {
    if (!details.cropType) errors.push('Crop type is required for crops');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (!details.unit) errors.push('Unit is required (kg, bags, tonnes, etc.)');
    if (!details.pricePerUnit || details.pricePerUnit <= 0) errors.push('Price per unit is required');
  }

  if (category === 'Livestock') {
    if (!details.animalType) errors.push('Animal type is required for livestock');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
  }

  if (category === 'Agricultural Inputs') {
    if (!details.productName) errors.push('Product name is required for inputs');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (!details.unit) errors.push('Unit is required');
  }

  if (category === 'Equipment & Tools') {
    if (!details.equipmentType) errors.push('Equipment type is required');
    if (!details.condition) errors.push('Condition is required');
  }

  if (category === 'Agricultural Services') {
    if (!details.serviceType) errors.push('Service type is required');
    if (!details.priceModel) errors.push('Price model is required');
  }

  return errors;
}

export const createListing = async (req, res, next) => {
  const uploadedImages = [];
  try {
    const payload = req.body || {};

    // Basic validation
    if ((!req.files || req.files.length < 1) && (!payload.imageUrls || payload.imageUrls.length < 1)) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    if (req.files?.length > 10 || (payload.imageUrls && payload.imageUrls.length > 10)) {
      return res.status(400).json({ message: 'Maximum 10 images allowed' });
    }

    // Validate category
    if (!payload.category || !AGRICULTURE_CATEGORIES[payload.category]) {
      return res.status(400).json({
        message: 'Invalid or missing category.',
        validCategories: Object.keys(AGRICULTURE_CATEGORIES)
      });
    }

    // Validate subcategory
    if (!payload.subCategory || !AGRICULTURE_CATEGORIES[payload.category].includes(payload.subCategory)) {
      return res.status(400).json({
        message: 'Invalid or missing subCategory for the selected category.',
        validSubcategories: AGRICULTURE_CATEGORIES[payload.category]
      });
    }

    // Validate location
    if (!payload.location || !payload.location.district || !payload.location.subcounty) {
      return res.status(400).json({
        message: 'Location with district and subcounty is required'
      });
    }

    // Validate agriculture-specific details
    const incomingDetails = payload.details || {};
    const detailErrors = validateAgricultureDetails(payload.category, payload.subCategory, incomingDetails);
    if (detailErrors.length > 0) {
      return res.status(400).json({
        message: 'Invalid details for this category',
        errors: detailErrors
      });
    }

    const userRef = req.user?.user?.id || req.user?.id || payload.userRef;
    if (!userRef) return res.status(401).json({ message: 'Missing user reference. Authenticate or include userRef.' });

    // Upload images if present
    let imageUrls = payload.imageUrls || [];
    let imagePublicIds = payload.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const uploadPromises = req.files.map(async (file) => {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'Nguza_listings',
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
        });
        return { url: result.secure_url || result.url, public_id: result.public_id };
      });

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(r => r.url);
      imagePublicIds = results.map(r => r.public_id);
      uploadedImages.push(...imagePublicIds);
    }

    // Generate SEO metadata
    const seoData = generateSeo(payload.category, payload.subCategory, incomingDetails, payload.location);

    // Resolve seller email and phone
    let resolvedSellerEmail = payload.sellerEmail || undefined;
    let resolvedContactPhone = payload.contactPhone || undefined;

    try {
      if (userRef && (!resolvedSellerEmail || !resolvedContactPhone)) {
        const userDoc = await User.findById(userRef).lean();
        if (userDoc?.email) resolvedSellerEmail = userDoc.email;
        if (userDoc?.phoneNumber) resolvedContactPhone = userDoc.phoneNumber;
      }
    } catch (e) {
      console.error('Failed to resolve seller info at create time', e?.message || e);
    }

    const toCreate = {
      name: payload.name,
      description: payload.description,
      category: payload.category,
      subCategory: payload.subCategory,
      location: payload.location,
      regularPrice: payload.regularPrice,
      discountedPrice: payload.discountedPrice,
      offer: payload.offer || false,
      negotiable: payload.negotiable || false,
      details: incomingDetails,
      imageUrls,
      imagePublicIds,
      userRef,
      sellerEmail: resolvedSellerEmail,
      contactPhone: resolvedContactPhone,
      isFeatured: payload.isFeatured || false,
      featuredUntil: payload.featuredUntil || null,
      boosted: payload.boosted || false,
      boostedUntil: payload.boostedUntil || null,
      seo: seoData,
      slug: seoData?.slug,
    };

    const listing = await Listing.create(toCreate);
    return res.status(201).json({ success: true, listing });

  } catch (error) {
    console.error('Create listing error:', error);

    // Cleanup uploaded images if error
    if (uploadedImages.length > 0) {
      try {
        const cloudinary = (await import('../utils/cloudinary.js')).default;
        await Promise.all(uploadedImages.map(pid => cloudinary.uploader.destroy(pid)));
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

    next(error);
  }
};

// Upload images endpoint
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const cloudinary = (await import('../utils/cloudinary.js')).default;
    const uploadedImages = [];

    for (const file of req.files) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'Nguza_listings',
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
      });
      uploadedImages.push({
        url: result.secure_url || result.url,
        public_id: result.public_id,
      });
    }

    const imageUrls = uploadedImages.map(i => i.url);
    const publicIds = uploadedImages.map(i => i.public_id);

    return res.status(200).json({ success: true, images: uploadedImages, imageUrls, publicIds });
  } catch (error) {
    console.error('Upload images error:', error);
    next(error);
  }
};

// Delete listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    // Delete images from Cloudinary
    if (listing.imagePublicIds && listing.imagePublicIds.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      await Promise.all(
        listing.imagePublicIds.map(pid => cloudinary.uploader.destroy(pid).catch(() => { }))
      );
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    next(error);
  }
};

// Update listing
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    const payload = req.body || {};

    // Prepare update object
    const updateData = {
      name: payload.name || listing.name,
      description: payload.description || listing.description,
      location: payload.location || listing.location,
      regularPrice: payload.regularPrice !== undefined ? payload.regularPrice : listing.regularPrice,
      discountedPrice: payload.discountedPrice !== undefined ? payload.discountedPrice : listing.discountedPrice,
      offer: payload.offer !== undefined ? payload.offer : listing.offer,
      negotiable: payload.negotiable !== undefined ? payload.negotiable : listing.negotiable,
      isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : listing.isFeatured,
      boosted: payload.boosted !== undefined ? payload.boosted : listing.boosted,
      details: payload.details || listing.details,
      status: payload.status || listing.status
    };

    // Update SEO if category/location changes
    if (payload.category || payload.location) {
      const category = payload.category || listing.category;
      const subCategory = payload.subCategory || listing.subCategory;
      const details = payload.details || listing.details;
      const location = payload.location || listing.location;
      const seoData = generateSeo(category, subCategory, details, location);
      updateData.seo = seoData;
      updateData.slug = seoData?.slug;
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Update listing error:', error);
    next(error);
  }
};

// Get single listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Ensure seller info is present
    if ((!listing.sellerEmail || !listing.contactPhone) && listing.userRef) {
      try {
        const user = await User.findById(listing.userRef).lean();
        if (user) {
          listing.sellerEmail = listing.sellerEmail || user.email;
          listing.contactPhone = listing.contactPhone || user.phoneNumber;

          // Persist for future reads
          await Listing.findByIdAndUpdate(listing._id, {
            sellerEmail: user.email,
            contactPhone: user.phoneNumber
          }).catch(() => { });
        }
      } catch (err) {
        console.error('Failed to populate seller info for listing', listing._id, err.message);
      }
    }

    return res.status(200).json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    next(error);
  }
};

// Get listings with filters and pagination (Agriculture-optimized)
export const getListings = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      district,
      subcounty,
      parish,
      cropType,
      animalType,
      minPrice,
      maxPrice,
      minQuantity,
      unit,
      organic,
      search,
      limit = 12,
      sort = '-createdAt',
      skip = 0,
      status = 'active'
    } = req.query;

    const filter = { status };

    // Category filters
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    // Location filters
    if (district) filter['location.district'] = district;
    if (subcounty) filter['location.subcounty'] = subcounty;
    if (parish) filter['location.parish'] = parish;

    // Agriculture-specific filters
    if (cropType) filter['details.cropType'] = cropType;
    if (animalType) filter['details.animalType'] = animalType;
    if (unit) filter['details.unit'] = unit;
    if (organic === 'true') filter['details.organic'] = true;

    // Price filters
    if (minPrice || maxPrice) {
      filter.regularPrice = {};
      if (minPrice) filter.regularPrice.$gte = Number(minPrice);
      if (maxPrice) filter.regularPrice.$lte = Number(maxPrice);
    }

    // Quantity filter
    if (minQuantity) {
      filter['details.quantity'] = { $gte: Number(minQuantity) };
    }

    // Brand/Variety Filter (Multi-field regex)
    const { brand, rating } = req.query;
    if (brand) {
      const brandRegex = { $regex: brand, $options: 'i' };
      // If we already have $or from somewhere else (unlikely with just text search), we use $and
      const brandFilter = {
        $or: [
          { 'details.brand': brandRegex },
          { 'details.variety': brandRegex },
          { 'details.breed': brandRegex },
          { 'details.productName': brandRegex }
        ]
      };
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, brandFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, brandFilter);
      }
    }

    // Rating Filter (Note: Listing model needs rating field, currently ignoring or checking virtual if exists)
    // For now assuming we might add rating later, but let's leave it as placeholder
    if (rating) {
      // filter.rating = { $gte: Number(rating) }; 
    }

    // Text search
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const sortOption = {};
    if (search && sort === 'relevance') {
      sortOption.score = { $meta: "textScore" };
    } else if (sort) {
      // handle existing sort
      const parts = sort.split(' ');
      // simple case
      sortOption[sort.replace('-', '')] = sort.startsWith('-') ? -1 : 1;
    }

    // Projection for score
    const projection = search ? { score: { $meta: "textScore" } } : {};

    const listings = await Listing.find(filter, projection)
      .sort(search && sort === 'relevance' ? { score: { $meta: "textScore" } } : sort)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await Listing.countDocuments(filter);

    // Batch populate seller info
    const listingsToFill = listings.filter(l => (!l.sellerEmail || !l.contactPhone) && l.userRef).map(l => String(l.userRef));
    if (listingsToFill.length > 0) {
      try {
        const uniqueUserIds = [...new Set(listingsToFill)];
        const users = await User.find({ _id: { $in: uniqueUserIds } }).lean();
        const userById = users.reduce((acc, u) => { acc[String(u._id)] = u; return acc; }, {});

        const updates = [];
        listings.forEach((listing) => {
          if ((!listing.sellerEmail || !listing.contactPhone) && listing.userRef) {
            const u = userById[String(listing.userRef)];
            if (u) {
              listing.sellerEmail = listing.sellerEmail || u.email;
              listing.contactPhone = listing.contactPhone || u.phoneNumber;
              updates.push(Listing.findByIdAndUpdate(listing._id, {
                sellerEmail: u.email,
                contactPhone: u.phoneNumber
              }).catch(() => { }));
            }
          }
        });

        if (updates.length > 0) await Promise.all(updates);
      } catch (err) {
        console.error('Failed to batch-populate seller info:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      listings,
      total,
      limit: Number(limit),
      skip: Number(skip),
      hasMore: Number(skip) + listings.length < total
    });
  } catch (error) {
    console.error('Get listings error:', error);
    next(error);
  }
};

// Get featured listings
export const getFeaturedListings = async (req, res, next) => {
  try {
    const { district, limit = 10 } = req.query;

    const filter = {
      isFeatured: true,
      featuredUntil: { $gte: new Date() },
      status: 'active'
    };

    if (district) {
      filter.$or = [
        { 'location.district': district },
        { featuredDistricts: district }
      ];
    }

    const listings = await Listing.find(filter)
      .sort({ boosted: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error('Get featured listings error:', error);
    next(error);
  }
};

// Get listings by district
export const getListingsByDistrict = async (req, res, next) => {
  try {
    const { district } = req.params;
    const { limit = 20, skip = 0, category } = req.query;

    const filter = {
      'location.district': district,
      status: 'active'
    };

    if (category) filter.category = category;

    const listings = await Listing.find(filter)
      .sort({ isFeatured: -1, boosted: -1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await Listing.countDocuments(filter);

    return res.status(200).json({
      success: true,
      listings,
      total,
      district
    });
  } catch (error) {
    console.error('Get listings by district error:', error);
    next(error);
  }
};

// Track contact click
export const trackContactClick = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await listing.incrementContactClicks();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track contact click error:', error);
    next(error);
  }
};

// Promote listing (with seasonal boost)
export const promoteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (req.headers['x-promote-secret']) {
      const secret = req.headers['x-promote-secret'];
      if (secret !== process.env.PROMOTE_WEBHOOK_SECRET) {
        return res.status(401).json({ message: 'Invalid webhook secret' });
      }
    } else if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    } else {
      if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
        return res.status(403).json({ message: 'You can only promote your own listings' });
      }
    }

    const days = req.body?.days || 7;
    const districts = req.body?.districts || [listing.location.district];
    const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        isFeatured: true,
        featuredUntil,
        featuredDistricts: districts
      },
      { new: true }
    );

    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Promote listing error:', error);
    next(error);
  }
};

// Boost listing
export const boostListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (req.headers['x-promote-secret']) {
      const secret = req.headers['x-promote-secret'];
      if (secret !== process.env.PROMOTE_WEBHOOK_SECRET) {
        return res.status(401).json({ message: 'Invalid webhook secret' });
      }
    } else if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    } else {
      if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
        return res.status(403).json({ message: 'You can only boost your own listings' });
      }
    }

    const hours = req.body?.hours || 24;
    const boostedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { boosted: true, boostedUntil },
      { new: true }
    );

    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Boost listing error:', error);
    next(error);
  }
};

// Get search suggestions
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const regex = new RegExp(query, 'i');

    const listings = await Listing.find({
      $or: [
        { name: { $regex: regex } },
        { 'details.brand': { $regex: regex } },
        { category: { $regex: regex } },
        { 'details.cropType': { $regex: regex } }
      ],
      status: 'active'
    })
      .select('name imageUrls category details.cropType details.brand _id')
      .limit(6)
      .lean();

    // Transform for frontend
    const suggestions = listings.map(l => ({
      _id: l._id,
      name: l.name,
      imageUrls: l.imageUrls,
      category: l.category,
      brand: l.details?.brand || l.details?.cropType
    }));

    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    next(error);
  }
};
