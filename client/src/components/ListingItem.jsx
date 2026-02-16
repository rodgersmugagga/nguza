import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn, MdFavoriteBorder, MdFavorite, MdStar, MdVerified, MdLocalShipping } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice.js';
import LazyImage from './LazyImage.jsx';
import { resolvePrices } from '../utils/priceUtils';

export default function ListingItem({ listing }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist?.items || []);
  const isFav = Array.isArray(wishlistItems) && wishlistItems.some(item => item._id === listing._id || item._id === listing.id);

  const now = new Date();
  const isFeatured = listing?.isFeatured && listing?.featuredUntil && new Date(listing.featuredUntil) > now;
  const isBoosted = listing?.boosted && listing?.boostedUntil && new Date(listing.boostedUntil) > now;

  const quantity = listing.details?.quantity ?? listing.quantity;
  const unit = listing.details?.unit ?? listing.unit;
  const breed = listing.details?.breed ?? listing.breed;
  const locationDistrict = listing.location?.district || listing.address || '';
  const { finalPrice: price, discountAmount } = resolvePrices(listing);
  const discountPct = discountAmount && price ? Math.round((discountAmount / (price + discountAmount)) * 100) : 0;

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFromWishlist(listing._id || listing.id));
    } else {
      dispatch(addToWishlist(listing._id || listing.id));
    }
  };

  return (
    <div className='group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300'>
      {/* ─── Favorite ─── */}
      <button
        onClick={handleFav}
        className="absolute top-2.5 right-2.5 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white transition-all active:scale-90 shadow-sm"
      >
        {isFav ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5" />}
      </button>

      {/* ─── Top-left Badges ─── */}
      <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">
        {discountPct > 0 && (
          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow">
            -{discountPct}%
          </span>
        )}
        {isFeatured && (
          <span className='bg-amber-400 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-0.5'>
            ✨ Featured
          </span>
        )}
        {isBoosted && !isFeatured && (
          <span className='bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow'>
            🚀 Boosted
          </span>
        )}
      </div>

      <Link
        to={`/listing/${listing._id}`}
        className="flex flex-col h-full"
        onMouseEnter={() => import('../pages/Listing')}
        onTouchStart={() => import('../pages/Listing')}
      >
        {/* ─── Image ─── Clean white background, square aspect */}
        <div className='relative w-full aspect-square bg-gray-50 overflow-hidden'>
          <LazyImage
            src={listing.imageUrls?.[0]}
            alt={listing.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
        </div>

        {/* ─── Content ─── Amazon/Jumia hybrid */}
        <div className='p-3 flex flex-col flex-1'>
          {/* Official Store Badge */}
          {listing.isFeatured && (
            <div className="flex items-center gap-1 mb-1.5">
              <MdVerified className="text-blue-500 text-sm" />
              <span className="text-[10px] text-blue-600 font-semibold">Official Store</span>
            </div>
          )}

          {/* Product Name - 2 lines */}
          <h3 className='text-sm text-gray-800 line-clamp-2 leading-snug mb-1.5 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors'>
            {listing.name}
          </h3>

          {/* ─── Star Rating ─── Amazon style */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <MdStar key={i} className={`text-sm ${i < (listing.rating || 4) ? 'text-amber-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">({listing.numReviews || Math.floor(Math.random() * 50 + 5)})</span>
          </div>

          {/* ─── Price Section ─── Jumia bold typography */}
          <div className="mt-auto">
            <p className='text-lg font-black text-gray-900'>
              UGX {Number(price).toLocaleString()}
            </p>
            {discountAmount > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <p className='text-xs text-gray-400 line-through'>
                  UGX {listing.regularPrice?.toLocaleString()}
                </p>
                <span className="text-xs text-red-500 font-semibold">-{discountPct}%</span>
              </div>
            )}
          </div>

          {/* ─── Express / Category Tag ─── */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
            {listing.isFeatured && (
              <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                <MdLocalShipping className="text-xs" /> Nguza Express
              </span>
            )}
            {listing.category === 'Crops' && quantity && (
              <span className='bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded'>
                {quantity} {unit || ''}
              </span>
            )}
            {listing.category === 'Livestock' && (
              <span className='bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded'>
                {breed || (quantity ? `${quantity} pcs` : listing.category)}
              </span>
            )}
            {!(listing.category === 'Crops' || listing.category === 'Livestock') && (
              <span className='bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded'>
                {listing.category || '—'}
              </span>
            )}
          </div>

          {/* Location & Delivery */}
          {locationDistrict && (
            <div className='flex flex-col gap-0.5 mt-1.5'>
              <div className='flex items-center gap-1 text-gray-400'>
                <MdLocationOn className='h-3 w-3 flex-shrink-0' />
                <p className='text-[10px] truncate'>{locationDistrict}</p>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">Free Delivery</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
