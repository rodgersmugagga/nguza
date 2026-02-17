import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function RegisterVendor() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    taxId: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('businessName', formData.businessName);
      fd.append('businessDescription', formData.businessDescription);
      fd.append('businessAddress', formData.businessAddress);
      fd.append('taxId', formData.taxId);
      if (file) {
        fd.append('businessLogo', file);
      }

      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/user/register-vendor`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser?.token || ''}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Update local storage/redux with updated user data
      // For now, redirect to profile or dashboard
      alert('Application submitted successfully! Your account is pending verification.');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <Helmet>
        <title>Register as Vendor | Nguza</title>
      </Helmet>
      <h1 className='text-3xl text-center font-semibold my-7'>Register as a Vendor</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Business Name'
          className='border p-3 rounded-lg'
          id='businessName'
          onChange={handleChange}
          required
        />
        <textarea
          placeholder='Business Description'
          className='border p-3 rounded-lg'
          id='businessDescription'
          onChange={handleChange}
          required
        />
        <input
          type='text'
          placeholder='Business Address'
          className='border p-3 rounded-lg'
          id='businessAddress'
          onChange={handleChange}
          required
        />
        <input
          type='text'
          placeholder='Tax ID (Optional)'
          className='border p-3 rounded-lg'
          id='taxId'
          onChange={handleChange}
        />
        <div>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Business Logo</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none'
          />
        </div>
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Submitting...' : 'Register as Vendor'}
        </button>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
