import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBox, FaChartLine, FaClipboardList, FaPlus, FaTrashAlt, FaPen } from 'react-icons/fa';

export default function SellerDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch('/api/products/myproducts', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Ensure data is an array before setting
        setProducts(Array.isArray(data) ? data : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        if (res.ok) {
          setProducts(products.filter((product) => product._id !== id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your inventory and track performance</p>
          </div>
          <Link to="/create-listing" className="bg-color-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-color-primary/30 hover:brightness-110 transition-all">
            <FaPlus /> Add New Product
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <FaBox size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Products</p>
            <h4 className="text-3xl font-black text-gray-900">{Array.isArray(products) ? products.length : 0}</h4>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <FaChartLine size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Views</p>
            <h4 className="text-3xl font-black text-gray-900">--</h4> {/* Placeholder for views if implemented */}
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <FaClipboardList size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Orders</p>
            <h4 className="text-3xl font-black text-gray-900">--</h4> {/* Placeholder for seller orders */}
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-xl font-black text-gray-900">Your Inventory</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading products...</div>
          ) : !Array.isArray(products) || products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
              <Link to="/create-listing" className="text-color-primary font-bold hover:underline">Start selling today!</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Stock</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.isArray(products) && products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                          <Link to={`/products/${product._id}`} className="font-bold text-gray-900 hover:text-color-primary line-clamp-1">{product.name}</Link>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-600">{product.category}</td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-900">UGX {product.regularPrice.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm text-gray-600">{product.countInStock || 'N/A'}</td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                        <Link to={`/update-listing/${product._id}`} className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                          <FaPen />
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
