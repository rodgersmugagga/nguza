import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CategorySelector from '../components/CategorySelector';
import LocationSelector from '../components/LocationSelector';
import FieldsContainer from '../components/FieldsContainer';
import { getFieldsForSubcategory } from '../utils/subcategoryFields';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      district: "",
      subcounty: "",
      parish: "",
      village: ""
    },
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    negotiable: false,
    category: '',
    subCategory: '',
    imageUrls: [],
    imagePublicIds: [],
    details: {},
  });

  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle category change
  const handleCategoryChange = ({ category, subCategory }) => {
    setFormData(prev => ({
      ...prev,
      category,
      subCategory,
      details: {} // Reset details when category changes
    }));
  };

  // Handle location change
  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  // Handle details change
  const handleDetailsChange = (details) => {
    setFormData(prev => ({ ...prev, details }));
  };

  // Handle basic field changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: type === 'number' ? Number(value) : value }));
    }
  };

  // File selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setSelectedFiles(prev => [...prev, ...mapped].slice(0, 10));
  };

  // Remove local file
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => {
      const item = prev[index];
      if (item && item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Upload files to backend
  const handleUpload = async () => {
    if (!selectedFiles.length) return setError('No files selected');
    try {
      setUploading(true);
      setError(false);

      const fd = new FormData();
      selectedFiles.forEach(item => fd.append('images', item.file));

      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/products/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser?.token || ''}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || 'Upload failed');
        setUploading(false);
        return;
      }

      const imageUrlsFromResp = data.imageUrls || (Array.isArray(data.images) ? data.images.map(i => i.url) : []);
      const publicIdsFromResp = data.publicIds || (Array.isArray(data.images) ? data.images.map(i => i.public_id || i.publicId) : []);

      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...imageUrlsFromResp],
        imagePublicIds: [...(prev.imagePublicIds || []), ...publicIdsFromResp],
      }));

      selectedFiles.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  // Cleanup previews on unmount
  useEffect(() => () => {
    selectedFiles.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
  }, [selectedFiles]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category || !formData.subCategory) {
      return setError("Please select category and subcategory");
    }
    if (!formData.location.district || !formData.location.subcounty) {
      return setError("Please select district and subcounty");
    }
    if (!formData.imageUrls || formData.imageUrls.length < 1) {
      return setError("You must upload at least 1 image!");
    }
    if (formData.offer && +formData.regularPrice < +formData.discountedPrice) {
      return setError("Discounted price must be lower than regular price!");
    }

    setError(false);
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const payload = {
        ...formData,
        regularPrice: Number(formData.regularPrice),
        discountedPrice: Number(formData.discountedPrice),
        userRef: currentUser?.user?._id,
      };

      const res = await fetch(`${apiBase}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token || ''}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || data.errors?.join(', '));
        return;
      }

      const newId = data.product?._id || data._id;
      if (newId) navigate(`/product/${newId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className='max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6'>
      <Helmet>
        <title>Post Agriculture Product | Nguza - Uganda's Agriculture Marketplace</title>
        <meta name="description" content="Post your agriculture product in Uganda. Sell crops, livestock, inputs, equipment, or offer agricultural services." />
        <meta name="keywords" content="post agriculture product Uganda, sell crops, sell livestock, agricultural services Uganda" />
      </Helmet>

      <h1 className='text-2xl sm:text-3xl font-bold text-ui-primary mb-6'>
        Post Your Agriculture Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category Selection */}
        <div className="bg-surface p-4 sm:p-6 rounded-lg border border-ui shadow-sm">
          <CategorySelector
            selectedCategory={formData.category}
            selectedSubCategory={formData.subCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Step 2: Location */}
        {formData.category && formData.subCategory && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <LocationSelector
              location={formData.location}
              onChange={handleLocationChange}
            />
          </div>
        )}

        {/* Step 3: Basic Info */}
        {formData.location.district && formData.location.subcounty && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-ui-primary mb-4">
              📝 Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ui-muted mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Fresh Maize for Sale, Dairy Cattle Available"
                  maxLength={100}
                  minLength={10}
                  required
                  className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px]"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-ui-muted mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  maxLength={1000}
                  minLength={20}
                  required
                  rows="4"
                  className="w-full p-3 border border-ui rounded-lg focus-ring text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Category-Specific Details */}
        {formData.name && formData.description && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            {formData.category && formData.subCategory && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional {formData.subCategory} Details</h3>
                <FieldsContainer
                  fields={getFieldsForSubcategory(formData.category, formData.subCategory)}
                  data={formData.details}
                  onChange={(fieldName, value) => handleDetailsChange({ ...formData.details, [fieldName]: value })}
                  category={formData.category}
                  subCategory={formData.subCategory}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Pricing */}
        {formData.details && Object.keys(formData.details).length > 0 && (
          <div className="bg-surface p-4 sm:p-6 rounded-lg border border-ui shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              💰 Pricing
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="regularPrice" className="block text-sm font-medium text-ui-muted mb-2">
                  Price (UGX) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  required
                  className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px]"
                />
              </div>

              <div className="flex items-center gap-3 min-h-[48px]">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="w-5 h-5 text-ui-primary border-ui rounded focus-ring"
                />
                <label htmlFor="negotiable" className="text-sm font-medium text-gray-700">
                  Price is negotiable
                </label>
              </div>

              <div className="flex items-center gap-3 min-h-[48px]">
                <input
                  type="checkbox"
                  id="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                  className="w-5 h-5 text-ui-primary border-ui rounded focus-ring"
                />
                <label htmlFor="offer" className="text-sm font-medium text-gray-700">
                  Offer discounted price
                </label>
              </div>

              {formData.offer && (
                <div>
                  <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price (UGX) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    placeholder="45000"
                    min="0"
                    required
                    className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Images */}
        {formData.regularPrice > 0 && (
          <div className="bg-surface p-4 sm:p-6 rounded-lg border border-ui shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📷 Images (Max 10)
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1 p-3 border border-ui rounded-lg text-base"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className="btn-primary px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {/* Preview selected files */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedFiles.map((item, idx) => (
                    <div key={item.preview} className="relative">
                      <img
                        src={item.preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview uploaded images */}
              {formData.imageUrls?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.imageUrls.map((url, idx) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt={`Uploaded ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 btn-primary text-xs px-2 py-1 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {formData.imageUrls?.length > 0 && (
          <div className="sticky bottom-0 bg-surface p-4 border-t border-ui shadow-lg -mx-3 sm:-mx-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
            >
              {loading ? 'Creating Product...' : 'Post Product'}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </main>
  );
}
