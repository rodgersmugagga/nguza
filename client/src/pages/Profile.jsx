import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import SafeHelmet from "../components/SafeHelmet.jsx";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  SignOutUserStart,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";
import {
  FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaCamera, FaSignOutAlt,
  FaTrashAlt, FaListUl, FaEye, FaCommentDots, FaEdit, FaPlus,
  FaArrowLeft, FaCheckCircle
} from 'react-icons/fa';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(currentUser?.user?.username || '');
  const [email, setEmail] = useState(currentUser?.user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.user?.phoneNumber || '');
  const [password, setPassword] = useState('');

  const [previewUrl, setPreviewUrl] = useState("");
  const [userProducts, setUserProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (file) {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  }, [file]);

  const [updateError, setUpdateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!currentUser?.user?._id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/view/myproducts`, {
          method: "GET",
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserProducts(Array.isArray(data) ? data : data?.products || []);
        }
      } catch (error) {
        console.error("User products fetch error:", error);
      }
    };
    fetchUserProducts();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess(false);

    setIsLoading(true);
    dispatch(updateUserStart());

    try {
      const formData = new FormData();
      if (username !== currentUser?.user?.username) formData.append("username", username);
      if (email !== currentUser?.user?.email) formData.append("email", email);
      if (phoneNumber !== currentUser?.user?.phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (password) formData.append("password", password);
      if (file) formData.append("avatar", file);

      if ([...formData.entries()].length === 0) {
        setUpdateError("No changes to update");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser.user._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${currentUser.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setFile(null);
      setPreviewUrl('');
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
      setPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (err) {
      dispatch(updateUserFailure(err.message));
      setUpdateError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    if (!window.confirm("Do you want to sign out?")) return;
    dispatch(SignOutUserStart());
    localStorage.removeItem("token");
    dispatch(deleteUserSuccess(null));
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm("Permanently delete this product?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        setUserProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <SafeHelmet>
        <title>Account Dashboard | Nguza</title>
      </SafeHelmet>

      <main className="min-h-screen bg-[#fafbfc] pb-12">
        <div className="h-48 sm:h-64 bg-emerald-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-24">
              <FaArrowLeft size={10} /> Back to Marketplace
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center">
                <div className="relative inline-block mx-auto mb-6 group cursor-pointer" onClick={() => fileRef.current.click()}>
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 flex items-center justify-center p-1 shadow-xl ring-4 ring-white">
                    <img className="w-full h-full object-cover rounded-[2rem]" src={previewUrl || currentUser?.user?.avatar || '/favicon.svg'} alt="Profile" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-emerald-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white">
                    <FaCamera size={14} />
                  </div>
                  <input onChange={(e) => setFile(e.target.files?.[0])} type="file" ref={fileRef} hidden accept="image/*" />
                </div>

                <h2 className="text-2xl font-black text-gray-900">{currentUser?.user?.username}</h2>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Status</p>
                    <p className="text-xs font-black text-emerald-600 bg-emerald-50 py-1 rounded-full text-center">Active</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Products</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">{userProducts.length}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-gray-50">
                  <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <FaUser size={14} /> Settings
                  </button>
                  <button onClick={() => setActiveTab('listings')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'listings' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <FaListUl size={14} /> My Products
                  </button>
                </div>

                <button onClick={handleSignOut} className="mt-8 text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline">
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {activeTab === 'settings' && (
                <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Account Settings</h3>
                  {updateSuccess && <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-3xl font-bold text-sm">Profile updated!</div>}
                  {updateError && <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-3xl font-bold text-sm">{updateError}</div>}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="tel" placeholder="Phone" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <input type="email" placeholder="Email (optional)" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="New Password" className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">{isLoading ? 'Updating...' : 'Save Changes'}</button>
                  </form>
                  <Link to="/add-product" className="w-full flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-4 rounded-2xl font-black border-2 border-dashed border-emerald-200 mt-4">
                    <FaPlus size={12} /> Post New Product
                  </Link>
                </section>
              )}

              {activeTab === 'listings' && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 px-4 sm:px-0">My Products</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {userProducts.map((p) => (
                      <div key={p._id} className="bg-white rounded-[2rem] p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6">
                        <Link to={`/product/${p._id}`} className="w-full sm:w-48 h-40 flex-shrink-0 overflow-hidden rounded-2xl">
                          <img src={p.imageUrls?.[0] || "/favicon.svg"} alt={p.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between py-2">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                              <span className="text-sm font-black text-emerald-600">UGX {p.regularPrice.toLocaleString()}</span>
                            </div>
                            <h4 className="text-xl font-black text-gray-900">{p.name}</h4>
                            <div className="flex gap-4 mt-2">
                              <span className="text-[10px] text-gray-500 flex items-center gap-1"><FaEye /> {p.views || 0}</span>
                              <span className="text-[10px] text-gray-500 flex items-center gap-1"><FaCommentDots /> {p.contactClicks || 0}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link to={`/update-product/${p._id}`} className="p-3 bg-gray-50 text-gray-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"><FaEdit size={14} /></Link>
                            <button onClick={() => handleProductDelete(p._id)} className="p-3 bg-gray-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><FaTrashAlt size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userProducts.length === 0 && (
                      <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
                        <p className="text-gray-500 font-bold mb-4">No products found</p>
                        <Link to="/add-product" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black">Create My First Product</Link>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
