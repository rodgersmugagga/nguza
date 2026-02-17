import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaAdjust, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';
import { fetchProducts } from '../redux/products/productsSlice.js';
import { setCategory, setSubCategory, setFilter, clearFilters, setSort } from '../redux/filters/filtersSlice.js';

const CATEGORIES = [
  { key: 'Crops', title: 'Crops & Produce', subs: ['Grains & Cereals', 'Legumes & Pulses', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops'] },
  { key: 'Livestock', title: 'Livestock & Animals', subs: ['Cattle', 'Goats & Sheep', 'Poultry', 'Pigs', 'Fish & Aquaculture', 'Other Livestock'] },
  { key: 'Agricultural Inputs', title: 'Agricultural Inputs', subs: ['Seeds & Seedlings', 'Fertilizers', 'Pesticides & Chemicals', 'Animal Feed', 'Veterinary Products'] },
  { key: 'Equipment & Tools', title: 'Equipment & Tools', subs: ['Tractors & Machinery', 'Hand Tools', 'Irrigation Equipment', 'Processing Equipment', 'Transport Equipment'] },
  { key: 'Agricultural Services', title: 'Agricultural Services', subs: ['Land Preparation', 'Planting Services', 'Harvesting Services', 'Transport & Logistics', 'Veterinary Services', 'Agronomy Services'] }
];

export default function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useSelector(s => s.filters);
  const { items: products, status, total } = useSelector(s => s.products || { items: [], status: 'idle', total: 0 });
  const loading = status === 'loading';

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const apiBase = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${apiBase}/api/reference/districts`);
        const data = await res.json();
        if (data?.success) setDistricts(data.districts || []);
      } catch (error) {
        console.warn('Failed to fetch districts', error);
      }
    };
    fetchDistricts();
  }, [apiBase]);

  useEffect(() => {
    const fetchSubcounties = async () => {
      const district = filters.filters?.district;
      if (!district) return setSubcounties([]);
      try {
        const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(district)}/subcounties`);
        const data = await res.json();
        if (data?.success) setSubcounties(data.subcounties || []);
      } catch (error) {
        console.warn('Failed to fetch subcounties', error);
      }
    };
    fetchSubcounties();
  }, [filters.filters?.district, apiBase]);

  useEffect(() => {
    const fetchParishes = async () => {
      const district = filters.filters?.district;
      const subcounty = filters.filters?.subcounty;
      if (!district || !subcounty) return setParishes([]);
      try {
        const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(district)}/subcounties/${encodeURIComponent(subcounty)}/parishes`);
        const data = await res.json();
        if (data?.success) setParishes(data.parishes || []);
      } catch (error) {
        console.warn('Failed to fetch parishes', error);
      }
    };
    fetchParishes();
  }, [filters.filters?.district, filters.filters?.subcounty, apiBase]);

  useEffect(() => {
    const params = {
      keyword: filters.keyword || '',
      category: filters.category !== 'all' ? filters.category : undefined,
      subCategory: filters.subCategory !== 'all' ? filters.subCategory : undefined,
      limit: 20,
      startIndex: 0,
      sort: filters.sort,
      filters: {
        ...filters.filters,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 100000000 ? priceRange.max : undefined,
      },
    };
    dispatch(fetchProducts(params));
  }, [filters.keyword, filters.category, filters.subCategory, filters.sort, JSON.stringify(filters.filters), priceRange.min, priceRange.max, dispatch]);

  const activeFilterCount = [
    filters.category !== 'all' ? 1 : 0,
    filters.subCategory !== 'all' ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 100000000 ? 1 : 0,
    filters.filters?.district ? 1 : 0,
    filters.filters?.subcounty ? 1 : 0,
    filters.filters?.parish ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleClearAll = () => {
    dispatch(clearFilters());
    setPriceRange({ min: 0, max: 100000000 });
  };

  const selectedCategoryData = CATEGORIES.find(c => c.key === filters.category);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Search Products | Nguza - Uganda Agriculture Marketplace</title>
        <meta name="description" content="Search agricultural products across Uganda on Nguza." />
      </Helmet>

      {/* STICKY HEADER */}
      <div className="bg-white border-b border-ui sticky top-0 z-30">
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-ui">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer active:scale-95 flex-shrink-0">
            <FaChevronLeft size={18} className="text-ui-primary" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-ui-primary truncate">
              {filters.keyword ? `Search: ${filters.keyword}` : 'All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-ui-muted">{total} products found</p>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={handleClearAll} className="md:hidden px-2 py-1 text-xs font-bold text-teal-600 bg-white border border-teal-600 rounded-full active:scale-95">
              Clear
            </button>
          )}
        </div>

        {/* Chips */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto scrollbar-hide border-b border-ui">
          <div className="flex gap-2 min-w-min">
            <button
              onClick={() => {
                if (filters.category === 'all') {
                  dispatch(setCategory('all'));
                } else if (filters.subCategory === 'all') {
                  dispatch(setCategory('all'));
                } else {
                  dispatch(setSubCategory('all'));
                }
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 ${(filters.category === 'all' || (filters.category !== 'all' && filters.subCategory === 'all'))
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white border border-ui text-ui-primary hover:border-emerald-700'
                }`}
            >
              {filters.category === 'all' ? 'All Categories' : 'All Subcategories'}
            </button>
            {filters.category === 'all' ? (
              CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => dispatch(setCategory(cat.key))}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 bg-white border border-ui text-ui-primary hover:border-emerald-700 hover:text-emerald-700"
                >
                  {cat.title}
                </button>
              ))
            ) : (
              selectedCategoryData?.subs.map(sub => (
                <button
                  key={sub}
                  onClick={() => dispatch(setSubCategory(sub))}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 ${filters.subCategory === sub
                    ? 'bg-emerald-700 text-white shadow-md shadow-green-200'
                    : 'bg-white border border-ui text-ui-primary hover:border-emerald-700 hover:text-emerald-700'
                    }`}
                >
                  {sub}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Desktop Quick Filters */}
        <div className="hidden md:flex px-4 py-3 items-center gap-3 border-t border-ui overflow-x-auto scrollbar-hide">
          <select
            value={filters.filters?.district || ''}
            onChange={(e) => {
              dispatch(setFilter({ key: 'district', value: e.target.value }));
              dispatch(setFilter({ key: 'subcounty', value: '' }));
              dispatch(setFilter({ key: 'parish', value: '' }));
            }}
            className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
            className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
          >
            <option value="-createdAt">Newest First</option>
            <option value="relevance">Relevance</option>
            <option value="-regularPrice">Price: High to Low</option>
            <option value="regularPrice">Price: Low to High</option>
            <option value="-rating">Top Rated</option>
          </select>

          {activeFilterCount > 0 && (
            <button onClick={handleClearAll} className="ml-auto text-xs sm:text-sm text-emerald-700 font-semibold hover:underline flex-shrink-0">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 flex-1">
        {/* Filter Sidebar */}
        <aside className={`
            flex flex-col gap-3
            fixed lg:sticky top-0 lg:top-44 left-0 h-full lg:h-fit z-50 lg:z-auto
            w-3/4 max-w-xs lg:w-80 bg-white shadow-2xl lg:shadow-sm p-4
            overflow-y-auto lg:overflow-visible transition-transform duration-300
            ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:block rounded-r-2xl lg:rounded-2xl
          `}>
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            <button onClick={() => setIsFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FaTimes size={20} /></button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-600 uppercase tracking-wider text-[10px]">Category</label>
              <select
                value={filters.category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-ui rounded-lg text-sm focus-ring"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.title}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-600 uppercase tracking-wider text-[10px]">Price (UGX)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={priceRange.min || ''} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-ui rounded-lg text-sm" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={priceRange.max === 100000000 ? '' : priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : 100000000 })} className="w-full px-3 py-2 bg-gray-50 border border-ui rounded-lg text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-600 uppercase tracking-wider text-[10px]">Location</label>
              <select
                value={filters.filters?.district || ''}
                onChange={(e) => dispatch(setFilter({ key: 'district', value: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-ui rounded-lg text-sm focus-ring"
              >
                <option value="">All Districts</option>
                {districts.map(d => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={handleClearAll} className="w-full py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold text-xs transition-colors">
                RESET FILTERS
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent shadow-lg shadow-emerald-600/20"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-ui shadow-sm px-6">
              <div className="text-6xl mb-4">🪴</div>
              <h3 className="text-xl font-black text-gray-800">No products match your search</h3>
              <p className="text-gray-500 mt-2 max-w-xs">Try different keywords or clear your filters to find what you're looking for.</p>
              <button onClick={handleClearAll} className="mt-8 bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-700/20 active:scale-95 transition-transform">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map(product => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="bg-emerald-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm active:scale-95 transition-transform ring-4 ring-white"
        >
          <FaAdjust className="text-amber-400" /> Filter & Sort
          {activeFilterCount > 0 && (
            <span className="bg-amber-400 text-emerald-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
