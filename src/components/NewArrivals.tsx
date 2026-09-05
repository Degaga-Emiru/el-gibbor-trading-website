import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SectionHeading from './SectionHeading';
import ProductCardMedia from './ProductCardMedia';
import { productCategories as mockProducts, type Product } from '../data/products';

export interface ExtendedProduct extends Product {
  videos?: string[];
  isNewArrival?: boolean;
}


const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Fetch products that are flagged as new arrival OR top 8 newest created products
        const { data: dbProds, error } = await supabase
          .from('products')
          .select('*, categories(name), product_images(url), product_videos(url)')
          .or('is_new_arrival.eq.true,status.eq.published')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        if (dbProds && dbProds.length > 0) {
          const mapped: ExtendedProduct[] = dbProds.map((p) => {
            const images = p.product_images && p.product_images.length > 0
              ? p.product_images.map((img: any) => img.url)
              : ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'];

            const videos = p.product_videos && p.product_videos.length > 0
              ? p.product_videos.map((vid: any) => vid.url)
              : [];

            return {
              id: p.id,
              category: p.categories?.name || 'New Product',
              name: p.name,
              description: p.description || '',
              images: images,
              videos: videos,
              features: p.is_featured ? ['Featured'] : [],
              isNewArrival: p.is_new_arrival,
            };
          });

          // Filter for explicit new arrivals or take the newest items
          const filtered = mapped.filter((p) => p.isNewArrival).length > 0
            ? mapped.filter((p) => p.isNewArrival)
            : mapped;

          setNewArrivals(filtered);
        } else {
          // Fallback to mock products marked new or first 4 mock items
          const fallback = mockProducts.slice(0, 4).map((p) => ({
            ...p,
            videos: [],
            isNewArrival: true,
          }));
          setNewArrivals(fallback);
        }
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
        const fallback = mockProducts.slice(0, 4).map((p) => ({
          ...p,
          videos: [],
          isNewArrival: true,
        }));
        setNewArrivals(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (!loading && newArrivals.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="new-arrivals">
      {/* Subtle glowing background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3 text-amber-400 font-semibold text-sm tracking-wider uppercase">
          <Sparkles size={18} />
          <span>Fresh Arrivals</span>
        </div>

        <SectionHeading
          title="Our New Arrivals"
          subtitle="Explore the latest additions to our premium import & export inventory"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800/60 rounded-2xl h-96 animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {newArrivals.map((product, idx) => {
              return (

                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/60 hover:border-amber-500/50 transition-all duration-500 shadow-xl flex flex-col group"
                >
                  {/* Media Header (All Videos & All Images) */}
                  <div className="h-60 overflow-hidden relative bg-black">
                    <ProductCardMedia
                      images={product.images}
                      videos={product.videos}
                      alt={product.name}
                    />

                    <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20 pointer-events-none">
                      {product.category}
                    </div>

                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-20 pointer-events-none flex items-center gap-1">
                      <Sparkles size={11} /> New
                    </div>
                  </div>


                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/60 mt-auto">
                      <Link
                        to={`/product/${product.id}`}
                        className="w-full bg-[var(--color-primary)] hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        View Details <ArrowRight size={16} />
                      </Link>
                      <Link
                        to={`/contact?product=${encodeURIComponent(product.name)}`}
                        className="w-full bg-slate-700/70 hover:bg-slate-700 text-amber-300 border border-slate-600 hover:border-amber-400 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={16} /> Contact Us for this Product
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
