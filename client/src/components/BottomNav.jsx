import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaPlusCircle, FaHeart, FaUser, FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function BottomNav() {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaSearch, label: 'Search', path: '/search' },
    { icon: FaPlusCircle, label: 'Sell', path: currentUser?.user?.role === 'seller' ? '/add-product' : '/register-vendor', highlight: true },
    { icon: FaShoppingCart, label: 'Cart', path: '/cart', badge: cartItems.length },
    { icon: FaUser, label: 'Profile', path: currentUser ? '/profile' : '/sign-in' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${item.highlight
                  ? 'text-emerald-600'
                  : active ? 'text-emerald-700' : 'text-gray-400'
                }`}
            >
              <div className="relative">
                <Icon className={`${item.highlight ? 'text-2xl' : 'text-xl'} ${active && !item.highlight ? 'scale-110' : ''} transition-transform`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-400 text-emerald-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
