import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaSeedling, FaPaw, FaLeaf, FaTractor, FaHandshake, FaChevronRight, FaChevronLeft, FaBolt, FaClock, FaShieldAlt, FaFire } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../redux/products/productsSlice.js';
import ProductItem from '../components/ProductItem.jsx';
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

  const { currentUser } = useSelector((state) => state.user);
  const { featured, items, status } = useSelector(s => s.products || { featured: [], items: [], status: 'idle' });

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({ page: 1, limit: 24 }));
  }, [dispatch]);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(p => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const [flashEnd] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  const countdown = useCountdown(flashEnd);

  const filteredItems = useMemo(() => {
    if (!activeCat || !Array.isArray(items)) return items;
    return items.filter(item => item.category === activeCat);
  }, [items, activeCat]);

  const handleCategoryClick = (categoryKey) => {
    navigate(`/category/${encodeURIComponent(categoryKey)}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden pb-12 sm:pb-0">
      <Helmet>
        <title>Nguza | Uganda's Agriculture Marketplace</title>
        <meta name="description" content="Uganda's trusted agriculture marketplace. Buy and sell crops, livestock, equipment, and services." />
        <link rel="canonical" href={SITE_URL + '/'} />
      </Helmet>

      {/* Mobile-Only Action Banner */}
      <section className="sm:hidden px-4 py-4 mt-2">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black leading-tight mb-2">Have something to sell?</h2>
            <p className="text-xs text-emerald-100 mb-4 opacity-90 font-medium">Join thousands of farmers making money on Nguza.</p>
            <Link
              to={currentUser ? (currentUser.user?.role === 'seller' ? "/add-product" : "/register-vendor") : "/sign-in"}
              className="bg-amber-400 text-emerald-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest inline-block shadow-lg active:scale-95 transition-all"
            >
              + Post Your Product
            </Link>
          </div>
          <div className="absolute right-[-10%] bottom-[-20%] text-8xl opacity-10 rotate-12">🚜</div>
        </div>
      </section>

      {/* Mobile-Only Category Icons */}
      <section className="sm:hidden bg-white border-y border-gray-100 py-6 mb-2 mt-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 min-w-max px-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className="flex flex-col items-center gap-3 transition-transform active:scale-90"
              >
                <div className="w-14 h-14 rounded-3xl bg-gray-50 text-emerald-600 flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                  <Icon />
                </div>
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{cat.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:pt-4 sm:pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-4">

          {/* Left Category Menu */}
          <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden self-start">
            <div className="bg-emerald-800 text-white px-5 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-3">
              <FaSeedling className="text-amber-400" /> Categories
            </div>
            <nav className="p-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryClick(cat.key)}
                    className="w-full px-4 py-3 flex items-center justify-between text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left group rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Icon className="text-gray-400 group-hover:text-emerald-600 text-sm" />
                      </div>
                      <span className="text-[13px] font-bold">{cat.title}</span>
                    </div>
                    <FaChevronRight className="text-[10px] text-gray-300 group-hover:text-emerald-600 translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Banner Carousel */}
          <div className="relative rounded-3xl overflow-hidden shadow-premium h-[260px] sm:h-[340px] lg:h-[400px] border border-gray-100">
            {HERO_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center transition-all duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
              >
                <div className="px-6 sm:px-12 py-8 text-white max-w-xl z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-4">Marketplace</span>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-4 text-balance">{slide.title}</h2>
                  <p className="text-sm sm:text-lg text-white/80 font-medium mb-8 max-w-md">{slide.subtitle}</p>
                  <Link to={slide.link} className="btn-accent inline-flex px-8 py-3.5 rounded-full text-base">
                    {slide.cta} <FaChevronRight className="ml-2 text-xs" />
                  </Link>
                </div>
                <div className="absolute right-[-5%] bottom-[-10%] text-[15rem] sm:text-[20rem] opacity-10 select-none animate-pulse duration-[10s]">{slide.emoji}</div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-6 left-6 flex gap-2 z-20">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-10 h-2 bg-amber-400' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Promo Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="bg-amber-500 rounded-3xl p-6 text-white flex-1 flex flex-col justify-between shadow-premium relative overflow-hidden group border border-amber-400">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="z-10">
                <div className="bg-red-600 inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-lg animate-bounce">Hot Sale</div>
                <h3 className="text-xl font-black mt-3 leading-tight">Farmer's Favorites</h3>
                <p className="text-xs text-amber-100 mt-2 font-medium opacity-80">Verified seeds & inputs now on flash sale.</p>
              </div>
              <Link to="/search" className="bg-white/90 backdrop-blur-sm text-amber-700 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all text-center mt-4 shadow-lg border border-white">
                Shop Deal
              </Link>
            </div>
            <div className="bg-emerald-900 rounded-3xl p-6 text-white flex-1 flex flex-col justify-between shadow-premium relative border border-emerald-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MdVerified className="text-amber-400 text-lg" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Nguza Certified</span>
                </div>
                <h3 className="text-xl font-black leading-tight">Become a Seller</h3>
                <p className="text-xs text-emerald-300 mt-2 font-medium opacity-80">Join 10,000+ farmers across Uganda.</p>
              </div>
              <Link to="/register-vendor" className="btn-accent px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="container-responsive py-4">
        <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-premium border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shadow-sm border border-red-100">
                <FaBolt className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Flash Sales</h2>
                <div className="flex items-center gap-2 mt-1">
                  <FaClock className="text-amber-500 text-xs" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ends In:</p>
                  <div className="flex gap-1.5 ml-1">
                    {[countdown.hours, countdown.minutes, countdown.seconds].map((v, i) => (
                      <div key={i} className="bg-gray-900 text-white w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-black border border-gray-800">
                        {String(v).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link to="/search" className="text-emerald-700 font-black text-xs uppercase tracking-widest hover:text-emerald-800 transition-colors flex items-center gap-2 group ml-1">
              See All Deals <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ScrollRow>
            {status === 'loading' ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-44 sm:w-60"><SkeletonCard /></div>
              ))
            ) : (
              Array.isArray(items) && items.slice(0, 10).map((item, idx) => (
                <div key={item._id} className="snap-start flex-shrink-0 w-44 sm:w-60">
                  <div className="bg-gray-50/50 rounded-3xl p-1 pb-3 hover:bg-white transition-colors duration-500">
                    <ProductItem product={item} />
                    <div className="px-4 mt-3">
                      <div className="flex justify-between items-center text-[10px] mb-2 font-black uppercase tracking-tighter">
                        <span className="text-gray-400">Sold: {Math.max(10, 80 - idx * 5)}%</span>
                        <span className="text-red-500 font-black tracking-widest">Ending Soon</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-600 to-amber-400 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(20, 90 - idx * 6)}%` }}
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

      {/* Main Grid */}
      <section className="container-responsive py-4">
        <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-premium border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl shadow-sm border border-amber-100">
                <FaFire />
              </div>
              {activeCat || 'Trending Products'}
            </h2>
            <Link to="/search" className="text-emerald-700 font-black text-xs uppercase tracking-widest hover:text-emerald-800 transition-colors items-center gap-2 group">
              Browse More <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
            {status === 'loading' ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              Array.isArray(filteredItems) && filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ProductItem key={item._id} product={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <span className="text-6xl mb-6 block">🌾</span>
                  <h3 className="text-xl font-black text-gray-700 mb-2">No products found</h3>
                  <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">Try selecting a different category or clearing your filters.</p>
                  <button onClick={() => setActiveCat(null)} className="btn-primary">
                    Show All Products
                  </button>
                </div>
              )
            )}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link to="/search" className="btn-secondary w-full py-4 text-xs tracking-widest uppercase">
              Browse All Inventory
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      {Array.isArray(featured) && featured.length > 0 && (
        <section className="container-responsive py-4">
          <div className="bg-emerald-900 rounded-[2.5rem] p-5 sm:p-10 shadow-premium border border-emerald-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-900 flex items-center justify-center text-2xl shadow-lg">
                  ⭐
                </div>
                Recommended for You
              </h2>
            </div>
            <ScrollRow className="relative z-10">
              {featured.map(item => (
                <div key={item._id} className="snap-start flex-shrink-0 w-52 sm:w-64">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-1.5 hover:bg-white/20 transition-all duration-300 border border-white/5">
                    <ProductItem product={item} />
                  </div>
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* Footer (Simplified for Mobile) */}
      <footer className="bg-white border-t border-gray-100 mt-12 pb-24 sm:pb-8">
        <div className="container-responsive py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8 text-sm">
            <div className="text-center sm:text-left">
              <Link to="/" className="flex items-center gap-2 justify-center sm:justify-start mb-6">
                <img src="/logo.png" alt="Nguza" className="h-8 w-auto" />
                <span className="font-black text-2xl text-emerald-800 tracking-tighter">Nguza</span>
              </Link>
              <p className="text-gray-400 font-medium max-w-xs mx-auto sm:mx-0 leading-relaxed mb-6">Connecting farmers across Uganda with premium agricultural products and services.</p>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer"><FaShieldAlt /></div>
              </div>
            </div>
            {/* ... rest of footer columns simplified ... */}
            <div className="hidden sm:block">
              <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-4 font-bold text-gray-400">
                <li><Link to="/about" className="hover:text-emerald-700 transition-colors">About Our Vision</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-700 transition-colors">Get Support</Link></li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Marketplace</h4>
              <ul className="space-y-4 font-bold text-gray-400">
                <li><Link to="/search" className="hover:text-emerald-700 transition-colors">Browse Crops</Link></li>
                <li><Link to="/search" className="hover:text-emerald-700 transition-colors">Livestock Hub</Link></li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h4 className="font-black text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Safety First</h4>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="flex items-center gap-3 text-emerald-800 mb-2">
                  <FaShieldAlt className="text-xl" />
                  <span className="font-black text-xs uppercase tracking-wider">Buyer Protection</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium leading-relaxed">Your transactions are secured. We prioritize trust in every harvest.</p>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-gray-300">© {new Date().getFullYear()} NGUZA UGANDA. PREMIUM AGRI MARKETPLACE.</p>
            <div className="flex gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Term of Use</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
