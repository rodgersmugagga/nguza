import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { orderCreateRequest, orderCreateSuccess, orderCreateFail } from '../redux/orders/orderSlice';
import { clearCart } from '../redux/cart/cartSlice';

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100000 ? 0 : 5000; // Free shipping over 100k
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% VAT
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  const { order, success, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: 'order/orderReset' }); // Reset explicitly if needed, via action
    }
    // eslint-disable-next-line
  }, [success, navigate]);

  const placeOrderHandler = async () => {
    dispatch(orderCreateRequest());
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header here if needed, usually handled by HttpOnly cookie or interceptor
        },
        body: JSON.stringify({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(orderCreateSuccess(data));
        dispatch(clearCart());
      } else {
        dispatch(orderCreateFail(data.message));
      }

    } catch (err) {
      dispatch(orderCreateFail(err.message));
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Shipping</h2>
            <p className="text-gray-600">
              <strong className="text-gray-900">Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
            <p className="text-gray-600 mt-2">
              <strong className="text-gray-900">Phone: </strong>
              {cart.shippingAddress.phone}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-600">
              <strong className="text-gray-900">Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                    <div className="flex-1">
                      <Link to={`/products/${item.product}`} className="font-bold text-gray-900 hover:text-color-primary">
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {item.quantity} x {item.price.toLocaleString()} = <span className="font-bold text-gray-900">{(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-bold">UGX {itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold">UGX {shippingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-bold">UGX {taxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-black text-gray-900 mb-8">
              <span>Total</span>
              <span className="text-color-primary">UGX {Number(totalPrice).toLocaleString()}</span>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4 text-sm">{error}</div>}

            <button
              onClick={placeOrderHandler}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
