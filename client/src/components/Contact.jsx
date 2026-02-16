import { useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function Contact({ listing }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      const userId = listing?.userRef;
      if (!userId) return;

      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/user/${userId}`);
        const data = await res.json();
        setOwner(data);
      } catch (err) {
        console.error("Owner fetch error:", err.message);
      }
    };

    fetchOwner();
  }, [listing]);

  if (!owner) return null;

  const mailLink = `mailto:${(listing?.sellerEmail) || owner.email}?subject=Inquiry: ${listing?.name}&body=${encodeURIComponent(message)}`;

  return (
    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 mt-2">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Inquiry Message
        </p>

        <textarea
          placeholder={`Hi ${owner.username}, I'm interested in your ${listing?.name?.toLowerCase()}...`}
          className="w-full bg-white border border-gray-200 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none transition-all resize-none font-medium text-gray-700"
          id="message"
          rows="3"
          onChange={onChange}
          value={message}
        />

        <a
          href={mailLink}
          className="w-full flex items-center justify-center gap-2 bg-color-primary text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-color-primary/20 transition-all active:scale-95"
        >
          <FaEnvelope /> Send Inquiry via Email
        </a>

        <p className="text-[10px] text-gray-400 text-center font-medium">
          The seller will receive your message in their inbox.
        </p>
      </div>
    </div>
  );
}

