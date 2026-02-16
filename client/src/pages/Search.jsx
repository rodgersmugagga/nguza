import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaAdjust, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';
import { fetchListings } from '../redux/listings/listingsSlice.js';
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
  const { items: listings, status, total } = useSelector(s => s.listings || { items: [], status: 'idle', total: 0 });
  const loading = status === 'loading';

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const apiBase = import.meta.env.VITE_API_URL || '';

  // Fetch districts
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

  // Fetch subcounties
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

  // Fetch parishes
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

  // Whenever redux filters change, trigger fetchListings
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
    dispatch(fetchListings(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.keyword, filters.category, filters.subCategory, filters.sort, JSON.stringify(filters.filters), priceRange.min, priceRange.max]);

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
        <title>Search | Nguza - Uganda Agriculture Marketplace</title>
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
              {filters.keyword ? `Search: ${filters.keyword}` : 'Search Listings'}
            </h1>
            <p className="text-xs sm:text-sm text-ui-muted">{total} listings found</p>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="md:hidden px-2 py-1 text-xs font-bold text-color-accent bg-white border border-color-accent rounded-full active:scale-95"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category & Subcategory Chips */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto scrollbar-hide border-b border-ui">
          <div className="flex gap-2 min-w-min">
            <button
              onClick={() => {
                if (filters.category === 'all') {
                  dispatch(setCategory('all'));
                } else {
                  // If already in "All Subcategories" and clicked again, go back to All Categories
                  if (filters.subCategory === 'all') {
                    dispatch(setCategory('all'));
                  } else {
                    dispatch(setSubCategory('all'));
                  }
                }
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 ${(filters.category === 'all' || (filters.category !== 'all' && filters.subCategory === 'all'))
                ? 'bg-color-primary text-white shadow-md'
                : 'bg-white border border-ui text-ui-primary hover:border-color-primary'
                }`}
            >
              {filters.category === 'all' ? 'All Categories' : 'All Subcategories'}
            </button>
            {filters.category === 'all' ? (
              CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => dispatch(setCategory(cat.key))}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 bg-white border border-ui text-ui-primary hover:border-color-primary hover:text-color-primary"
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
                    ? 'bg-color-primary text-white shadow-md shadow-green-200'
                    : 'bg-white border border-ui text-ui-primary hover:border-color-primary hover:text-color-primary'
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
            {districts.map(d => (
              <option key={d._id || d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          {filters.filters?.district && (
            <select
              value={filters.filters?.subcounty || ''}
              onChange={(e) => {
                dispatch(setFilter({ key: 'subcounty', value: e.target.value }));
                dispatch(setFilter({ key: 'parish', value: '' }));
              }}
              className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
            >
              <option value="">All Subcounties</option>
              {subcounties.map(s => (
                <option key={s._id || s.name || s} value={typeof s === 'string' ? s : s.name}>
                  {typeof s === 'string' ? s : s.name}
                </option>
              ))}
            </select>
          )}

          {filters.filters?.subcounty && (
            <select
              value={filters.filters?.parish || ''}
              onChange={(e) => dispatch(setFilter({ key: 'parish', value: e.target.value }))}
              className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
            >
              <option value="">All Parishes</option>
              {parishes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}

          <select
            value={filters.sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
            className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
          >
            <option value="-createdAt">Latest</option>
            <option value="relevance">Relevance</option>
            <option value="-regularPrice">Price: High→Low</option>
            <option value="regularPrice">Price: Low→High</option>
            <option value="-rating">Top Rated</option>
            <option value="-views">Most Popular</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="ml-auto text-xs sm:text-sm text-color-primary font-semibold hover:underline flex-shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 flex-1">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsFiltersOpen(true)}
          className='lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white text-ui-primary font-semibold rounded-lg shadow-sm active:scale-95 transition-transform'
        >
          <span className='flex items-center gap-2'>
            <FaAdjust /> Filters & Sort
          </span>
        </button>

        {/* Mobile Filter Drawer Overlay */}
        {isFiltersOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsFiltersOpen(false)}
          />
        )}

        {/* Filter Sidebar */}
        <aside className={`
            flex flex-col gap-3
            fixed lg:sticky top-0 lg:top-44 left-0 h-full lg:h-fit z-50 lg:z-auto
            w-3/4 max-w-xs lg:w-80
            bg-white lg:bg-white
            shadow-2xl lg:shadow-sm
            p-4 lg:p-4
            overflow-y-auto lg:overflow-visible
            transition-transform duration-300 ease-in-out
            rounded-none lg:rounded-lg
            ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:block
          `}>

          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            <button
              onClick={() => setIsFiltersOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <h3 className="hidden lg:block font-bold text-base text-ui-primary mb-4">Filters</h3>

          <div className="space-y-5">
            {/* Category (Sidebar) */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.title}</option>
                ))}
              </select>
            </div>

            {filters.category !== 'all' && (
              <div>
                <label className="text-sm font-semibold mb-2 block">Sub Category</label>
                <select
                  value={filters.subCategory}
                  onChange={(e) => dispatch(setSubCategory(e.target.value))}
                  className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer"
                >
                  <option value="all">All Subcategories</option>
                  {selectedCategoryData?.subs.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold mb-3 block">Price Range (UGX)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-ui rounded-lg text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max === 100000000 ? '' : priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : 100000000 })}
                  className="w-full px-3 py-2 border border-ui rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FaMapMarkerAlt size={14} /> District
              </label>
              <select
                value={filters.filters?.district || ''}
                onChange={(e) => {
                  dispatch(setFilter({ key: 'district', value: e.target.value }));
                  dispatch(setFilter({ key: 'subcounty', value: '' }));
                  dispatch(setFilter({ key: 'parish', value: '' }));
                }}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring"
              >
                <option value="">All Districts</option>
                {districts.map(d => (
                  <option key={d._id || d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {filters.filters?.district && (
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <FaMapMarkerAlt size={14} /> Subcounty
                </label>
                <select
                  value={filters.filters?.subcounty || ''}
                  onChange={(e) => {
                    dispatch(setFilter({ key: 'subcounty', value: e.target.value }));
                    dispatch(setFilter({ key: 'parish', value: '' }));
                  }}
                  className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring"
                >
                  <option value="">All Subcounties</option>
                  {subcounties.map(s => (
                    <option key={s._id || s.name || s} value={typeof s === 'string' ? s : s.name}>
                      {typeof s === 'string' ? s : s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filters.filters?.subcounty && (
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <FaMapMarkerAlt size={14} /> Parish
                </label>
                <select
                  value={filters.filters?.parish || ''}
                  onChange={(e) => dispatch(setFilter({ key: 'parish', value: e.target.value }))}
                  className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring"
                >
                  <option value="">All Parishes</option>
                  {parishes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand Filter */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Brand / Variety</label>
              <input
                type="text"
                placeholder="e.g. Toyota, Hybrid Maize"
                value={filters.filters?.brand || ''}
                onChange={(e) => dispatch(setFilter({ key: 'brand', value: e.target.value }))}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Minimum Rating</label>
              <select
                value={filters.filters?.rating || ''}
                onChange={(e) => dispatch(setFilter({ key: 'rating', value: e.target.value }))}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer"
              >
                <option value="">Any Rating</option>
                <option value="4">4 Stars & Up</option>
                <option value="3">3 Stars & Up</option>
                <option value="2">2 Stars & Up</option>
              </select>
            </div>

            {/* Sort (Mobile Only) */}
            <div className="lg:hidden">
              <label className="text-sm font-semibold mb-2 block">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => dispatch(setSort(e.target.value))}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring"
              >
                <option value="-createdAt">Latest</option>
                <option value="relevance">Relevance</option>
                <option value="-regularPrice">Price: High→Low</option>
                <option value="regularPrice">Price: Low→High</option>
                <option value="-rating">Top Rated</option>
                <option value="-views">Most Popular</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full py-2 border border-ui text-ui-primary rounded-lg font-semibold active:scale-95 text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </aside>

        {/* LISTINGS GRID */}
        <section className="flex-1 min-w-0">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-color-primary border-t-transparent"></div>
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-ui-primary mb-2">No listings found</p>
              <p className="text-xs sm:text-sm text-ui-muted">Try adjusting your filters or search terms</p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {listings.map(listing => (
                <article key={listing._id}>
                  <ListingItem listing={listing} />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
