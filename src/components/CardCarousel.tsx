import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface CarouselItem {
  id: string | number;
  image: string;
  title: string;
  description?: string;
}

interface CardCarouselProps {
  items: CarouselItem[];
}

const CardCarousel = ({ items }: CardCarouselProps) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation
      className="pb-12"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-gray)] overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold font-[var(--font-heading)] text-[var(--color-heading)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-[var(--color-body)] text-sm line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardCarousel;
