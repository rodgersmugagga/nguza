import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { fetchWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice';
import { addToCart } from '../redux/cart/cartSlice';
import { Helmet } from 'react-helmet-async';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchWishlist());
    }
  }, [currentUser, dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product) => {
    const itemToAdd = {
      product: product._id,
      name: product.name,
      image: product.imageUrls[0],
      price: product.offer ? product.discountedPrice : product.regularPrice,
      countInStock: product.countInStock,
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-gray-400">Loading wishlist...</div>;
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4 shadow-sm">
      <Helmet>
        <title>My Wishlist | Nguza</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <FaHeart className="text-red-500" /> My Wishlist
        </h1>

        {!Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg mb-6">Your wishlist is empty.</p>
            <Link to="/products" className="bg-color-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(wishlistItems) && wishlistItems.map((product) => (
              <div key={product._id} className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 group relative">
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors border border-gray-100"
                  title="Remove from wishlist"
                >
                  <FaTrash size={14} />
                </button>

                <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4 relative">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.offer && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                      SALE
                    </div>
                  )}
                </div>

                <Link to={`/product/${product._id}`}>
                  <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-color-primary transition-colors">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-black text-gray-900">
                    <span className="text-xs mr-1">UGX</span>
                    {(product.offer ? product.discountedPrice : product.regularPrice).toLocaleString()}
                  </span>
                  {product.offer && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
