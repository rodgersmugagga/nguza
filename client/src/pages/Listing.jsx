import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  FaShareAlt, FaMapMarkerAlt, FaRegCalendarAlt, FaChevronLeft,
  FaWhatsapp, FaPhoneAlt, FaEnvelope, FaClock, FaCheckCircle,
  FaSeedling, FaPaw, FaLeaf, FaTractor, FaHandshake
} from 'react-icons/fa';
import Contact from '../components/Contact';
import ProgressiveImage from '../components/ProgressiveImage';
import DetailsDisplay from '../components/DetailsDisplay';
import { resolvePrices } from '../utils/priceUtils';
import { fetchListingById, clearCurrent } from '../redux/listings/listingsSlice.js';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Crops': return <FaSeedling />;
    case 'Livestock': return <FaPaw />;
    case 'Agricultural Inputs': return <FaLeaf />;
    case 'Equipment & Tools': return <FaTractor />;
    case 'Agricultural Services': return <FaHandshake />;
    default: return <FaSeedling />;
  }
};

const generateTitle = (listing) => {
  if (!listing) return 'Listing | Nguza';
  if (listing.seo?.title) return listing.seo.title.substring(0, 70);
  const location = listing.location?.district || 'Uganda';
  return `${listing.name} in ${location} | Nguza`.substring(0, 70);
};

const generateDescription = (listing) => {
  if (!listing) return 'Find agricultural listings on Nguza.';
  if (listing.seo?.description) return listing.seo.description.substring(0, 160);
  return `${listing.name}. ${listing.description?.substring(0, 150) || ''}`.substring(0, 160);
};

const generateStructuredData = (listing) => {
  if (!listing) return null;
  const { finalPrice } = resolvePrices(listing);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.name,
    "description": listing.description,
    "image": listing.imageUrls,
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": "UGX",
      "availability": "https://schema.org/InStock"
    }
  };
};

