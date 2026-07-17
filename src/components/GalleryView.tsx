import { useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Sparkles, X } from 'lucide-react';
import { InstagramPost } from '../types';
import { resolveCakeImage } from '../utils';

interface GalleryViewProps {
  posts: InstagramPost[];
}

export default function GalleryView({ posts }: GalleryViewProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;
  const selectedImages = selectedPost?.images?.length
    ? selectedPost.images
    : selectedPost ? [selectedPost.imageUrl] : [];
  const displayCaption = (caption: string) => caption.includes('(Edit this caption') ? 'Cakeasy creation from our photo gallery.' : caption;

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
    <div className="space-y-10 pb-20 animate-fadeIn">
      <header className="bg-[#FFF5F8] rounded-[32px] p-8 sm:p-12 border border-[#F6B8C8]/20 text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] flex items-center justify-center gap-1">
          <Sparkles className="h-4 w-4" /> Cakeasy journey
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#1E1E1E]">Cake gallery</h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Explore Cakeasy creations from the beginning to today. Select a photo to see every available angle.
        </p>
      </header>

      <div className="columns-1 md:columns-3 gap-6 space-y-6">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => openPost(post.id)}
            className="break-inside-avoid block w-full text-left bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="relative overflow-hidden bg-gray-50">
              <img
                src={resolveCakeImage(post.imageUrl)}
                alt={displayCaption(post.caption) || 'Cakeasy cake creation'}
                className="w-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              {post.images?.length > 1 && (
                <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Images className="h-3 w-3" /> {post.images.length}
                </span>
              )}
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-gray-500 font-semibold">{post.date}</p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 font-sans">{displayCaption(post.caption)}</p>
              <span className="block pt-2 border-t border-gray-50 text-[10px] uppercase font-bold text-[#D63384]">View cake</span>
            </div>
          </button>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Cake photo detail">
          <div className="bg-white rounded-[32px] overflow-hidden max-w-4xl w-full border border-[#FFF5F8] grid grid-cols-1 md:grid-cols-2 shadow-2xl max-h-[90vh]">
            <div className="bg-neutral-900 relative flex items-center justify-center aspect-square md:h-full">
              <img
                src={resolveCakeImage(selectedImages[activeImageIndex])}
                alt={displayCaption(selectedPost.caption) || 'Cakeasy cake creation'}
                className="max-h-[50vh] md:max-h-[80vh] w-full object-cover"
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

            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E]">Cakeasy</h2>
                  <p className="text-[10px] text-[#D63384] font-semibold uppercase tracking-wider">Cake creation</p>
                </div>
                <button type="button" onClick={() => setSelectedPostId(null)} aria-label="Close photo detail" className="h-10 w-10 bg-neutral-100 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-full flex items-center justify-center transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="bg-[#FFF5F8]/40 p-4 rounded-2xl border border-pink-50/50">
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{displayCaption(selectedPost.caption)}</p>
              </div>
              <p className="text-xs text-gray-400 font-medium">{selectedPost.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
