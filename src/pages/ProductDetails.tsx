import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, CheckCircle, ZoomIn, MessageSquare, Play } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { productCategories, type Product } from '../data/products';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';

export interface ProductDetailType extends Product {
  videos?: string[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // First attempt: fetch from Supabase
        const { data: dbProd, error } = await supabase
          .from('products')
          .select('*, categories(name, slug), product_images(url), product_videos(url)')
          .eq('id', id)
          .single();

        if (!error && dbProd) {
          const images = dbProd.product_images && dbProd.product_images.length > 0
            ? dbProd.product_images.map((img: any) => img.url)
            : ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'];

          const videos = dbProd.product_videos && dbProd.product_videos.length > 0
            ? dbProd.product_videos.map((vid: any) => vid.url)
            : [];

          setProduct({
            id: dbProd.id,
            name: dbProd.name,
            category: dbProd.categories?.name || 'General Product',
            description: dbProd.description || '',
            images: images,
            videos: videos,
            features: dbProd.is_featured ? ['Featured Product'] : ['High Quality Standard'],
          });
        } else {
          // Fallback attempt: look in static products
          const mock = productCategories.find((p) => p.id === id);
          if (mock) {
            setProduct({ ...mock, videos: [] });
          } else {
            setProduct(null);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        const mock = productCategories.find((p) => p.id === id);
        if (mock) {
          setProduct({ ...mock, videos: [] });
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null || !product) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIdx((i) => ((i ?? 0) + 1) % product.images.length);
      if (e.key === 'ArrowLeft')  setLightboxIdx((i) => ((i ?? 0) - 1 + product.images.length) % product.images.length);
      if (e.key === 'Escape')     setLightboxIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, product]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The requested product could not be located in our catalog.</p>
        <button
          onClick={() => navigate('/#products')}
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:bg-blue-900 transition-all"
        >
          <ArrowLeft size={18} /> Back to Products Catalog
        </button>
      </div>
    );
  }

  const hasVideo = product.videos && product.videos.length > 0;

  return (
    <div className="flex flex-col w-full bg-[var(--color-background)] min-h-screen">
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/#products' },
          { name: product.category },
        ]}
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── Left: Image & Video Gallery ── */}
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl border border-[var(--color-border-gray)] shadow-sm space-y-6"
              >
                {/* Main Hero Image */}
                <div
                  className="relative rounded-xl overflow-hidden aspect-video cursor-zoom-in group"
                  onClick={() => setLightboxIdx(0)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={36} />
                  </div>
                  <div className="absolute top-4 left-4 bg-[var(--color-primary)]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {product.category}
                  </div>
                </div>

                {/* Optional Product Video Section */}
                {hasVideo && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-2 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 px-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Play size={14} className="fill-amber-400" />
                      <span>Product Video Showcase</span>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <video
                        src={product.videos![0]}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Thumbnail grid */}
                {product.images.length > 1 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Product Media Gallery</h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {product.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`aspect-square rounded-xl overflow-hidden bg-gray-100 border transition-all cursor-zoom-in group ${
                            idx === 0 ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20' : 'border-gray-200 hover:border-[var(--color-primary)]'
                          }`}
                          onClick={() => setLightboxIdx(idx)}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Related / Other products catalog */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-white rounded-2xl border border-[var(--color-border-gray)] shadow-sm p-6"
              >
                <h3 className="font-bold text-[var(--color-heading)] mb-4 text-lg">Browse Product Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {productCategories.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-background)] border border-[var(--color-border-gray)] text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
                    >
                      {p.category}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Right: Product Specs & Contact Actions ── */}
            <div className="lg:w-2/5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl border border-[var(--color-border-gray)] shadow-sm sticky top-28"
              >
                <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  {product.category}
                </div>
                <h2 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-heading)] mb-4 leading-tight">
                  {product.name}
                </h2>
                <div className="w-12 h-1 bg-[var(--color-premium)] mb-6" />
                <p className="text-[var(--color-body)] text-base leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Highlights / Features */}
                {product.features && (
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <CheckCircle className="text-[var(--color-premium)] shrink-0" size={18} />
                        <span className="text-[var(--color-heading)] font-medium text-sm">{f}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-[var(--color-premium)] shrink-0" size={18} />
                      <span className="text-[var(--color-heading)] font-medium text-sm">Authentic &amp; High Quality Standard</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-[var(--color-premium)] shrink-0" size={18} />
                      <span className="text-[var(--color-heading)] font-medium text-sm">Direct Manufacturer Import</span>
                    </li>
                  </ul>
                )}

                {/* Direct Product Inquiry Button */}
                <div className="space-y-3 mb-8">
                  <Link
                    to={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="w-full bg-[var(--color-primary)] hover:bg-blue-900 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                  >
                    <MessageSquare size={20} />
                    <span>Contact Us for this Product</span>
                  </Link>
                </div>

                {/* Direct Contact Phone & Mail box */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
                  <h3 className="font-bold text-[var(--color-heading)] mb-4">Direct Sales Hotline</h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href="tel:+251911684013"
                      className="flex items-center gap-3 text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Phone size={18} className="text-[var(--color-primary)]" />
                      </div>
                      <span className="font-medium">+251 911 68 40 13</span>
                    </a>
                    <a
                      href="mailto:elgibbor280@gmail.com"
                      className="flex items-center gap-3 text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Mail size={18} className="text-[var(--color-primary)]" />
                      </div>
                      <span className="font-medium">elgibbor280@gmail.com</span>
                    </a>
                  </div>
                </div>

                <Link
                  to="/#products"
                  className="w-full bg-transparent border border-[var(--color-border-gray)] text-[var(--color-body)] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <ArrowLeft size={16} /> Back to Products Catalog
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={product.images[lightboxIdx]}
              alt={`${product.name} ${lightboxIdx + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Prev / Next */}
            {product.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition-colors text-2xl"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + product.images.length) % product.images.length); }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition-colors text-2xl"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % product.images.length); }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-colors"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white text-sm px-4 py-1.5 rounded-full">
              {lightboxIdx + 1} / {product.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
