import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaSeedling, FaPaw, FaLeaf, FaTractor, FaHandshake, FaChevronRight, FaChevronLeft, FaFire, FaBolt, FaClock, FaShieldAlt, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { MdVerified, MdLocalShipping } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured, fetchListings } from '../redux/listings/listingsSlice.js';
import ListingItem from '../components/ListingItem.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';

/* ─── Categories ─── */
const CATEGORIES = [
  { key: 'Crops', title: 'Fresh Harvest', icon: FaSeedling, emoji: '🌾', subs: ['Grains & Cereals', 'Vegetables', 'Fruits', 'Root Crops', 'Cash Crops'] },
  { key: 'Livestock', title: 'Livestock', icon: FaPaw, emoji: '🐄', subs: ['Cattle', 'Goats & Sheep', 'Poultry', 'Pigs', 'Fish & Aquaculture'] },
  { key: 'Agricultural Inputs', title: 'Farm Inputs', icon: FaLeaf, emoji: '🌱', subs: ['Seeds', 'Fertilizers', 'Pesticides', 'Animal Feed', 'Veterinary'] },
  { key: 'Equipment & Tools', title: 'Machinery & Tools', icon: FaTractor, emoji: '🚜', subs: ['Tractors', 'Hand Tools', 'Irrigation', 'Processing', 'Transport'] },
  { key: 'Agricultural Services', title: 'Agri Services', icon: FaHandshake, emoji: '🤝', subs: ['Land Prep', 'Planting', 'Harvesting', 'Transport', 'Veterinary'] },
];

/* ─── Countdown Timer Hook ─── */
function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return timeLeft;
}

/* ─── Horizontal Scroll Container ─── */
function ScrollRow({ children, className = '' }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };
  return (
    <div className={`relative group/scroll ${className}`}>
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 text-gray-600 hover:text-emerald-700 opacity-0 group-hover/scroll:opacity-100 transition-opacity -translate-x-1/2">
        <FaChevronLeft />
      </button>
      <div ref={ref} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-1">
        {children}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 text-gray-600 hover:text-emerald-700 opacity-0 group-hover/scroll:opacity-100 transition-opacity translate-x-1/2">
        <FaChevronRight />
      </button>
    </div>
  );
}

