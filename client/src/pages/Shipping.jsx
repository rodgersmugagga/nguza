import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/cart/cartSlice';

export default function Shipping() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Uganda');
  const [phone, setPhone] = useState(shippingAddress.phone || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
    navigate('/payment');
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-lg w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Shipping & Delivery</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address / Location</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary transition-all"
              placeholder="e.g. Plot 12, Kampala Road"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">City / District</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary transition-all"
              placeholder="e.g. Kampala"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary transition-all"
              placeholder="e.g. 0771234567"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary transition-all"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 mt-6">
            Continue to Payment
          </button>
        </form>
      </div>
    </main>
  );
}
