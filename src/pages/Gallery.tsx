import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const galleryItems = [
  { id: 1, category: 'Tyres', src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800', alt: 'Commercial Truck Tyres' },
  { id: 2, category: 'Tyres', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800', alt: 'High Performance Tyres' },
  { id: 3, category: 'Tyres', src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800', alt: 'Passenger Tyres' },
  { id: 4, category: 'Tyres', src: 'https://images.unsplash.com/photo-1600705646194-e3c35b8429b9?q=80&w=800', alt: 'OTR Tyres' },
  { id: 5, category: 'Vehicles', src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800', alt: 'Commercial Trucks' },
  { id: 6, category: 'Vehicles', src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800', alt: 'SUV Fleet' },
  { id: 7, category: 'Vehicles', src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800', alt: 'Passenger Vehicles' },
  { id: 8, category: 'Spare Parts', src: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?q=80&w=800', alt: 'Brake Systems' },
  { id: 9, category: 'Spare Parts', src: 'https://images.unsplash.com/photo-1486262715619-6708146bc9a5?q=80&w=800', alt: 'Engine Parts' },
  { id: 10, category: 'Spare Parts', src: 'https://images.unsplash.com/photo-1606167668511-22c51466d311?q=80&w=800', alt: 'Lubricants' },
  { id: 11, category: 'Office', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800', alt: 'Office Interior' },
  { id: 12, category: 'Office', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800', alt: 'Company Building' },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const categories = ['All', 'Tyres', 'Vehicles', 'Spare Parts', 'Office'];

  const filtered = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(i => i.category === activeCategory);

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Gallery"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Gallery' }]}
      />

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Photo Gallery" subtitle="Our Work in Pictures" />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-md scale-105'
                    : 'bg-white text-[var(--color-body)] border border-[var(--color-border-gray)] hover:border-[var(--color-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid relative overflow-hidden rounded-xl group cursor-pointer shadow-sm border border-[var(--color-border-gray)]"
                  onClick={() => setLightboxSrc(item.src.replace('w=800', 'w=1600'))}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/60 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={36} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.alt}</p>
                    <span className="text-[var(--color-premium)] text-xs">{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightboxSrc}
              alt="Gallery Preview"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              onClick={() => setLightboxSrc(null)}
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
