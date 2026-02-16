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
        const res = await fetch(`/api/listing/suggestions?query=${searchTerm}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) { console.error(error); }
    };
    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setShowCatDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ─── Top Bar ─── Emerald-900 */}
      <div className="bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] py-1.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-300">
              <FaMapMarkerAlt className="text-[10px]" /> Deliver to Uganda
            </span>
            <Link to="/order-history" className="hover:text-amber-400 transition-colors hidden sm:flex items-center gap-1">
              <FaMapMarkerAlt className="text-[10px]" /> Farm Order Tracking
            </Link>
            <Link to="/create-listing" className="hover:text-amber-400 transition-colors hidden sm:inline">Sell on Nguza</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-amber-400 transition-colors">Help</Link>
            {currentUser?.user?.isAdmin && (
              <Link to="/admin-dashboard" className="text-amber-400 font-bold flex items-center gap-1">
                <FaShieldAlt className="text-[10px]" /> Admin
              </Link>
            )}
            {currentUser ? (
              <Link to="/profile" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <FaUser className="text-[10px]" />
                Hi, {currentUser.user?.username?.split(' ')[0] || 'User'}
              </Link>
            ) : (
              <Link to="/sign-in" className="hover:text-amber-400 transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Header ─── Emerald-800 */}
      <div className="bg-emerald-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 sm:gap-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img src="/logo.png" alt="Nguza Logo" className="h-8 w-auto sm:h-10 group-hover:scale-105 transition-transform" />
            <span className="font-black text-xl sm:text-2xl text-white tracking-tight">Nguza</span>
          </Link>

          {/* ─── Amazon-style Search with Category Dropdown ─── */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
            <div className="flex items-stretch rounded-lg overflow-hidden ring-2 ring-transparent focus-within:ring-amber-400 focus-within:ring-offset-2 focus-within:ring-offset-emerald-800 transition-all bg-white shadow-sm">
              {/* Category Selector */}
              <div ref={catRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  className="h-full px-3 bg-gray-100 border-r border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  {searchCategory} <FaChevronDown className="text-[8px]" />
                </button>
                {showCatDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[160px] animate-in fade-in slide-in-from-top-1">
                    {SEARCH_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setSearchCategory(cat); setShowCatDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors ${searchCategory === cat ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search crops, livestock, equipment..."
                className="flex-1 px-4 py-2.5 text-sm text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Search Button */}
              <button type="submit" className="px-5 bg-amber-400 hover:bg-amber-500 text-emerald-900 transition-colors">
                <FaSearch className="text-lg" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => { navigate(`/listing/${item._id}`); setSearchTerm(''); setSuggestions([]); }}
                    className="p-3 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <img src={item.imageUrls?.[0]} alt={item.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* ─── Right Nav Icons ─── */}
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0 text-white">
            {currentUser && (
              <>
                <Link to="/wishlist" className="flex flex-col items-center p-1.5 hover:text-amber-400 transition-colors" title="Wishlist">
                  <FaHeart className="text-lg" />
                  <span className="text-[10px] hidden sm:block mt-0.5">Wishlist</span>
                </Link>
                <Link to="/order-history" className="flex flex-col items-center p-1.5 hover:text-amber-400 transition-colors" title="Orders">
                  <FaBoxOpen className="text-lg" />
                  <span className="text-[10px] hidden sm:block mt-0.5">Orders</span>
                </Link>
                <Link to="/seller-dashboard" className="flex flex-col items-center p-1.5 hover:text-amber-400 transition-colors" title="Sell">
                  <FaStore className="text-lg" />
                  <span className="text-[10px] hidden sm:block mt-0.5">Sell</span>
                </Link>
              </>
            )}
            <Link to="/cart" className="flex flex-col items-center p-1.5 hover:text-amber-400 transition-colors relative" title="Cart">
              <div className="relative">
                <FaShoppingCart className="text-lg" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-amber-400 text-emerald-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px] hidden sm:block mt-0.5">Cart</span>
            </Link>
            {currentUser && (
              <Link to="/profile" className="flex-shrink-0 ml-1">
                <img className="rounded-full h-8 w-8 object-cover border-2 border-emerald-600 hover:border-amber-400 transition-colors" src={currentUser?.user?.avatar || '/favicon.svg'} alt="profile" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Category Nav Bar ─── Emerald-700 (Jumia-style) */}
      <div className="bg-emerald-700 text-white overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-600 rounded text-sm font-semibold transition-colors">
            <FaBars className="text-xs" /> All Categories
          </button>
          <div className="h-5 w-px bg-emerald-600 mx-1" />
          {['Crops', 'Livestock', 'Farm Inputs', 'Machinery', 'Fresh Harvest', 'Services'].map(cat => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat === 'Farm Inputs' ? 'Agricultural Inputs' : cat === 'Machinery' ? 'Equipment & Tools' : cat === 'Fresh Harvest' ? 'Crops' : cat)}`}
              className="px-3 py-2 hover:bg-emerald-600 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
          <Link to="/create-listing" className="ml-auto px-3 py-2 hover:bg-emerald-600 rounded text-xs sm:text-sm font-semibold text-amber-400 transition-colors whitespace-nowrap">
            + Post Listing
          </Link>
        </div>
      </div>
    </header>
  );
}
