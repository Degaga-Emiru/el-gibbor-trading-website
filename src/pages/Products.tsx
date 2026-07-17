import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { productCategories as mockProducts, type Product } from '../data/products';
import { supabase } from '../lib/supabaseClient';

const Products = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Fetch products with their primary image from DB
        const { data: dbProds, error: prodErr } = await supabase
          .from('products')
          .select('*, categories(name), product_images(url)');

        if (prodErr) throw prodErr;

        if (dbProds && dbProds.length > 0) {
          const mappedProds: Product[] = dbProds.map((p) => {
            const images = p.product_images && p.product_images.length > 0
              ? p.product_images.map((img: any) => img.url)
              : ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'];
            
            return {
              id: p.id,
              category: p.categories?.name || 'Uncategorized',
              name: p.name,
              description: p.description || '',
              images: images,
              features: p.is_featured ? ['Featured Item'] : []
            };
          });

          // Mix/Append dynamically added items with mock items (ensuring no duplicates)
          const combined = [...mappedProds, ...mockProducts];
          setProducts(combined);

          // Get unique categories list
          const uniqueCats = ['All', ...Array.from(new Set(combined.map(p => p.category)))];
          setCategories(uniqueCats);
        } else {
          // Fallback to mock data if DB is empty
          setProducts(mockProducts);
          setCategories(['All', ...mockProducts.map(p => p.category)]);
        }
      } catch (err) {
        console.error('Error fetching Supabase products catalog:', err);
        setProducts(mockProducts);
        setCategories(['All', ...mockProducts.map(p => p.category)]);
      }
    };

    fetchCatalog();
  }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col w-full" id="products">
      {!hideHeader && (
        <PageHeader
          title="Our Products"
          breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Products' }]}
        />
      )}

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Premium Product Catalog" subtitle="Explore Our Offerings" />

          {/* Category Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 scale-105'
                    : 'bg-white text-[var(--color-body)] border border-[var(--color-border-gray)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filtered.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border-gray)] hover:shadow-2xl transition-all duration-500 group flex flex-col"
                >
                  <div className="h-56 overflow-hidden relative">
                    <ProductImageCarousel images={product.images} alt={product.name} intervalMs={2000} />
                    <div className="absolute top-4 left-4 bg-[var(--color-primary)]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg text-[var(--color-heading)] mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[var(--color-body)] text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-900 transition-all duration-300 shadow-sm hover:shadow-md group-hover:gap-3 justify-center"
                    >
                      View More <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Products;
