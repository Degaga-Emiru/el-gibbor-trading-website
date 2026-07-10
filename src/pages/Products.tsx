import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { productCategories } from '../data/products';

const allCategories = ['All', ...productCategories.map((p) => p.category)];

const Products = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? productCategories
      : productCategories.filter((p) => p.category === activeCategory);

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
            {allCategories.map((cat) => (
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
                  {/* Auto-scrolling image carousel — 2 second interval */}
                  <div className="h-56 overflow-hidden relative">
                    <ProductImageCarousel images={product.images} alt={product.name} intervalMs={2000} />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-[var(--color-primary)]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
                      {product.category}
                    </div>
                  </div>

                  {/* Card content */}
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

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-white rounded-2xl border border-[var(--color-border-gray)] p-10 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-[var(--color-heading)] mb-4 font-[var(--font-heading)]">
              Looking for Something Specific?
            </h3>
            <p className="text-[var(--color-body)] max-w-2xl mx-auto mb-8 leading-relaxed">
              We can source and import a wide variety of products beyond what's listed here. Contact us with your requirements and we'll find a tailored solution.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[var(--color-premium)] hover:bg-yellow-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Request a Quote <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;
