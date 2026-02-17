import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaBox, FaShoppingBag, FaChartLine, FaTrashAlt, FaEye,
  FaArrowLeft, FaShieldAlt, FaStar, FaCheck, FaTimes, FaUndo, FaBan
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchAdminData();
  }, [currentUser.token]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/products`, { headers }),
        fetch(`${API_URL}/api/admin/orders`, { headers })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (usersRes.ok) setUsers(usersData.users || []);
      if (productsRes.ok) setProducts(productsData.products || []);
      if (ordersRes.ok) setOrders(ordersData.orders || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (path, method = 'PUT', body = null) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: body ? JSON.stringify(body) : null
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gray-900 text-white pt-12 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-400 hover:text-white text-xs font-bold flex items-center gap-2 mb-8">
            <FaArrowLeft /> Marketplace Home
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-emerald-500 font-black tracking-widest text-[10px] uppercase mb-2">Platform Control</p>
              <h1 className="text-4xl font-black">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Users', val: stats?.totalUsers, icon: FaUsers, color: 'blue' },
            { label: 'Products', val: stats?.totalProducts, icon: FaBox, color: 'emerald' },
            { label: 'Orders', val: orders.length, icon: FaShoppingBag, color: 'purple' },
            { label: 'Value', val: `UGX ${(stats?.totalMarketValue || 0).toLocaleString()}`, icon: FaChartLine, color: 'amber' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ring-1 ring-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                <h4 className="text-xl font-black text-gray-900">{s.val}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-100">
          <div className="flex border-b border-gray-50 overflow-x-auto scrollbar-hide">
            {[
              { id: 'stats', label: 'Monitor', icon: FaChartLine },
              { id: 'users', label: 'Users', icon: FaUsers },
              { id: 'products', label: 'Products', icon: FaBox },
              { id: 'orders', label: 'Orders', icon: FaShoppingBag }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <t.icon /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'users' && (
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr><th className="pb-4">User</th><th className="pb-4">Role</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u._id} className="group hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                          <div><p className="font-black text-gray-900">{u.username}</p><p className="text-[10px] text-gray-400">{u.phoneNumber}</p></div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-xs">{u.role}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${u.isBanned ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleAction(`user/${u._id}/ban`, 'PUT')} className="p-2 text-gray-400 hover:text-red-600 transition-colors uppercase text-[10px] font-black">
                          {u.isBanned ? 'Lift Ban' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'products' && (
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr><th className="pb-4">Product</th><th className="pb-4">Price</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p._id} className="group hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrls?.[0]} className="w-10 h-10 rounded-xl object-cover" />
                          <div><p className="font-black text-gray-900 line-clamp-1">{p.name}</p><p className="text-[10px] text-gray-400">{p.category}</p></div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-xs">UGX {p.regularPrice.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${p.moderationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.moderationStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleAction(`products/${p._id}/approve`, 'PUT')} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl"><FaCheck size={12} /></button>
                        <button onClick={() => handleAction(`products/${p._id}`, 'DELETE')} className="p-2 text-red-600 bg-red-50 rounded-xl"><FaTrashAlt size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
