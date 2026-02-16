import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaMapMarkerAlt, FaStar, FaShoppingCart, FaMinus, FaPlus, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../redux/wishlist/wishlistSlice';
import ProgressiveImage from '../components/ProgressiveImage'; // Assuming this exists
import DetailsDisplay from '../components/DetailsDisplay'; // Assuming this exists
import { addToCart } from '../redux/cart/cartSlice';

// Placeholder for fetching product (Redux action)
import { setProduct, setLoading, setError } from '../redux/products/productSlice';

export default function ProductDetails() {
  SwiperCore.use([Navigation, Autoplay, Pagination]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const { product, loading, error } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.user);

  const isWishlisted = wishlistItems?.some((item) => item._id === product?._id);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchWishlist());
    }
  }, [currentUser, dispatch]);

  const handleWishlist = () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [rating, setRating] = useState(0); // For submitting review
  const [comment, setComment] = useState(''); // For submitting review

  // Fetch product effect (Mocking the fetch for now, replace with actual thunk)
  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(setLoading(true));
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          dispatch(setProduct(data));
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        } else {
          dispatch(setError(data.message));
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProduct();
  }, [id, dispatch]);



  const addToCartHandler = () => {
    const itemToAdd = {
      product: product._id,
      name: product.name,
      image: product.imageUrls[0],
      price: selectedVariant ? selectedVariant.price : (product.offer ? product.discountedPrice : product.regularPrice),
      countInStock: selectedVariant ? selectedVariant.stock : product.countInStock,
      quantity: qty,
      variant: selectedVariant ? { name: selectedVariant.name, sku: selectedVariant.sku } : null
    };

    dispatch(addToCart(itemToAdd));
    navigate('/cart');
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
    // Dispatch createReview action here
    alert('Review submission not implemented yet');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : (product.offer ? product.discountedPrice : product.regularPrice);
  const currentStock = selectedVariant ? selectedVariant.stock : product.countInStock;

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-24">
      <Helmet>
        <title>{product.name} | Nguza</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square relative">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              loop={product.imageUrls.length > 1}
              className="h-full w-full"
            >
              {product.imageUrls.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <img src={url} alt={product.name} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div>



            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-full transition-colors ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
              >
                {isWishlisted ? <FaHeart className="text-2xl" /> : <FaRegHeart className="text-2xl" />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <FaMapMarkerAlt />
              <span>{product.location?.district}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-6">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-color-primary">
                <span className="text-xl font-bold mr-1">UGX</span>
                {currentPrice.toLocaleString()}
              </span>
              {product.offer && !selectedVariant && (
                <span className="text-xl text-gray-400 line-through">
                  {product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variant Selection */}
            {product.hasVariants && product.variants?.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Option:</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v._id || v.name}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${selectedVariant === v
                        ? 'border-color-primary bg-color-primary text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Availability:</span>
              <span className={`font-bold ${currentStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {currentStock > 0 ? `In Stock (${currentStock})` : 'Out of Stock'}
              </span>
            </div>

            {currentStock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Quantity:</span>
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-500 hover:text-gray-700"><FaMinus size={12} /></button>
                  <span className="font-bold text-gray-900 w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(currentStock, qty + 1))} className="text-gray-500 hover:text-gray-700"><FaPlus size={12} /></button>
                </div>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={currentStock === 0}
              className="w-full flex items-center justify-center gap-3 bg-color-primary text-white py-4 rounded-2xl font-black text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-color-primary/30"
            >
              <FaShoppingCart />
              {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tech Specs */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Details</h3>
            <DetailsDisplay category={product.category} subCategory={product.subCategory} details={product.details} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Reviews</h2>
        {/* Review list and form would go here */}
        <p className="text-gray-500">Reviews feature coming soon...</p>
      </div>

    </main>
  );
}
