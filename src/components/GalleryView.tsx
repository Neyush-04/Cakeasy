import { useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Instagram, MapPin, Sparkles, X } from 'lucide-react';
import { InstagramPost } from '../types';
import { resolveCakeImage } from '../utils';

interface GalleryViewProps {
  posts: InstagramPost[];
}

const storyChapters = [
  {
    year: '2021',
    place: 'Lucknow',
    title: 'The first home-baked orders',
    text: 'Cakeasy began with Neha Chaudhary baking for close circles in Lucknow, learning what people remembered most: flavour, finish, and the emotion of a cake made for them.',
  },
  {
    year: '2022-2023',
    place: 'Lucknow',
    title: 'A style starts forming',
    text: 'The designs became more personal: birthday themes, character cakes, florals, tiers, and tiny details that made each order feel like a story.',
  },
  {
    year: '2024-2025',
    place: 'Delhi NCR',
    title: 'The move toward Delhi',
    text: 'The journey grew from Lucknow toward Delhi NCR, carrying the same home-baker warmth into bigger celebrations and more polished custom work.',
  },
  {
    year: 'Now',
    place: 'Greater Noida',
    title: 'Cakeasy in Gr. Noida',
    text: 'Today Cakeasy serves from Greater Noida, with WhatsApp as the direct ordering desk and Instagram as the running archive of cakes, people, and milestones.',
  },
];

const galleryFilters = ['all', 'wedding', 'designer', 'engagement', 'anniversary', 'birthday', 'bento', 'cupcakes'];
const galleryCategoryById: Record<string, string> = {
  'ig-1': 'birthday', 'ig-2': 'designer', 'ig-3': 'designer', 'ig-4': 'birthday', 'ig-5': 'anniversary', 'ig-6': 'birthday', 'ig-7': 'designer',
  'ig-8': 'wedding', 'ig-9': 'engagement', 'ig-10': 'anniversary', 'ig-11': 'designer', 'ig-12': 'anniversary', 'ig-13': 'designer', 'ig-14': 'designer',
  'ig-15': 'designer', 'ig-16': 'designer', 'ig-17': 'designer', 'ig-18': 'anniversary', 'ig-19': 'designer', 'ig-20': 'wedding', 'ig-21': 'birthday',
  'ig-22': 'birthday', 'ig-23': 'anniversary', 'ig-24': 'anniversary', 'ig-25': 'anniversary', 'ig-26': 'designer', 'ig-27': 'birthday', 'ig-28': 'birthday',
  'ig-29': 'designer', 'ig-30': 'designer',
};

export default function GalleryView({ posts }: GalleryViewProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;
  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((post) => (galleryCategoryById[post.id] ?? 'designer') === activeFilter);
  const selectedImages = selectedPost?.images?.length
    ? selectedPost.images
    : selectedPost ? [selectedPost.imageUrl] : [];

  const openPost = (id: string) => {
    setActiveImageIndex(0);
    setSelectedPostId(id);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((index) => (index - 1 + selectedImages.length) % selectedImages.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((index) => (index + 1) % selectedImages.length);
  };

  return (
    <div className="space-y-12 pb-20 animate-fadeIn">
      <header className="bg-[#FFF5F8] rounded-[32px] p-8 sm:p-12 border border-[#F6B8C8]/20 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] flex items-center justify-center gap-1">
            <Instagram className="h-4 w-4" /> Instagram archive
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#1E1E1E]">Cakeasy from Lucknow to Delhi NCR</h1>
          <p className="text-gray-500 text-sm max-w-3xl mx-auto">
            A visual journey of Neha Chaudhary's cakes: the early home-baker days, themed celebration work, and the move into Greater Noida. Multi-photo posts open like a product catalogue, with every pose available below the main image.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {storyChapters.map((chapter) => (
            <div key={chapter.year} className="bg-white/80 border border-pink-50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xl font-bold text-[#D63384]">{chapter.year}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {chapter.place}
                </span>
              </div>
              <h2 className="font-serif font-bold text-sm text-[#1E1E1E]">{chapter.title}</h2>
              <p className="text-xs text-gray-500 leading-relaxed">{chapter.text}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D63384]">All gallery photos</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">The Cakeasy archive</h2>
          </div>
          <p className="text-xs text-gray-500 max-w-md">Real Cakeasy work, curated by the kind of celebration it was designed for. Open any set to see the available poses.</p>
        </div>

        <div className="flex flex-wrap gap-2 border-y border-[#EDE3E2] py-4">
          {galleryFilters.map((filter) => (
            <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition ${activeFilter === filter ? 'bg-[#251B21] text-white' : 'border border-[#EDE3E2] bg-white text-[#6D6265] hover:border-[#D8B4B7] hover:text-[#D63384]'}`}>
              {filter === 'all' ? 'All work' : filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => openPost(post.id)}
              className="block w-full text-left bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative aspect-square overflow-hidden bg-[#FFF5F8]/45">
                <img
                  src={resolveCakeImage(post.imageUrl)}
                  alt={post.caption || 'Cakeasy cake creation'}
                  className="w-full h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                {post.images?.length > 1 && (
                  <span className="absolute top-3 right-3 bg-black/55 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Images className="h-3 w-3" /> {post.images.length} poses
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3"><p className="text-xs text-gray-500 font-semibold">{post.date}</p><span className="text-[9px] font-bold uppercase tracking-wider text-[#D63384]">{galleryCategoryById[post.id] ?? 'designer'}</span></div>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 font-sans">{post.caption}</p>
                <span className="block pt-2 border-t border-gray-50 text-[10px] uppercase font-bold text-[#D63384]">Open gallery set</span>
              </div>
            </button>
          ))}
        </div>
        {filteredPosts.length === 0 && <div className="rounded-3xl border border-dashed border-[#D8B4B7] bg-[#FFF7FA] p-12 text-center text-sm text-gray-500">No curated work is tagged here yet. Start a consultation and Cakeasy can design something specifically for your occasion.</div>}
      </section>

      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Cake photo detail">
          <div className="bg-white rounded-[32px] overflow-hidden max-w-5xl w-full border border-[#FFF5F8] grid grid-cols-1 md:grid-cols-2 shadow-2xl max-h-[90vh]">
            <div className="bg-neutral-950 relative flex flex-col justify-center gap-3 p-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900">
                <img
                  src={resolveCakeImage(selectedImages[activeImageIndex])}
                  alt={selectedPost.caption || 'Cakeasy cake creation'}
                  className="h-full w-full object-contain"
                />
                {selectedImages.length > 1 && (
                  <>
                    <button type="button" onClick={showPreviousImage} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={showNextImage} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {selectedImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {selectedImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === index ? 'border-[#F6B8C8]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View pose ${index + 1}`}
                    >
                      <img src={resolveCakeImage(image)} alt="" className="h-full w-full object-contain bg-neutral-900" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E]">Cakeasy by Neha Chaudhary</h2>
                  <p className="text-[10px] text-[#D63384] font-semibold uppercase tracking-wider">Instagram archive set</p>
                </div>
                <button type="button" onClick={() => setSelectedPostId(null)} aria-label="Close photo detail" className="h-10 w-10 bg-neutral-100 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-full flex items-center justify-center transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="bg-[#FFF5F8]/40 p-4 rounded-2xl border border-pink-50/50">
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{selectedPost.caption}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-4 text-xs text-gray-400 font-medium">
                <span>{selectedPost.date}</span>
                <span className="inline-flex items-center gap-1 text-[#D63384] font-bold">
                  <Sparkles className="h-3.5 w-3.5" /> {selectedImages.length} photo{selectedImages.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
