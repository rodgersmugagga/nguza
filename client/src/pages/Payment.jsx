import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/cart/cartSlice';

export default function Payment() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    window.location.href = '/shipping';
  }

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] py-12 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-lg w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Payment Method</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <legend className="text-sm font-bold text-gray-500 mb-4 block">Select Payment Method</legend>

          <div className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'Cash on Delivery' ? 'border-color-primary bg-color-primary/5' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
            <input
              type="radio"
              id="COD"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-color-primary w-5 h-5"
            />
            <label htmlFor="COD" className="font-bold text-gray-900 cursor-pointer flex-1">Cash on Delivery</label>
          </div>

          <div className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'Mobile Money' ? 'border-color-primary bg-color-primary/5' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setPaymentMethod('Mobile Money')}>
            <input
              type="radio"
              id="MobileMoney"
              name="paymentMethod"
              value="Mobile Money"
              checked={paymentMethod === 'Mobile Money'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-color-primary w-5 h-5"
            />
            <label htmlFor="MobileMoney" className="font-bold text-gray-900 cursor-pointer flex-1">Mobile Money (MTN/Airtel)</label>
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 mt-6">
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
