import { useNavigate } from 'react-router-dom';

export default function Carousel({ items }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => navigate(`/product/${item._id}`)}
          className="min-w-[200px] h-32 bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        >
          <img src={item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
