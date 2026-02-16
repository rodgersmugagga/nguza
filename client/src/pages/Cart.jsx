import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/cart/cartSlice';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
          Shopping Cart
          <span className="text-lg font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{totalItems} items</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
            <Link to="/" className="inline-flex items-center gap-2 text-color-primary font-bold hover:underline">
              <FaArrowLeft /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product + (item.variant?.sku || '')} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 sm:gap-6 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-gray-50" />

                  <div className="flex-1">
                    <Link to={`/products/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-color-primary line-clamp-1">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500 font-medium">{item.variant.name}</p>
                    )}
                    <p className="text-color-primary font-black mt-1">UGX {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <button
                        onClick={() => dispatch(addToCart({ ...item, quantity: Math.max(1, item.quantity - 1) }))}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="font-bold text-gray-900 text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(addToCart({ ...item, quantity: Math.min(item.countInStock, item.quantity + 1) }))}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart({ id: item.product, sku: item.variant?.sku }))}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold">UGX {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-xs text-gray-400 italic">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-black text-gray-900">
                    <span>Total</span>
                    <span className="text-color-primary">UGX {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
