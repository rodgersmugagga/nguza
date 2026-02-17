import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaAdjust, FaTimes, FaMapMarkerAlt, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { fetchProducts } from '../redux/products/productsSlice.js';
import { setCategory, setSubCategory, setFilter, clearFilters } from '../redux/filters/filtersSlice.js';
import ProductItem from '../components/ProductItem.jsx';

const CATEGORIES = [
  { key: 'Crops', title: 'Crops & Produce', subs: ['Grains & Cereals', 'Legumes & Pulses', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops'] },
  { key: 'Livestock', title: 'Livestock & Animals', subs: ['Cattle', 'Goats & Sheep', 'Poultry', 'Pigs', 'Fish & Aquaculture', 'Other Livestock'] },
  { key: 'Agricultural Inputs', title: 'Agricultural Inputs', subs: ['Seeds & Seedlings', 'Fertilizers', 'Pesticides & Chemicals', 'Animal Feed', 'Veterinary Products'] },
  { key: 'Equipment & Tools', title: 'Equipment & Tools', subs: ['Tractors & Machinery', 'Hand Tools', 'Irrigation Equipment', 'Processing Equipment', 'Transport Equipment'] },
  { key: 'Agricultural Services', title: 'Agricultural Services', subs: ['Land Preparation', 'Planting Services', 'Harvesting Services', 'Transport & Logistics', 'Veterinary Services', 'Agronomy Services'] }
];

export default function CategoryPage() {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://nguza.com');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const [districts, setDistricts] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubcounty, setSelectedSubcounty] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || '';
  const category = CATEGORIES.find(c => c.key === categoryKey);
  const filters = useSelector(s => s.filters);
  const { items: products, status, total } = useSelector(s => s.products || { items: [], status: 'idle', total: 0 });
  const loading = status === 'loading';

  useEffect(() => {
    if (category) {
      dispatch(setCategory(category.key));
    }
  }, [category, dispatch]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${apiBase}/api/reference/districts`);
        const data = await res.json();
        if (data?.success) setDistricts(data.districts || []);
      } catch (error) { console.warn(error); }
    };
    fetchDistricts();
  }, [apiBase]);

  useEffect(() => {
    const fetchSubcounties = async () => {
      if (!selectedDistrict) return setSubcounties([]);
      try {
        const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(selectedDistrict)}/subcounties`);
        const data = await res.json();
        if (data?.success) setSubcounties(data.subcounties || []);
      } catch (error) { console.warn(error); }
    };
    fetchSubcounties();
  }, [selectedDistrict, apiBase]);

  useEffect(() => {
    const params = {
      category: category?.key,
      subCategory: filters.subCategory !== 'all' ? filters.subCategory : undefined,
      sort: filters.sort,
      limit: 24,
      startIndex: 0,
      filters: {
        ...filters.filters,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 100000000 ? priceRange.max : undefined,
        district: selectedDistrict || undefined,
        subcounty: selectedSubcounty || undefined,
      },
    };
    dispatch(fetchProducts(params));
  }, [category?.key, filters.subCategory, filters.sort, priceRange.min, priceRange.max, selectedDistrict, selectedSubcounty, dispatch]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-premium border border-gray-100">
          <div className="text-6xl mb-4">🚜</div>
          <h1 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">Category Not Found</h1>
          <button onClick={() => navigate('/')} className="btn-primary">Return to Marketplace</button>
        </div>
      </div>
    );
  }

  const activeFilterCount = [
    filters.subCategory !== 'all' ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 100000000 ? 1 : 0,
    selectedDistrict ? 1 : 0,
    selectedSubcounty ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 sm:pb-0">
      <Helmet>
        <title>{category.title} | Nguza Marketplace</title>
        <meta name="description" content={`Browse ${category.title} on Nguza. Buy and sell agricultural products across Uganda.`} />
        <link rel="canonical" href={SITE_URL + `/category/${encodeURIComponent(category?.key)}`} />
      </Helmet>

      {/* ─── Sticky Mobile Header ─── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 sm:z-30">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <FaChevronLeft size={18} className="text-emerald-700" />
            </button>
            <div>
              <h1 className="text-base font-black text-gray-900 leading-none">{category.title}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{total} Verified Products</p>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                dispatch(clearFilters());
                setPriceRange({ min: 0, max: 100000000 });
                setSelectedDistrict('');
                setSelectedSubcounty('');
              }}
              className="px-3 py-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-100 rounded-lg hover:bg-red-50"
            >
              Reset
            </button>
          )}
        </div>

        {/* Subcategory Chips */}
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide border-t border-gray-50">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => dispatch(setSubCategory('all'))}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filters.subCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-lg'
                : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
            >
              All Produce
            </button>
            {category.subs.map(sub => (
              <button
                key={sub}
                onClick={() => dispatch(setSubCategory(sub))}
                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filters.subCategory === sub
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto w-full flex-1">

        {/* Desktop Filter Sidebar */}
        <aside className={`
            hidden lg:block w-72 h-fit sticky top-44
            bg-white rounded-[2rem] shadow-premium p-8 border border-gray-100
          `}>
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" /> Location
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedDistrict}
                  onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedSubcounty(''); }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                >
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
                </select>
                <select
                  value={selectedSubcounty}
                  onChange={(e) => setSelectedSubcounty(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none disabled:opacity-40"
                >
                  <option value="">All Subcounties</option>
                  {subcounties.map(s => <option key={s._id || s.name || s} value={typeof s === 'string' ? s : s.name}>{typeof s === 'string' ? s : s.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaSortAmountDown className="text-emerald-600" /> Sort By
              </h3>
              <select
                value={filters.sort}
                onChange={(e) => dispatch(setFilter({ key: 'sort', value: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              >
                <option value="-createdAt">Newest Harvest</option>
                <option value="-regularPrice">Price: High to Low</option>
                <option value="regularPrice">Price: Low to High</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-premium px-8 text-center">
              <div className="text-6xl mb-6">🌾</div>
              <h3 className="text-xl font-black text-gray-800">No produce found</h3>
              <p className="text-gray-400 mt-2 font-medium max-w-xs">Try adjusting your location or category filters to find available harvests.</p>
              <button
                onClick={() => { dispatch(clearFilters()); setSelectedDistrict(''); }}
                className="btn-primary mt-8"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {products.map(product => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile-Only Filter FAB */}
      <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="bg-emerald-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform ring-4 ring-white"
        >
          <FaAdjust className="text-amber-400" /> Filter & Sort
          {activeFilterCount > 0 && <span className="bg-amber-400 text-emerald-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsFiltersOpen(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 z-[60] animate-in lg:hidden shadow-2xl border-t border-gray-100">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-3">
                <FaFilter className="text-emerald-600" /> Filters
              </h2>
              <button onClick={() => setIsFiltersOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400"><FaTimes /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Location</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-xs font-black appearance-none border border-gray-100"
                  >
                    <option value="">Districts</option>
                    {districts.map(d => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
                  </select>
                  <select
                    value={selectedSubcounty}
                    onChange={(e) => setSelectedSubcounty(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-xs font-black appearance-none border border-gray-100"
                  >
                    <option value="">Subcounty</option>
                    {subcounties.map(s => <option key={s._id || s.name || s} value={typeof s === 'string' ? s : s.name}>{typeof s === 'string' ? s : s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Price Range (UGX)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min || ''}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-xs font-black border border-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max === 100000000 ? '' : priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : 100000000 })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-xs font-black border border-gray-100"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsFiltersOpen(false)}
                className="btn-primary w-full py-5 text-sm uppercase tracking-widest"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
