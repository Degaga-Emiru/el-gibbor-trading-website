import { motion } from 'framer-motion';
import { ArrowRight, Search, Filter } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

const Products = () => {
  const products = [
    { id: 1, category: 'Tyres', name: 'Commercial Truck Tyres', desc: 'Heavy-duty tyres for long hauls.', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, category: 'Tyres', name: 'Passenger Car Tyres', desc: 'All-season reliability and comfort.', img: 'https://images.unsplash.com/photo-1600705646194-e3c35b8429b9?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, category: 'Spare Parts', name: 'Brake Pads & Rotors', desc: 'High-performance braking systems.', img: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, category: 'Spare Parts', name: 'Engine Components', desc: 'OEM quality engine replacements.', img: 'https://images.unsplash.com/photo-1486262715619-6708146bc9a5?q=80&w=1000&auto=format&fit=crop' },
    { id: 5, category: 'Lubricants', name: 'Synthetic Motor Oil', desc: 'Advanced wear protection.', img: 'https://images.unsplash.com/photo-1606167668511-22c51466d311?q=80&w=1000&auto=format&fit=crop' },
    { id: 6, category: 'Lubricants', name: 'Industrial Grease', desc: 'Heavy machinery lubrication.', img: 'https://images.unsplash.com/photo-1621213459247-f4e914040db4?q=80&w=1000&auto=format&fit=crop' },
  ];

  const categories = ['All', 'Tyres', 'Spare Parts', 'Lubricants', 'Vehicles'];

  return (
    <div className="flex flex-col w-full">
      <PageHeader 
        title="Our Products" 
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Products' }]} 
      />

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Premium Automotive Solutions" subtitle="Explore Our Catalog" />
          
          <div className="flex flex-col md:flex-row gap-8 mt-12">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4">
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-border-gray)] shadow-sm sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg font-[var(--font-heading)]">Categories</h3>
                  <Filter size={18} className="text-gray-400" />
                </div>
                <div className="space-y-3">
                  {categories.map((cat, idx) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        defaultChecked={idx === 0}
                        className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300" 
                      />
                      <span className="text-[var(--color-body)] group-hover:text-[var(--color-primary)] transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-border-gray)]">
                  <h3 className="font-bold text-lg font-[var(--font-heading)] mb-4">Search</h3>
                  <div className="relative">
                    <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[var(--color-primary)]" />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden border border-[var(--color-border-gray)] hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-primary)]">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="font-bold text-lg text-[var(--color-heading)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h4>
                      <p className="text-[var(--color-body)] text-sm mb-6 flex-grow">{product.desc}</p>
                      <button className="flex items-center gap-2 text-[var(--color-premium)] font-semibold text-sm group-hover:gap-3 transition-all">
                        View Details <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-12 gap-2">
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-primary)] text-white font-medium">1</button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-[var(--color-border-gray)] text-[var(--color-heading)] hover:bg-gray-50 transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-[var(--color-border-gray)] text-[var(--color-heading)] hover:bg-gray-50 transition-colors">3</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
