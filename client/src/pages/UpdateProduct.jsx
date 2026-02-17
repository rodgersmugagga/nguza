import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlus, FaCloudUploadAlt, FaChevronLeft } from 'react-icons/fa'
import FieldsContainer from '../components/FieldsContainer';
import CategorySelector from '../components/CategorySelector';
import { getFieldsForSubcategory } from '../utils/subcategoryFields';
import LocationSelector from '../components/LocationSelector';
import SafeHelmet from '../components/SafeHelmet';

export default function UpdateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: { district: '', subcounty: '', parish: '', village: '' },
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    imageUrls: [],
    imagePublicIds: [],
    category: 'Crops',
    subCategory: 'Grains & Cereals',
    details: {},
  });

  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.productId;
      try {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiBase}/api/products/${productId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch product');

        setFormData({
          ...data,
          category: data.category || 'Crops',
          subCategory: data.subCategory || 'Grains & Cereals',
          details: data.details || {},
          imageUrls: data.imageUrls || [],
          imagePublicIds: data.imagePublicIds || [],
          location: data.location || { district: '', subcounty: '', parish: '', village: '' }
        });
      } catch (err) {
        console.error("Product Fetch error:", err.message);
        setError("Could not load product data.");
      }
    };
    fetchProduct();
  }, [params.productId]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === 'offer') return setFormData(prev => ({ ...prev, offer: checked }));
    if (id === 'regularPrice' || id === 'discountedPrice') {
      return setFormData(prev => ({ ...prev, [id]: Number(value) || 0 }));
    }
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = ({ category, subCategory }) => {
    setFormData(prev => ({ ...prev, category, subCategory, details: {} }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [fieldName]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location?.district) return setError('Location is required');

    try {
      setLoading(true);
      setError(false);
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/products/${params.productId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser?.user?._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.message || 'Update failed');
      navigate(`/product/${params.productId}`);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUploadImages = async () => {
    if (!selectedFiles.length) return;
    try {
      setUploading(true);
      const fd = new FormData();
      selectedFiles.forEach(f => fd.append('images', f));

      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...(data.imageUrls || [])],
        imagePublicIds: [...prev.imagePublicIds, ...(data.publicIds || [])]
      }));
      setUploading(false);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <main className='max-w-4xl mx-auto p-6 min-h-screen bg-gray-50'>
      <SafeHelmet><title>Update Product | Nguza</title></SafeHelmet>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-emerald-700 font-bold mb-8 transition-colors">
        <FaChevronLeft size={12} /> Back
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-12 ring-1 ring-gray-100">
        <h1 className='text-3xl font-black text-gray-900 mb-2'>Edit Product</h1>
        <p className="text-gray-500 font-medium mb-12 italic">Update your item's information to reach more buyers.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <input type="text" placeholder="Product Name (e.g. Organic Matooke)" className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-600 focus:bg-white transition-all" id="name" required onChange={handleChange} value={formData.name} />
            <textarea placeholder="Tell buyers more about your product..." className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-600 focus:bg-white transition-all h-32" id="description" required onChange={handleChange} value={formData.description} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
            <CategorySelector selectedCategory={formData.category} selectedSubCategory={formData.subCategory} onChange={handleCategoryChange} />
            <LocationSelector location={formData.location} onChange={(loc) => setFormData(p => ({ ...p, location: loc }))} />
          </div>

          <div className="pt-8 border-t border-gray-50">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Price (UGX)</label>
                <input type="number" className="w-full bg-transparent text-xl font-black text-gray-900 outline-none" id="regularPrice" required onChange={handleChange} value={formData.regularPrice} />
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">On Offer?</label>
                  <p className="text-[10px] text-gray-400">Discounted price</p>
                </div>
                <input type="checkbox" className="w-6 h-6 rounded-lg border-gray-300 text-emerald-600 focus:ring-emerald-500" id="offer" checked={formData.offer} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <h3 className="text-lg font-black text-gray-900 mb-6">Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md shadow-black/5">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData(p => ({ ...p, imageUrls: p.imageUrls.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><FaTimes size={10} /></button>
                </div>
              ))}
              {formData.imageUrls.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all text-gray-400 hover:text-emerald-600">
                  <FaCloudUploadAlt size={24} />
                  <span className="text-[10px] font-black uppercase mt-2">Add Photo</span>
                  <input type="file" multiple hidden accept="image/*" onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setSelectedFiles(files);
                    setTimeout(handleUploadImages, 100);
                  }} />
                </label>
              )}
            </div>
          </div>

          {formData.category && formData.subCategory && (
            <div className='pt-8 border-t border-gray-50'>
              <h3 className='text-lg font-black text-gray-900 mb-6'>Additional Specifications</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <FieldsContainer
                  fields={getFieldsForSubcategory(formData.category, formData.subCategory)}
                  data={formData.details}
                  onChange={handleFieldChange}
                  category={formData.category}
                  subCategory={formData.subCategory}
                />
              </div>
            </div>
          )}

          <div className="pt-12">
            <button type="submit" disabled={loading || uploading} className='w-full bg-emerald-700 text-white p-5 rounded-2xl font-black shadow-xl shadow-emerald-700/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-base'>
              {loading ? "Syncing Changes..." : "Update Product Listing"}
            </button>
            {error && <p className="text-center text-red-600 mt-6 font-bold">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
