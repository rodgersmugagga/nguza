import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ product }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const userId = product?.userRef;
        if (!userId) return;
        const apiBase = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiBase}/api/user/${userId}`);
        const data = await res.json();
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [product]);

  if (!owner) return null;

  const mailLink = `mailto:${(product?.sellerEmail) || owner.email}?subject=Inquiry: ${product?.name}&body=${encodeURIComponent(message)}`;

  return (
    <div className='flex flex-col gap-2 mt-4'>
      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
        Contact <span className='text-white'>{owner.username}</span> about <span className='text-white'>{product?.name}</span>
      </p>
      <textarea
        name='message'
        id='message'
        rows='2'
        value={message}
        onChange={onChange}
        placeholder={`Hi ${owner.username}, I'm interested in your ${product?.name?.toLowerCase()}...`}
        className='w-full border border-white/20 p-3 rounded-xl bg-white/5 text-white placeholder-gray-500 font-medium text-sm outline-none focus:border-emerald-500 transition-all'
      ></textarea>

      <Link
        to={mailLink}
        className='bg-emerald-600 text-white text-center p-3 uppercase rounded-xl font-black text-xs hover:bg-emerald-500 transition-all shadow-lg'
      >
        Send Inquiry
      </Link>
    </div>
  );
}
