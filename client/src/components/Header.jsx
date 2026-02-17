import { FaSearch, FaSeedling, FaShieldAlt, FaShoppingCart, FaBoxOpen, FaStore, FaHeart, FaMapMarkerAlt, FaChevronDown, FaUser, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

const SEARCH_CATEGORIES = ['All Agri', 'Crops', 'Livestock', 'Inputs', 'Equipment', 'Services'];

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Agri');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const catRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm.trim()) urlParams.set('searchTerm', searchTerm);
    if (searchCategory !== 'All Agri') urlParams.set('category', searchCategory);
    navigate(`/search?${urlParams.toString()}`);
  };

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) { setSuggestions([]); return; }
      try {
        const res = await fetch(`/api/products/suggestions?query=${searchTerm}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) { console.error(error); }
    };
    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setShowCatDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* ─── Top Bar (Desktop Only) ─── */}
      <div className="hidden sm:block bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] py-1.5 font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <FaMapMarkerAlt className="text-[10px]" /> Deliver to Uganda
            </span>
            <Link to="/order-history" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <FaBoxOpen className="text-[10px]" /> Track Order
            </Link>
            <Link to="/register-vendor" className="hover:text-amber-400 transition-colors">Sell on Nguza</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-amber-400 transition-colors">Help Center</Link>
            {currentUser?.user?.isAdmin && (
              <Link to="/admin-dashboard" className="text-amber-400 font-bold flex items-center gap-1.5">
                <FaShieldAlt className="text-[10px]" /> Admin
              </Link>
            )}
            {currentUser ? (
              <span className="flex items-center gap-1.5 uppercase font-bold text-emerald-100">
                <FaUser className="text-[10px]" /> {currentUser.user?.username?.split(' ')[0]}
              </span>
            ) : (
              <Link to="/sign-in" className="hover:text-amber-400 transition-colors font-bold">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Header ─── */}
      <div className="bg-emerald-800 pb-2 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">

          {/* Logo and Cart (Mobile Layout) */}
          <div className="w-full sm:w-auto flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Nguza" className="h-8 w-auto sm:h-9 group-hover:scale-105 transition-transform" />
              <span className="font-black text-xl sm:text-2xl text-white tracking-tighter">Nguza</span>
            </Link>

            <div className="flex items-center gap-3 sm:hidden">
              <Link to="/cart" className="relative p-2 text-white hover:text-amber-400 transition-colors">
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-emerald-800">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
              {currentUser && (
                <Link to="/profile">
                  <img className="rounded-full h-8 w-8 object-cover border-2 border-emerald-600" src={currentUser?.user?.avatar || '/favicon.svg'} alt="profile" />
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar - Full width on mobile */}
          <form onSubmit={handleSubmit} className="w-full flex-1 max-w-2xl relative">
            <div className="flex items-stretch rounded-xl overflow-hidden bg-white shadow-soft focus-within:ring-2 focus-within:ring-amber-400 transition-all">
              {/* Category Dropdown (Desktop Only) */}
              <div ref={catRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  className="h-full px-4 bg-gray-50 border-r border-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                >
                  {searchCategory} <FaChevronDown className="text-[8px]" />
                </button>
                {showCatDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[180px] animate-in">
                    {SEARCH_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setSearchCategory(cat); setShowCatDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-xs font-semibold hover:bg-emerald-50 transition-colors ${searchCategory === cat ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search farm fresh products..."
                className="flex-1 px-4 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button type="submit" className="px-5 bg-amber-400 hover:bg-amber-500 text-emerald-900 transition-colors border-l border-amber-300">
                <FaSearch className="text-lg" />
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => { setSearchTerm(''); setSuggestions([]); }}
                    className="p-4 hover:bg-emerald-50 cursor-pointer flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Desktop Navigation Icons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-6 flex-shrink-0">
            {currentUser && (
              <div className="flex items-center gap-4">
                <Link to="/wishlist" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors">
                  <FaHeart className="text-lg" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Wishlist</span>
                </Link>
                <Link to="/seller-dashboard" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors">
                  <FaStore className="text-lg" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Sell</span>
                </Link>
              </div>
            )}

            <Link to="/cart" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors relative">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-emerald-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">My Cart</span>
            </Link>

            {currentUser && (
              <Link to="/profile" className="flex-shrink-0 h-10 w-10 border-2 border-emerald-600 rounded-full overflow-hidden hover:border-amber-400 transition-all p-0.5">
                <img className="rounded-full h-full w-full object-cover" src={currentUser?.user?.avatar || '/favicon.svg'} alt="profile" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Secondary Nav (Categories) ─── */}
      <div className="bg-emerald-700 text-white overflow-x-auto scrollbar-hide shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 sm:gap-2">
          <button className="flex items-center gap-2 px-4 py-3 hover:bg-emerald-600 rounded-none text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap border-r border-emerald-600/50">
            <FaBars className="text-xs" /> Categories
          </button>

          <div className="flex items-center h-full mask-fade-right">
            {['Crops', 'Livestock', 'Farm Inputs', 'Machinery', 'Fresh Harvest', 'Services'].map(cat => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat === 'Farm Inputs' ? 'Agricultural Inputs' : cat === 'Machinery' ? 'Equipment & Tools' : cat === 'Fresh Harvest' ? 'Crops' : cat)}`}
                className="px-4 py-3 hover:bg-emerald-600 text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>

          <Link
            to={currentUser?.user?.role === 'seller' ? "/add-product" : "/register-vendor"}
            className="ml-auto px-4 py-3 bg-amber-400 text-emerald-900 hover:bg-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap shadow-xl"
          >
            {currentUser?.user?.role === 'seller' ? "+ Post Product" : "Start Selling"}
          </Link>
        </div>
      </div>
    </header>
  );
}
