import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaListAlt, FaShoppingBag, FaChartLine, FaTrashAlt, FaEye,
  FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaShieldAlt,
  FaTruck, FaMoneyBillWave, FaPen, FaBan, FaUndo, FaStar, FaCheck, FaTimes
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'users', 'listings', 'orders'
  const [editModal, setEditModal] = useState(null); // { type, data }

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [statsRes, usersRes, listingsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/listings`, { headers }),
        fetch(`${API_URL}/api/admin/orders`, { headers })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const listingsData = await listingsRes.json();
      const ordersData = await ordersRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (usersRes.ok) setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      if (listingsRes.ok) setListings(Array.isArray(listingsData.listings) ? listingsData.listings : []);
      if (ordersRes.ok) setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);

    } catch (err) {
      setError("Failed to fetch administrative data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // USER MANAGEMENT ACTIONS
  // ============================================

  const handleBanUser = async (userId) => {
    if (!window.confirm("Toggle ban status for this user?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}/ban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u._id === userId ? { ...u, isBanned: data.user.isBanned } : u));
      }
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          role: newRole,
          isSeller: newRole === 'seller' || newRole === 'admin',
          isAdmin: newRole === 'admin'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u._id === userId ? { ...u, ...data.user } : u));
      }
    } catch (err) {
      alert("Failed to change role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will delete the user and ALL their listings!")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
        fetchAdminData(); // Refresh stats
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // ============================================
  // LISTING MANAGEMENT ACTIONS
  // ============================================

  const handleApproveListing = async (listingId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/listing/${listingId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setListings(listings.map(l => l._id === listingId ? data.listing : l));
      }
    } catch (err) {
      alert("Failed to approve listing");
    }
  };

  const handleRejectListing = async (listingId) => {
    const reason = prompt("Rejection reason (optional):");
    try {
      const res = await fetch(`${API_URL}/api/admin/listing/${listingId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        setListings(listings.map(l => l._id === listingId ? data.listing : l));
      }
    } catch (err) {
      alert("Failed to reject listing");
    }
  };

  const handleFeatureListing = async (listingId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/listing/${listingId}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ days: 7 })
      });
      if (res.ok) {
        const data = await res.json();
        setListings(listings.map(l => l._id === listingId ? data.listing : l));
      }
    } catch (err) {
      alert("Failed to feature listing");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Moderating this listing will permanently remove it. Continue?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/listing/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        setListings(listings.filter(l => l._id !== listingId));
        fetchAdminData(); // Refresh stats
      }
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  // ============================================
  // ORDER MANAGEMENT ACTIONS
  // ============================================

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/order/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
      }
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Cancellation reason:");
    if (!reason) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/order/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
      }
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-color-primary/30 border-t-color-primary rounded-full animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-20">
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-6">
            <FaArrowLeft size={10} /> Back to Marketplace
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 text-color-primary font-black uppercase tracking-[0.2em] text-xs">
                <FaShieldAlt /> Administrative Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Nguza Command Center</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
              <FaUsers size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
            <h4 className="text-3xl font-black text-gray-900">{stats?.totalUsers || 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
              <FaListAlt size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Listings</p>
            <h4 className="text-3xl font-black text-gray-900">{stats?.totalListings || 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3">
              <FaShoppingBag size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
            <h4 className="text-3xl font-black text-gray-900">{Array.isArray(orders) ? orders.length : 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
              <FaMoneyBillWave size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Market Value</p>
            <h4 className="text-xl font-black text-gray-900">UGX {(stats?.totalMarketValue || 0).toLocaleString()}</h4>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { key: 'stats', label: 'Dashboard', icon: FaChartLine },
              { key: 'users', label: 'Users', icon: FaUsers, count: users.length },
              { key: 'listings', label: 'Listings', icon: FaListAlt, count: listings.length },
              { key: 'orders', label: 'Orders', icon: FaShoppingBag, count: orders.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === tab.key
                    ? 'bg-color-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-bold text-blue-900 mb-1">Active Listings</p>
                    <p className="text-2xl font-black text-blue-600">{stats?.activeListings || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm font-bold text-green-900 mb-1">Pending Approvals</p>
                    <p className="text-2xl font-black text-green-600">
                      {Array.isArray(listings) ? listings.filter(l => l.status === 'pending').length : 0}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm font-bold text-purple-900 mb-1">Banned Users</p>
                    <p className="text-2xl font-black text-purple-600">
                      {Array.isArray(users) ? users.filter(u => u.isBanned).length : 0}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-sm font-bold text-amber-900 mb-1">Sellers</p>
                    <p className="text-2xl font-black text-amber-600">
                      {Array.isArray(users) ? users.filter(u => u.isSeller).length : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(users) && users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-bold text-gray-900">{user.username}</p>
                                <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role || 'user'}
                              onChange={(e) => handleChangeRole(user._id, e.target.value)}
                              className="px-2 py-1 text-xs font-bold rounded border border-gray-200"
                              disabled={user.isAdmin}
                            >
                              <option value="user">User</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {user.isBanned ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Banned</span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {!user.isAdmin && (
                                <>
                                  <button
                                    onClick={() => handleBanUser(user._id)}
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                    title={user.isBanned ? "Unban" : "Ban"}
                                  >
                                    {user.isBanned ? <FaUndo size={14} /> : <FaBan size={14} />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrashAlt size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LISTINGS TAB */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Listing Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Listing</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(listings) && listings.map(listing => (
                        <tr key={listing._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {listing.imageUrls?.[0] && (
                                <img src={listing.imageUrls[0]} alt={listing.name} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-bold text-gray-900 line-clamp-1">{listing.name}</p>
                                <p className="text-xs text-gray-500">{listing.location?.district || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{listing.category}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">UGX {listing.regularPrice?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-700' :
                                listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                              }`}>
                              {listing.status || 'unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {listing.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveListing(listing._id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                    title="Approve"
                                  >
                                    <FaCheck size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectListing(listing._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Reject"
                                  >
                                    <FaTimes size={14} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleFeatureListing(listing._id)}
                                className={`p-2 rounded transition-colors ${listing.isFeatured
                                    ? 'text-amber-600 bg-amber-50'
                                    : 'text-gray-400 hover:bg-gray-50'
                                  }`}
                                title={listing.isFeatured ? "Unfeature" : "Feature"}
                              >
                                <FaStar size={14} />
                              </button>
                              <Link
                                to={`/listing/${listing._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View"
                              >
                                <FaEye size={14} />
                              </Link>
                              <button
                                onClick={() => handleDeleteListing(listing._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <FaTrashAlt size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Order Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-black text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Order ID</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(orders) && orders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-mono text-xs text-gray-600">{order._id.slice(-8)}</p>
                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-900">{order.user?.username || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">UGX {order.totalPrice?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status || 'Pending'}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-2 py-1 text-xs font-bold rounded border border-gray-200"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/order/${order._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                <FaEye size={14} />
                              </Link>
                              {order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Cancel Order"
                                >
                                  <FaTimes size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
