import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaEye } from 'react-icons/fa';

export default function OrderHistory() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="text-center py-20">Please sign in to view your orders</div>;

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <FaBoxOpen className="text-color-primary" /> My Orders
        </h1>

        {loading ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            Loading your orders...
          </div>
        ) : !Array.isArray(orders) || orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-lg mb-6">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(orders) && orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:border-color-primary/30 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Order ID: {order._id}</span>
                    <span className="text-xs font-bold text-gray-300">•</span>
                    <span className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-xl font-black text-gray-900">UGX {order.totalPrice.toLocaleString()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {order.isPaid ? 'Paid' : 'Payment Pending'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <img key={idx} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                    ))}
                    {order.orderItems.length > 3 && (
                      <span className="text-xs font-bold text-gray-400">+{order.orderItems.length - 3} more</span>
                    )}
                  </div>
                </div>

                <Link to={`/order/${order._id}`} className="md:self-center bg-gray-50 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap">
                  Details <FaEye />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
