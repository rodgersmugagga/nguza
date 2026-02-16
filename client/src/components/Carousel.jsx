import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import LazyImage from './LazyImage.jsx';

export default function Carousel({ items = [] }){
  const navigate = useNavigate();
  SwiperCore.use([Navigation, Autoplay, EffectCoverflow]);
  
  const handleCardClick = (itemId) => {
    navigate(`/listing/${itemId}`);
  };
  
  return (
    <div className="w-full py-4">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        loopAdditionalSlides={3}
        speed={800}
        autoplay={{ delay: 6000, disableOnInteraction: true }}
        navigation={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          640: { slidesPerView: 1.8, spaceBetween: 15 },
          1024: { slidesPerView: 2.5, spaceBetween: 20 },
        }}
        className="px-2 sm:px-4"
      >
        {items.map(item => (
          <SwiperSlide key={item._id || item.id} style={{ width: '280px' }}>
            {({ isActive }) => (
              <div 
                onClick={() => handleCardClick(item._id || item.id)}
                className={`relative h-60 rounded-3xl overflow-hidden shadow-lg transition-all duration-700 cursor-pointer active:scale-95 ${isActive ? 'shadow-2xl scale-110 ring-4 ring-color-primary/50' : 'shadow-md scale-100 hover:scale-105 hover:shadow-xl'}`}>
                {/* Image with gradient overlay */}
                <LazyImage src={item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Featured badge */}
                {item.isFeatured && (
                  <div className="absolute top-2 right-2 badge-accent px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    ✨ Featured
                  </div>
                )}
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-gray-200 line-clamp-1 mt-1">{item.description || item.category}</p>
                  <p className="text-lg font-bold text-price mt-2">UGX {((item.offer && item.discountedPrice) || item.regularPrice)?.toLocaleString()}</p>
                  
                  {/* Discount badge */}
                  {item.offer && (
                    <div className="inline-block mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      Save UGX {(item.regularPrice - item.discountedPrice)?.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