export default function Listing() {
  SwiperCore.use([Navigation, Autoplay, Pagination]);
  const dispatch = useDispatch();
  const params = useParams();
  const { id: idParam, listingId } = params || {};
  const id = idParam || listingId;
  const { currentListing: listing, status } = useSelector(s => s.listings || { currentListing: null, status: 'idle' });
  const { currentUser } = useSelector(state => state.user);

  const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://harvemart.onrender.com');

  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchListingById(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id]);

  if (status === 'loading') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-primary"></div>
      <p className="mt-4 text-gray-500 font-medium tracking-tight">Loading details...</p>
    </div>
  );

  if (status === 'failed' || !listing) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-2xl font-bold text-gray-800">Oops! Listing not found</h2>
      <p className="text-gray-500 mt-2">The listing might have been removed or the link is broken.</p>
      <Link to="/" className="mt-8 inline-block bg-color-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-color-primary/20 transition-all active:scale-95">
        Back to Home
      </Link>
    </div>
  );

  const { finalPrice, originalPrice } = resolvePrices(listing);
  const discountPercent = listing.offer ? Math.round((1 - (finalPrice / originalPrice)) * 100) : 0;
  const isOwner = listing.userRef === currentUser?.user?._id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Helmet>
        <title>{generateTitle(listing)}</title>
        <meta name="description" content={generateDescription(listing)} />
        <link rel="canonical" href={listing ? SITE_URL + `/listing/${listing._id}` : SITE_URL} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={listing?.imageUrls?.[0] || SITE_URL + '/og-image.jpg'} />

        {/* Product JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(listing))}
        </script>

        {/* BreadcrumbList JSON-LD */}
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
                "name": listing?.category || 'Category',
                "item": SITE_URL + `/category/${encodeURIComponent(listing?.category || '')}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": listing?.name || 'Listing',
                "item": listing ? SITE_URL + `/listing/${listing._id}` : SITE_URL
              }
            ]
          })}
        </script>

        {/* LocalBusiness/Seller JSON-LD (if available) */}
        {listing?.seller && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": listing.seller.username || 'Seller',
              "telephone": listing.contactPhone || '',
              "address": {
                "@type": "PostalAddress",
                "addressLocality": listing.location?.district || '',
                "addressCountry": "UG"
              },
              "url": SITE_URL + `/users/${listing.seller?._id || ''}`
            })}
          </script>
        )}
      </Helmet>

      {/* Modern Top Nav / Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 lg:relative">
        <nav className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-hidden">
            <Link to="/" className="flex-shrink-0 hover:text-color-primary transition-colors">Home</Link>
            <span className="flex-shrink-0">/</span>
            <Link to={`/category/${encodeURIComponent(listing.category)}`} className="flex-shrink-0 hover:text-color-primary transition-colors truncate">{listing.category}</Link>
            <span className="flex-shrink-0 hidden sm:inline">/</span>
            <span className="text-gray-900 font-bold truncate max-w-[120px] sm:max-w-xs hidden sm:inline">{listing.name}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-all border border-gray-100 active:scale-95"
          >
            {copied ? <span className="text-green-600">Link Copied!</span> : <><FaShareAlt size={12} /> Share</>}
          </button>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 mt-4 lg:mt-8">

        {/* Gallery & Main Details (Left) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">

          {/* Gallery Section */}
          <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <Swiper
              navigation={{ enabled: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={listing.imageUrls?.length > 1}
              slidesPerView={1}
              className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]"
            >
              {listing.imageUrls?.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full h-full relative group">
                    <ProgressiveImage src={url} alt={listing.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail bar hint or image count could go here - keep it clean for now */}
          </section>

          {/* Core Info Section */}
          <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="bg-color-primary text-white p-2 rounded-xl text-lg shadow-lg shadow-color-primary/20">
                  {getCategoryIcon(listing.category)}
                </div>
                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {listing.subCategory}
                </span>
                {listing.offer && (
                  <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/10">
                    {discountPercent}% OFF Special
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {listing.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-base font-medium">
                  <div className="w-8 h-8 rounded-lg bg-color-primary/5 flex items-center justify-center text-color-primary">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <span>{listing.address} • {listing.location?.district}</span>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Current Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-color-primary tracking-tighter">
                      <span className="text-2xl sm:text-3xl font-bold mr-1">UGX</span>
                      {Number(finalPrice).toLocaleString()}
                    </span>
                    {listing.offer && (
                      <span className="text-xl sm:text-2xl text-gray-300 line-through font-bold decoration-red-500/30">
                        {Number(originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {listing.details?.quantity && (
                  <div className="bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-color-primary text-xl">
                      <FaLeaf />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Available Stock</p>
                      <p className="text-lg font-black text-gray-900 leading-tight">
                        {listing.details.quantity} <span className="text-sm font-bold text-gray-500">{listing.details.unit}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Description & Technical Specs */}
          <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 space-y-10">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-color-primary rounded-full shadow-lg shadow-color-primary/30" />
                Product Overview
              </h3>
              <p className="text-gray-600 leading-[1.8] text-base sm:text-lg font-medium">
                {listing.description}
              </p>
            </div>

            <DetailsDisplay category={listing.category} subCategory={listing.subCategory} details={listing.details} />
          </section>
        </div>

        {/* Sidebar & Seller Info (Right) */}
        <div className="lg:col-span-4 space-y-6 h-full">
          <aside className="sticky top-8 space-y-6">

            {/* Seller Identity Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-color-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

              <div className="relative">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-color-primary to-green-700 flex items-center justify-center text-3xl text-white font-black shadow-2xl shadow-color-primary/30 ring-4 ring-white">
                    {listing.seller?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 text-xl flex items-center gap-2">
                      {listing.seller?.username}
                      <FaCheckCircle className="text-blue-500 text-lg drop-shadow-sm" />
                    </h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Verified Producer
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {!isOwner && (
                    <>
                      <button
                        onClick={() => { if (currentUser) { window.location.href = `tel:${listing.contactPhone || '+256'}` } else { alert("Log in to call") } }}
                        className="w-full flex items-center justify-center gap-4 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-2xl shadow-gray-200 active:scale-95"
                      >
                        <FaPhoneAlt size={16} /> Voice Call Seller
                      </button>
                      <button
                        onClick={() => { if (currentUser) { window.open(`https://wa.me/${listing.contactPhone || '+256'}?text=Hi, I'm interested in ${listing.name}`) } else { alert("Log in to message") } }}
                        className="w-full flex items-center justify-center gap-4 bg-green-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-2xl shadow-green-200 active:scale-95"
                      >
                        <FaWhatsapp size={18} /> Send WhatsApp
                      </button>

                      <button
                        onClick={() => currentUser ? setContact(true) : alert("Log in first")}
                        className="w-full text-color-primary bg-color-primary/5 py-4 rounded-2xl font-black text-sm border-2 border-dashed border-color-primary/20 hover:bg-color-primary/10 transition-all active:scale-95"
                      >
                        Instant In-App Message
                      </button>
                    </>
                  )}
                </div>

                {contact && currentUser && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <Contact listing={listing} />
                  </div>
                )}
              </div>
            </div>

            {/* Safety & Trust Card */}
            <div className="bg-amber-50/50 rounded-[2rem] p-6 border border-amber-100/50">
              <h5 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Safeguard Notice
              </h5>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-700">
                    <FaCheckCircle size={14} />
                  </div>
                  <p className="text-xs text-amber-900/60 font-bold leading-relaxed">
                    Personally verify quality before releasing payment.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-700">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <p className="text-xs text-amber-900/60 font-bold leading-relaxed">
                    Meet in familiar, public trading centers.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar - Refined Glassmorphism */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-4 lg:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              onClick={() => window.location.href = `tel:${listing.contactPhone || '+256'}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform"
            >
              <FaPhoneAlt /> Call
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${listing.contactPhone || '+256'}`)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform"
            >
              <FaWhatsapp /> Chat
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
