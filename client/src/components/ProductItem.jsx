import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn, MdFavoriteBorder, MdFavorite, MdStar, MdVerified, MdLocalShipping } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice.js';
import LazyImage from './LazyImage.jsx';
import { resolvePrices } from '../utils/priceUtils';

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist?.items || []);
  const isFav = Array.isArray(wishlistItems) && wishlistItems.some(item => item._id === product._id || item._id === product.id);

  const now = new Date();
  const isFeatured = product?.isFeatured && product?.featuredUntil && new Date(product.featuredUntil) > now;
  const isBoosted = product?.boosted && product?.boostedUntil && new Date(product.boostedUntil) > now;

  const quantity = product.details?.quantity ?? product.countInStock;
  const unit = product.details?.unit ?? 'pcs';
  const breed = product.details?.breed;
  const locationDistrict = product.location?.district || product.address || '';
  const { finalPrice: price, discountAmount } = resolvePrices(product);
  const discountPct = discountAmount && (price + discountAmount) > 0 ? Math.round((discountAmount / (price + discountAmount)) * 100) : 0;

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFromWishlist(product._id || product.id));
    } else {
      dispatch(addToWishlist(product._id || product.id));
    }
  };

  return (
    <div className='group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-premium-hover transition-all duration-500 hover-scale bg-surface'>

      {/* ─── Favorite Button (Optimized for Touch) ─── */}
      <button
        onClick={handleFav}
        className="absolute top-2 right-2 z-20 p-2.5 rounded-full glass border-white/40 text-gray-400 hover:text-red-500 transition-all active:scale-75 shadow-sm"
      >
        {isFav ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5" />}
      </button>

      {/* ─── Badges ─── */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {discountPct > 0 && (
          <span className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black shadow-lg uppercase tracking-tight">
            -{discountPct}%
          </span>
        )}
        {isFeatured && (
          <span className='bg-amber-400 text-emerald-900 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black shadow-lg flex items-center gap-0.5 uppercase tracking-tight'>
            Featured
          </span>
        )}
      </div>

      <Link
        to={`/product/${product._id}`}
        className="flex flex-col h-full"
      >
        {/* ─── Image ─── */}
        <div className='relative w-full aspect-[4/5] sm:aspect-square bg-gray-50 overflow-hidden'>
          <LazyImage
            src={product.imageUrls?.[0]}
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out'
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* ─── Content ─── */}
        <div className='p-2.5 sm:p-4 flex flex-col flex-1'>

          {/* Category/Unit Tag */}
          <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
            <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate">
              {product.category || 'Agri'}
            </span>
            {product.isFeatured && <MdVerified className="text-blue-500 text-xs sm:text-sm" />}
          </div>

          {/* Product Name */}
          <h3 className='text-xs sm:text-[15px] font-bold text-gray-800 line-clamp-2 leading-tight mb-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors'>
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <MdStar key={i} className={`text-[10px] sm:text-xs ${i < (product.rating || 4) ? 'text-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold ml-1 uppercase">{product.numReviews || 0}</span>
          </div>

          {/* Price Section */}
          <div className="mt-auto space-y-0.5">
            <p className='text-sm sm:text-xl font-black text-emerald-900 tracking-tighter'>
              <span className="text-[10px] sm:text-xs">UGX</span> {Number(price).toLocaleString()}
            </p>
            {discountAmount > 0 && (
              <div className="flex items-center gap-2">
                <p className='text-[10px] sm:text-xs text-gray-300 line-through decoration-red-400/50'>
                  {product.regularPrice?.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Location & Delivery */}
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-400 max-w-[70%]">
              <MdLocationOn className="text-[10px] sm:text-sm flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight truncate">{locationDistrict || 'Uganda'}</span>
            </div>
            {isFeatured && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                <MdLocalShipping className="text-[10px] sm:text-xs text-amber-600" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
