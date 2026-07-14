import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Info, Video } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';

/**
 * HOW TO ADD YOUR VIDEOS:
 * 1. Upload your videos to YouTube or Vimeo.
 * 2. Copy the YouTube Video ID from the URL.
 *    e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → ID is "dQw4w9WgXcQ"
 * 3. Paste the ID in the `youtubeId` field below.
 * 4. Change the `title` and `category` as needed.
 * 5. Replace the `thumbnail` with your actual thumbnail URL if desired.
 */
const videos = [
  {
    id: 1,
    title: 'Company Introduction',
    category: 'Company',
    youtubeId: '',  // ← Paste your YouTube video ID here
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 2,
    title: 'Premium Tyre Showcase',
    category: 'Products',
    youtubeId: '',
    thumbnail: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 3,
    title: 'Import & Export Process',
    category: 'Services',
    youtubeId: '',
    thumbnail: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 4,
    title: 'Client Testimonial',
    category: 'Testimonials',
    youtubeId: '',
    thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 5,
    title: 'Warehouse & Logistics Tour',
    category: 'Company',
    youtubeId: '',
    thumbnail: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 6,
    title: 'Spare Parts Demonstration',
    category: 'Products',
    youtubeId: '',
    thumbnail: 'https://images.unsplash.com/photo-1486262715619-6708146bc9a5?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 7,
    title: 'Sound System Setup',
    category: 'Sound Systems',
    youtubeId: '',
    localUrl: '/videos/sound-system.MP4',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 8,
    title: 'Sound System Demo',
    category: 'Sound Systems',
    youtubeId: '',
    localUrl: '/videos/sound-system1.MP4',
    thumbnail: 'https://images.unsplash.com/photo-1496369131669-e77144e59002?q=80&w=800',
    duration: '0:00'
  },
  {
    id: 9,
    title: 'Tyres Showcase',
    category: 'Products',
    youtubeId: '',
    localUrl: '/videos/tyres-videos.MP4',
    thumbnail: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800',
    duration: '0:00'
  },
];

const categories = ['All', 'Company', 'Products', 'Services', 'Sound Systems', 'Testimonials'];

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [playing, setPlaying] = useState<typeof videos[0] | null>(null);

  const filtered =
    activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);

  return (
    <div className="flex flex-col w-full">
      <PageHeader title="Videos" breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Videos' }]} />

      {/* Info notice */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-4">
        <div className="container mx-auto px-4 flex items-start gap-3">
          <Info size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-yellow-700 text-sm">
            <strong>To add your videos:</strong> Upload to YouTube, copy the Video ID from the URL, and paste it in the <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">youtubeId</code> field in <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">src/pages/Videos.tsx</code>.
          </p>
        </div>
      </div>

      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <SectionHeading title="Video Gallery" subtitle="Watch & Learn" />

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

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border-gray)] group hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setPlaying(video)}
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-gray-800">
                  <img
                    src={
                      video.youtubeId
                        ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                        : video.thumbnail
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 hover:bg-[var(--color-premium)] rounded-full flex items-center justify-center transition-colors shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={26} className="text-[var(--color-primary)] group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-[var(--color-premium)]/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {video.category}
                  </div>
                  {/* No video notice */}
                  {!video.youtubeId && !video.localUrl && (
                    <div className="absolute bottom-3 left-3 bg-black/60 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Video size={12} /> Add Video URL
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-[var(--color-body)] mt-1">{video.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setPlaying(null)}
                className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* YouTube Embed or Placeholder */}
              <div className="aspect-video">
                {playing.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                    title={playing.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : playing.localUrl ? (
                  <video
                    src={playing.localUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-center p-8 gap-4">
                    <Video size={60} className="text-red-500" />
                    <div>
                      <p className="text-white text-xl font-bold mb-2">{playing.title}</p>
                      <p className="text-gray-400 text-sm max-w-md">
                        No YouTube video linked yet. Open{' '}
                        <code className="bg-gray-800 px-2 py-0.5 rounded text-yellow-300">src/pages/Videos.tsx</code>{' '}
                        and paste your YouTube Video ID in the <code className="bg-gray-800 px-2 py-0.5 rounded text-yellow-300">youtubeId</code> field for this entry.
                      </p>
                    </div>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Upload to YouTube First
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;
