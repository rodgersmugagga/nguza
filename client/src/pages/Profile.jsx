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
  //const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'listings'

  useEffect(() => {
    if (file) {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  }, [file]);

  const [updateError, setUpdateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Auto-fetch listings on mount to show the count in the sidebar
  useEffect(() => {
    const fetchListings = async () => {
      const userId = currentUser?.user?._id;
      if (!userId) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const listings = Array.isArray(data) ? data : data?.listings ?? [];
          setUserListings(listings);
        }
      } catch (error) {
        console.error("Initial listings fetch error:", error);
      }
    };
    fetchListings();
  }, [currentUser]);

  const validateForm = () => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUpdateError("Please enter a valid email address");
      return false;
    }
    if (!phoneNumber) {
      setUpdateError("Phone number is required");
      return false;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setUpdateError("Please enter a valid Ugandan phone number");
      return false;
    }
    if (password && password.length < 6) {
      setUpdateError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);
    dispatch(updateUserStart());

    try {
      const formData = new FormData();
      let tempImageUrl = null;

      if (username !== currentUser?.user?.username) formData.append("username", username);
      if (email !== currentUser?.user?.email) formData.append("email", email);
      if (phoneNumber !== currentUser?.user?.phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (password) formData.append("password", password);
      if (file) {
        formData.append("avatar", file);
        tempImageUrl = URL.createObjectURL(file);
      }

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

      if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
      setFile(null);
      setPreviewUrl('');

      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
      setPassword('');

      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (err) {
      console.error("Update error:", err);
      dispatch(updateUserFailure(err.message));
      setUpdateError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent!")) return;
    const userId = currentUser?.user?._id;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || "Failed to delete user"));
        return;
      }
      dispatch(deleteUserSuccess(data));
      alert("Account deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = () => {
    if (!window.confirm("Do you want to sign out?")) return;
    dispatch(SignOutUserStart());
    localStorage.removeItem("token");
    dispatch(deleteUserSuccess(null));
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/${listingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || 'Failed to delete listing!');
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <>
      <SafeHelmet>
        <title>Account Dashboard | Nguza</title>
        <meta name="description" content="Manage your Nguza profile, track listing views, and interact with buyers." />
      </SafeHelmet>

      <main className="min-h-screen bg-[#fafbfc] pb-12">
        {/* Banner Section */}
        <div className="h-48 sm:h-64 bg-gradient-to-br from-color-primary to-green-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-24 md:mb-32">
              <FaArrowLeft size={10} /> Back to Marketplace
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Sidebar / Profile Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-color-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                <div className="relative">
                  {/* Avatar section */}
                  <div className="relative inline-block mx-auto mb-6 group cursor-pointer" onClick={() => fileRef.current.click()}>
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-1 shadow-2xl ring-4 ring-white transition-transform group-hover:scale-105">
                      <img
                        className="w-full h-full object-cover rounded-[2rem]"
                        src={previewUrl || currentUser?.user?.avatar}
                        alt="Profile"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/favicon.svg"; }}
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-color-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                      <FaCamera size={14} />
                    </div>
                    <input onChange={(e) => setFile(e.target.files?.[0])} type="file" ref={fileRef} hidden accept="image/*" />
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 flex items-center justify-center gap-2">
                    {currentUser?.user?.username}
                    <FaCheckCircle className="text-blue-500 text-base" />
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Producer</p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Status</p>
                      <p className="text-xs font-black text-color-primary bg-color-primary/10 py-1 rounded-full">Active</p>
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Listings</p>
                      <p className="text-lg font-black text-gray-900 leading-tight">{userListings.length}</p>
                    </div>
                  </div>

                  {/* Sidebar Quick Actions */}
                  <div className="mt-8 space-y-3 pt-6 border-t border-gray-50">
                    <button
                      onClick={() => { setActiveTab('settings'); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-color-primary text-white shadow-lg shadow-color-primary/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      <FaUser size={14} /> Account Settings
                    </button>
                    <button
                      onClick={() => { setActiveTab('listings'); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'listings' ? 'bg-color-primary text-white shadow-lg shadow-color-primary/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      <FaListUl size={14} /> My Inventory
                    </button>
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 ">
                      <button onClick={handleSignOut} className="flex items-center justify-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 p-3 rounded-xl transition-all">
                        <FaSignOutAlt /> Sign Out
                      </button>
                      <button onClick={handleDeleteUser} className="flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 p-3 rounded-xl transition-all">
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">

              {/* Tab Navigation (Desktop Only Indicator) */}
              <div className="hidden lg:flex items-center gap-6 mb-2">
                <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'settings' ? 'text-color-primary border-color-primary' : 'text-gray-400 border-transparent'}`}>Settings</button>
                <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'listings' ? 'text-color-primary border-color-primary' : 'text-gray-400 border-transparent'}`}>Inventory</button>
              </div>

              {activeTab === 'settings' && (
                <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-color-primary rounded-full" />
                      Account Settings
                    </h3>
                  </div>

                  {updateSuccess && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-3xl flex items-center gap-3 font-bold text-sm">
                      <FaCheckCircle className="text-xl" /> Profile updated successfully!
                    </div>
                  )}

                  {updateError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-3xl flex items-center gap-3 font-bold text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500" /> {updateError}
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Username</label>
                        <div className="relative group">
                          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                          <input
                            type="text"
                            placeholder="username"
                            className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all shadow-sm"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Phone (WhatsApp)</label>
                        <div className="relative group">
                          <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                          <input
                            type="tel"
                            placeholder="e.g. 0765XXXXXX"
                            className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all shadow-sm"
                            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Email (Optional)</label>
                        <div className="relative group">
                          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                          <input
                            type="email"
                            placeholder="e.g. john@example.com"
                            className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all shadow-sm"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Update Password</label>
                        <div className="relative group">
                          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                          <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all shadow-sm"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-color-primary text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-color-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating Account...
                        </>
                      ) : 'Update Information'}
                    </button>

                    <Link to="/create-listing" className="w-full flex items-center justify-center gap-2 text-color-primary bg-color-primary/5 py-4 rounded-2xl font-black text-sm border-2 border-dashed border-color-primary/20 hover:bg-color-primary/10 transition-all mt-4">
                      <FaPlus size={12} /> Post New Listing
                    </Link>
                  </form>
                </section>
              )}

              {activeTab === 'listings' && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-color-primary rounded-full shadow-lg shadow-color-primary/30" />
                      Your Active Inventory
                    </h3>
                    <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-gray-500 flex items-center gap-2 w-fit">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {userListings.length} Listings
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {userListings.map((listing) => (
                      <div key={listing._id} className="bg-white rounded-[2rem] p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Image Container */}
                          <Link to={`/listing/${listing._id}`} className="w-full sm:w-48 h-40 flex-shrink-0 relative overflow-hidden rounded-2xl">
                            <img
                              src={listing.imageUrls?.[0] || "/favicon.svg"}
                              alt={listing.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                            />
                            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest italic">
                              {listing.category}
                            </div>
                          </Link>

                          {/* Content section */}
                          <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{listing.subCategory}</span>
                                <span className="text-sm font-black text-color-primary">UGX {listing.regularPrice.toLocaleString()}</span>
                              </div>
                              <Link to={`/listing/${listing._id}`}>
                                <h4 className="text-xl font-black text-gray-900 line-clamp-1 hover:text-color-primary transition-colors">{listing.name}</h4>
                              </Link>
                              <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{listing.description}</p>
                            </div>

                            {/* Engagement & Actions Row */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full" title="Total Views">
                                  <FaEye className="text-gray-400" size={14} />
                                  <p className="text-xs font-black text-gray-700">{listing.views || 0} <span className="text-[9px] font-bold text-gray-400 ml-0.5">Views</span></p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full" title="Contact Clicks">
                                  <FaCommentDots className="text-gray-400" size={12} />
                                  <p className="text-xs font-black text-gray-700">{listing.contactClicks || 0} <span className="text-[9px] font-bold text-gray-400 ml-0.5">Inquiries</span></p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/update-listing/${listing._id}`}
                                  className="p-3 bg-gray-50 text-gray-600 hover:bg-color-primary hover:text-white rounded-xl transition-all"
                                  title="Edit Listing"
                                >
                                  <FaEdit size={14} />
                                </Link>
                                <button
                                  onClick={() => handleListingDelete(listing._id)}
                                  className="p-3 bg-gray-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                  title="Delete Listing"
                                >
                                  <FaTrashAlt size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {userListings.length === 0 && (
                      <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaListUl className="text-gray-300 text-3xl" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No listings found</h4>
                        <p className="text-gray-500 text-sm mb-8">Start selling your agricultural products today!</p>
                        <Link to="/create-listing" className="inline-flex items-center gap-2 bg-color-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-color-primary/20 transition-all active:scale-95">
                          <FaPlus /> Create My First Listing
                        </Link>
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
