import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaTruck, FaBox } from 'react-icons/fa';

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-3xl font-black text-gray-900">Order {order._id}</h1>

          {/* Order Timeline */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <FaTruck className="text-color-primary" /> Track Order
            </h2>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>

              <div className="space-y-8 relative">
                {order.statusHistory?.map((history, index) => (
                  <div key={index} className="flex gap-6 relative">
                    {/* Dot */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 transition-all ${index === order.statusHistory.length - 1
                        ? 'bg-color-primary border-green-100 text-white shadow-lg shadow-green-200'
                        : 'bg-gray-100 border-white text-gray-400'
                      }`}>
                      <div className={`w-3 h-3 rounded-full ${index === order.statusHistory.length - 1 ? 'bg-white' : 'bg-gray-400'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`font-bold ${index === order.statusHistory.length - 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                          {history.status}
                        </h4>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg w-fit">
                          {new Date(history.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 max-w-md">{history.description}</p>
                    </div>
                  </div>
                ))}

                {/* Future Steps Placeholder (Visual Cue) */}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <div className="flex gap-6 relative opacity-30">
                    <div className="w-9 h-9 rounded-full bg-gray-50 border-4 border-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-gray-300 text-sm">Next Step...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Shipping Details</h2>
            <p className="text-gray-600 mb-2">
              <strong className="text-gray-900">Name: </strong> {order.user?.username}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-gray-900">Email: </strong> <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
            </p>
            <p className="text-gray-600 mb-4">
              <strong className="text-gray-900">Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-600 mb-4">
              <strong className="text-gray-900">Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold text-sm">
                <FaCheckCircle /> Paid on {order.paidAt?.substring(0, 10)}
              </div>
            ) : (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold text-sm">
                <FaTimesCircle /> Not Paid
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                  <div className="flex-1">
                    <Link to={`/products/${item.product}`} className="font-bold text-gray-900 hover:text-color-primary">
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {item.quantity} x UGX {item.price.toLocaleString()} = <span className="font-bold text-gray-900">UGX {(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-bold">UGX {order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold">UGX {order.shippingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-bold">UGX {order.taxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-black text-gray-900 mb-8">
              <span>Total</span>
              <span className="text-color-primary">UGX {order.totalPrice.toLocaleString()}</span>
            </div>

            {!order.isPaid && (
              <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-200 active:scale-95 mb-4">
                Pay Now ({order.paymentMethod})
              </button>
            )}

            {/* Placeholder for admin buttons to update status */}
          </div>
        </div>
      </div>
    </main>
  );
}
