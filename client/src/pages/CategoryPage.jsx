import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaAdjust, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { fetchListings } from '../redux/listings/listingsSlice.js';
import { setCategory, setSubCategory, setFilter, clearFilters } from '../redux/filters/filtersSlice.js';
import ListingItem from '../components/ListingItem.jsx';

// Uganda districts with subcounties - Mobile First Data
const DISTRICTS_DATA = [
  { name: 'Kampala', subcounties: ['Central', 'Makindye', 'Nakawa', 'Rubaga', 'Kawempe', 'Kira'] },
  { name: 'Wakiso', subcounties: ['Bukerere', 'Busujju', 'Entebbe', 'Kabula', 'Kakiri', 'Katikamu'] },
  { name: 'Jinja', subcounties: ['Budadiri', 'Bugembe', 'Jinja City', 'Njeru', 'Portbell'] },
  { name: 'Mukono', subcounties: ['Banda', 'Buikwe', 'Gaddafi', 'Kiganda', 'Kyetume', 'Mukono Municipality'] },
  { name: 'Masaka', subcounties: ['Bukoto', 'Gomba', 'Kamengo', 'Kitaya', 'Masaka City'] },
  { name: 'Fort Portal', subcounties: ['Bwamba', 'Burahya', 'Kabwoya', 'Rwenzori'] },
  { name: 'Mbarara', subcounties: ['Buhweju', 'Kashari', 'Kabwohe', 'Mbarara City'] },
  { name: 'Gulu', subcounties: ['Bardege-Layibi', 'Gulu City', 'Lamwo'] },
  { name: 'Arua', subcounties: ['Arua City', 'Maracha', 'Terego', 'Yumbe'] },
  { name: 'Soroti', subcounties: ['Amodat', 'Katakwi', 'Soroti City'] }
];

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
  const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://harvemart.onrender.com');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  // Location State
  const [districts, setDistricts] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubcounty, setSelectedSubcounty] = useState('');
  const [selectedParish, setSelectedParish] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || '';

  const category = CATEGORIES.find(c => c.key === categoryKey);
  const filters = useSelector(s => s.filters);
  const { items: listings, status } = useSelector(s => s.listings || { items: [], status: 'idle' });
  const loading = status === 'loading';

  // Initialize category
  useEffect(() => {
    if (category) {
      dispatch(setCategory(category.key));
    }
  }, [category, dispatch]);

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
      if (!selectedDistrict) return setSubcounties([]);
      try {
        const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(selectedDistrict)}/subcounties`);
        const data = await res.json();
        if (data?.success) setSubcounties(data.subcounties || []);
      } catch (error) {
        console.warn('Failed to fetch subcounties', error);
      }
    };
    fetchSubcounties();
  }, [selectedDistrict, apiBase]);

  // Fetch parishes
  useEffect(() => {
    const fetchParishes = async () => {
      if (!selectedDistrict || !selectedSubcounty) return setParishes([]);
      try {
        const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(selectedDistrict)}/subcounties/${encodeURIComponent(selectedSubcounty)}/parishes`);
        const data = await res.json();
        if (data?.success) setParishes(data.parishes || []);
      } catch (error) {
        console.warn('Failed to fetch parishes', error);
      }
    };
    fetchParishes();
  }, [selectedDistrict, selectedSubcounty, apiBase]);

  // Fetch listings
  useEffect(() => {
    const params = {
      category: category?.key,
      subCategory: filters.subCategory !== 'all' ? filters.subCategory : undefined,
      sort: filters.sort,
      limit: 20,
      startIndex: 0,
      filters: {
        ...filters.filters,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 100000000 ? priceRange.max : undefined,
        district: selectedDistrict || undefined,
        subcounty: selectedSubcounty || undefined,
        parish: selectedParish || undefined,
      },
    };
    dispatch(fetchListings(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.key, filters.subCategory, filters.sort, priceRange.min, priceRange.max, selectedDistrict, selectedSubcounty, selectedParish]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-ui-primary mb-4">Category Not Found</h1>
          <button onClick={() => navigate('/')} className="btn-primary px-6 py-2 rounded-lg text-sm">Back to Home</button>
        </div>
      </div>
    );
  }

  const activeFilterCount = [
    filters.subCategory !== 'all' ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 100000000 ? 1 : 0,
    selectedDistrict ? 1 : 0,
    selectedSubcounty ? 1 : 0,
    selectedParish ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{category.title} | Nguza - Uganda Agriculture Marketplace</title>
        <meta name="description" content={`Browse ${category.title} on Nguza. Buy and sell agricultural products across Uganda.`} />
        <link rel="canonical" href={SITE_URL + (typeof window !== 'undefined' ? window.location.pathname : `/category/${encodeURIComponent(category?.key || '')}`)} />
        <meta property="og:title" content={`${category.title} | Nguza`} />
        <meta property="og:site_name" content="Nguza - Uganda Agriculture Marketplace" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category.title} | Nguza`,
            "description": `Browse ${category.title} on Nguza. Buy and sell agricultural products across Uganda.`,
            "url": SITE_URL + (typeof window !== 'undefined' ? window.location.pathname : `/category/${encodeURIComponent(category?.key || '')}`),
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": listings.map((l, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": SITE_URL + `/listing/${l._id}`
              }))
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": category.title,
                "item": SITE_URL + (typeof window !== 'undefined' ? window.location.pathname : `/category/${encodeURIComponent(category?.key || '')}`)
              }
            ]
          })}
        </script>
      </Helmet>

      {/* MOBILE-FIRST HEADER */}
      <div className="bg-white border-b border-ui sticky top-0 z-30">
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-ui">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer active:scale-95 flex-shrink-0">
            <FaChevronLeft size={18} className="text-ui-primary" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-ui-primary truncate">{category.title}</h1>
            <p className="text-xs sm:text-sm text-ui-muted">{listings.length} listings</p>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                dispatch(clearFilters());
                setPriceRange({ min: 0, max: 100000000 });
                setSelectedDistrict('');
                setSelectedSubcounty('');
                setSelectedParish('');
              }}
              className="md:hidden px-2 py-1 text-xs font-bold text-color-accent bg-white border border-color-accent rounded-full active:scale-95"
            >
              Clear
            </button>
          )}
        </div>

        {/* Subcategory Chips */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto scrollbar-hide border-b border-ui">
          <div className="flex gap-2 min-w-min">
            <button
              onClick={() => dispatch(setSubCategory('all'))}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-all active:scale-95 text-xs sm:text-sm flex-shrink-0 ${filters.subCategory === 'all'
                ? 'bg-color-primary text-white shadow-md'
                : 'bg-white border-2 border-ui text-ui-primary hover:border-color-primary'
                }`}
            >
              All
            </button>
            {category.subs.map(sub => (
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
            ))}
          </div>
        </div>

        {/* Desktop Quick Filters */}
        <div className="hidden md:flex px-4 py-3 items-center gap-3 border-t border-ui overflow-x-auto scrollbar-hide">
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedSubcounty('');
              setSelectedParish('');
            }}
            className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d._id || d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          {selectedDistrict && (
            <select
              value={selectedSubcounty}
              onChange={(e) => {
                setSelectedSubcounty(e.target.value);
                setSelectedParish('');
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

          <select
            value={filters.sort}
            onChange={(e) => dispatch(setFilter({ key: 'sort', value: e.target.value }))}
            className="px-3 py-2 border border-ui rounded-lg text-xs sm:text-sm focus-ring cursor-pointer flex-shrink-0"
          >
            <option value="-createdAt">Latest</option>
            <option value="-regularPrice">Price: High→Low</option>
            <option value="regularPrice">Price: Low→High</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                dispatch(clearFilters());
                setPriceRange({ min: 0, max: 100000000 });
                setSelectedDistrict('');
                setSelectedSubcounty('');
                setSelectedParish('');
              }}
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

        {/* Filter Sidebar - Drawer on Mobile, Sticky on Desktop */}
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

          {/* Drawer Header */}
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
            {/* District */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FaMapMarkerAlt size={14} /> District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedSubcounty('');
                  setSelectedParish('');
                }}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer"
              >
                <option value="">All Districts</option>
                {districts.map(d => (
                  <option key={d._id || d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Subcounty */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FaMapMarkerAlt size={14} /> Subcounty
              </label>
              <select
                value={selectedSubcounty}
                onChange={(e) => {
                  setSelectedSubcounty(e.target.value);
                  setSelectedParish('');
                }}
                disabled={!selectedDistrict}
                className={`w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer ${!selectedDistrict ? 'opacity-50' : ''}`}
              >
                <option value="">All Subcounties</option>
                {subcounties.map(s => (
                  <option key={s._id || s.name || s} value={typeof s === 'string' ? s : s.name}>
                    {typeof s === 'string' ? s : s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Parish */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FaMapMarkerAlt size={14} /> Parish
              </label>
              <select
                value={selectedParish}
                onChange={(e) => setSelectedParish(e.target.value)}
                disabled={!selectedSubcounty}
                className={`w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer ${!selectedSubcounty ? 'opacity-50' : ''}`}
              >
                <option value="">All Parishes</option>
                {parishes.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold mb-3">Price Range</label>
              <div className="space-y-2">
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
            </div>

            {/* Sort (Mobile Drawer Only) */}
            <div className="lg:hidden">
              <label className="text-sm font-semibold mb-2 block">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => dispatch(setFilter({ key: 'sort', value: e.target.value }))}
                className="w-full px-3 py-2 border border-ui rounded-lg text-sm focus-ring cursor-pointer"
              >
                <option value="-createdAt">Latest</option>
                <option value="-regularPrice">Price: High→Low</option>
                <option value="regularPrice">Price: Low→High</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  dispatch(clearFilters());
                  setPriceRange({ min: 0, max: 100000000 });
                  setSelectedDistrict('');
                  setSelectedSubcounty('');
                  setSelectedParish('');
                  setIsFiltersOpen(false);
                }}
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
              <p className="text-xs sm:text-sm text-ui-muted">Try adjusting your filters</p>
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