/* ─── Hero Carousel Slide ─── */
const HERO_SLIDES = [
  { title: 'Harvest Season Deals', subtitle: 'Up to 40% off fresh crops, grains & produce', bg: 'from-emerald-800 to-emerald-600', emoji: '🌾', cta: 'Shop Crops', link: '/category/Crops' },
  { title: 'Premium Livestock', subtitle: 'Cattle, goats, poultry from verified sellers', bg: 'from-amber-700 to-amber-500', emoji: '🐄', cta: 'Browse Livestock', link: '/category/Livestock' },
  { title: 'Farm Equipment', subtitle: 'Tractors, irrigation & processing machinery', bg: 'from-emerald-700 to-teal-600', emoji: '🚜', cta: 'View Equipment', link: '/category/Equipment%20%26%20Tools' },
  { title: 'Seeds & Inputs', subtitle: 'Quality seeds, fertilizers & agro-chemicals', bg: 'from-green-700 to-lime-600', emoji: '🌱', cta: 'Get Inputs', link: '/category/Agricultural%20Inputs' },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCat, setActiveCat] = useState(null);

  const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://nguza.onrender.com');

  const { featured } = useSelector(s => s.listings || { featured: [] });
  const { items, status } = useSelector(s => s.listings || { items: [], status: 'idle' });

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchListings({ page: 1, limit: 24 }));
  }, [dispatch]);

  // Auto-slide hero every 5s
  useEffect(() => {
    const id = setInterval(() => setActiveSlide(p => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Flash sale end (24h from now, recalc on mount)
  const [flashEnd] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  const countdown = useCountdown(flashEnd);

  // Filter items by active category
  const filteredItems = useMemo(() => {
    if (!activeCat || !Array.isArray(items)) return items;
    return items.filter(item => item.category === activeCat);
  }, [items, activeCat]);

  const handleCategoryClick = (categoryKey) => {
    navigate(`/category/${encodeURIComponent(categoryKey)}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Helmet>
        <title>Nguza | Uganda's Agriculture Marketplace - Buy & Sell Crops, Livestock, Equipment</title>
        <meta name="description" content="Uganda's trusted agriculture marketplace. Buy and sell crops, livestock, agricultural inputs, equipment, and services." />
        <meta name="keywords" content="Uganda agriculture marketplace, buy crops Uganda, sell livestock Uganda, agricultural inputs, farm equipment, maize, beans, cattle, goats, poultry, seeds, fertilizers, tractors" />
        <link rel="canonical" href={SITE_URL + '/'} />
        <meta property="og:title" content="Nguza | Uganda's Agriculture Marketplace" />
        <meta property="og:description" content="Buy and sell crops, livestock, agricultural inputs, equipment, and services across Uganda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL + '/'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "WebSite",
            "name": "Nguza - Uganda Agriculture Marketplace", "url": SITE_URL,
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/search?searchTerm={search_term_string}` },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── HERO SECTION: Left Menu + Main Banner + Right Promo ─── */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-3">

          {/* ─── Left Category Menu (Desktop) ─── */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden self-start">
            <div className="bg-emerald-800 text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
              <FaSeedling className="text-amber-400" /> All Categories
            </div>
            <nav>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryClick(cat.key)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left group border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="text-gray-400 group-hover:text-emerald-600 text-sm" />
                      <span className="text-sm">{cat.title}</span>
                    </div>
                    <FaChevronRight className="text-[10px] text-gray-300 group-hover:text-emerald-600" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ─── Main Banner Carousel (Auto-slide) ─── */}
          <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[200px] sm:min-h-[280px] lg:min-h-[320px]">
            {HERO_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center transition-all duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              >
                <div className="px-6 sm:px-10 py-8 text-white max-w-lg z-10">
                  <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-2">Nguza Marketplace</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-3">{slide.title}</h2>
                  <p className="text-sm sm:text-base text-white/90 mb-5">{slide.subtitle}</p>
                  <Link to={slide.link} className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold px-6 py-2.5 rounded-lg transition-colors shadow-md text-sm">
                    {slide.cta} <FaChevronRight className="text-xs" />
                  </Link>
                </div>
                <div className="absolute right-6 bottom-6 text-8xl sm:text-9xl opacity-30 select-none">{slide.emoji}</div>
              </div>
            ))}
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-8 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'}`}
                />
              ))}
            </div>
            {/* Slide Arrows */}
            <button onClick={() => setActiveSlide(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors">
              <FaChevronLeft />
            </button>
            <button onClick={() => setActiveSlide(p => (p + 1) % HERO_SLIDES.length)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors">
              <FaChevronRight />
            </button>
          </div>

          {/* ─── Right Promo Panel (Desktop) ─── */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-bl-xl shadow-lg animate-bounce mt-2 mr-2">
                Deal of the Day
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold tracking-wider uppercase text-amber-200">Deal of the Day</p>
                <h3 className="text-lg font-black mt-1 leading-tight">Harvest Season Special</h3>
                <p className="text-xs text-amber-100 mt-1">Up to 40% off fresh produce</p>
              </div>
              <Link to="/search" className="bg-white text-amber-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors text-center mt-3">
                Shop Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white flex-1 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MdVerified className="text-blue-300 text-sm" />
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Verified Sellers</span>
                </div>
                <h3 className="text-lg font-black leading-tight">Sell on Nguza</h3>
                <p className="text-xs text-emerald-200 mt-1">Reach thousands of buyers</p>
              </div>
              <Link to="/create-listing" className="bg-amber-400 text-emerald-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-500 transition-colors text-center mt-3">
                Start Selling
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── FLASH SALES with Countdown ─── (Jumia style) */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-3">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                <FaBolt className="text-yellow-300 text-xl animate-pulse" />
                <h2 className="text-lg sm:text-xl font-black text-white">Flash Sales</h2>
              </div>
              {/* Countdown */}
              <div className="flex items-center gap-1 ml-3">
                <FaClock className="text-yellow-300 text-sm" />
                <span className="text-xs text-yellow-200 mr-1">Time Left:</span>
                {[
                  { val: countdown.hours, label: 'h' },
                  { val: countdown.minutes, label: 'm' },
                  { val: countdown.seconds, label: 's' },
                ].map((t, i) => (
                  <span key={i} className="bg-gray-900 text-white px-2 py-1 rounded font-mono text-sm font-bold">
                    {String(t.val).padStart(2, '0')}{t.label}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/search" className="text-white text-sm font-semibold hover:text-yellow-200 transition-colors flex items-center gap-1">
              See All <FaChevronRight className="text-xs" />
            </Link>
          </div>

          {/* Flash Sale Items - Horizontal Scroll */}
          <ScrollRow>
            {status === 'loading' ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-44 sm:w-52"><SkeletonCard /></div>
              ))
            ) : (
              Array.isArray(items) && items.slice(0, 10).map((item, idx) => (
                <div key={item._id || item.id} className="snap-start flex-shrink-0 w-44 sm:w-52">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                    <ListingItem listing={item} />
                    {/* Stock Progress Bar - Jumia style urgency */}
                    <div className="px-3 pb-3">
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-gray-500 font-medium">Stock: {Math.max(2, 35 - idx * 4)} left</span>
                        <span className="text-red-600 font-bold italic">Almost Sold Out!</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-600 to-amber-400 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(10, 85 - idx * 7)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollRow>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── CATEGORY FILTER + PRODUCTS GRID ─── */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-3">
        {/* Mobile Category Scroller */}
        <div className="overflow-x-auto scrollbar-hide mb-4 lg:hidden">
          <div className="flex gap-2 min-w-min pb-1">
            <button
              onClick={() => setActiveCat(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${!activeCat ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300'}`}
            >
              All Products
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(activeCat === cat.key ? null : cat.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${activeCat === cat.key ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300'}`}
              >
                <span>{cat.emoji}</span> {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Tag */}
        {activeCat && (
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
              Showing: {activeCat}
              <button onClick={() => setActiveCat(null)} className="ml-1 text-emerald-600 hover:text-red-500 transition-colors">
                <FaTimes className="text-xs" />
              </button>
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
              <FaFire className="text-amber-500" /> {activeCat || 'All Products'}
            </h2>
            <Link to="/search" className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
              View All <FaChevronRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {status === 'loading' ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              Array.isArray(filteredItems) && filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ListingItem key={item._id || item.id} listing={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-5xl mb-3">🌿</p>
                  <h3 className="text-lg font-bold text-gray-700">No products found</h3>
                  <p className="text-sm text-gray-500 mt-1">Try selecting a different category</p>
                  <button onClick={() => setActiveCat(null)} className="mt-4 px-6 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors">
                    Show All Products
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── FEATURED / TOP SELLER PICKS ─── (Carousel) */}
      {/* ══════════════════════════════════════════════════════ */}
      {Array.isArray(featured) && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="text-amber-400">⭐</span> Top Seller Picks
              </h2>
              <div className="flex items-center gap-1.5">
                <MdVerified className="text-blue-500" />
                <span className="text-xs text-blue-600 font-semibold">Verified Sellers</span>
              </div>
            </div>
            <ScrollRow>
              {featured.map(item => (
                <div key={item._id || item.id} className="snap-start flex-shrink-0 w-52 sm:w-56">
                  <ListingItem listing={item} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── INSPIRED BY YOUR BROWSING ─── (Amazon-style) */}
      {/* ══════════════════════════════════════════════════════ */}
      {Array.isArray(items) && items.length > 6 && (
        <section className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">Inspired by Your Browsing</h2>
            <ScrollRow>
              {items.slice(6).map(item => (
                <div key={item._id || item.id} className="snap-start flex-shrink-0 w-48 sm:w-52">
                  <ListingItem listing={item} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ─── FOOTER ─── Harvest Gold top border */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="bg-emerald-900 mt-6 border-t-8 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-amber-400 mb-3 text-xs uppercase tracking-wider">About Nguza</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-emerald-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-emerald-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-emerald-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3 text-xs uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2">
                {CATEGORIES.slice(0, 4).map(cat => (
                  <li key={cat.key}><Link to={`/category/${encodeURIComponent(cat.key)}`} className="text-emerald-300 hover:text-white transition-colors">{cat.title}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3 text-xs uppercase tracking-wider">For Sellers</h4>
              <ul className="space-y-2">
                <li><Link to="/create-listing" className="text-emerald-300 hover:text-white transition-colors">Post a Listing</Link></li>
                <li><Link to="/seller-dashboard" className="text-emerald-300 hover:text-white transition-colors">Seller Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3 text-xs uppercase tracking-wider">Farm Tracking</h4>
              <div className="flex items-center gap-2 text-emerald-300 text-xs">
                <FaMapMarkerAlt className="text-amber-400" />
                <span>Farm Order Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs mt-2">
                <MdLocalShipping className="text-amber-400" />
                <span>Nguza Express Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs mt-2">
                <FaShieldAlt className="text-amber-400" />
                <span>Buyer Protection Guarantee</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-emerald-800 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <FaSeedling className="text-amber-400 text-xl" />
              <span className="font-black text-white text-lg">Nguza</span>
            </div>
            <p className="text-xs text-emerald-400">© {new Date().getFullYear()} Rodvers Company Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
