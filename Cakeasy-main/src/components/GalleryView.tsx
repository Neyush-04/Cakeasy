import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, X, Send, Sparkles, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { InstagramPost } from '../types';
import { resolveCakeImage } from '../utils';

interface GalleryViewProps {
  posts: InstagramPost[];
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, comment: { username: string; text: string }) => void;
}

export default function GalleryView({ posts, onLikePost, onAddComment }: GalleryViewProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedPost = posts.find(p => p.id === selectedPostId) || null;
  const selectedImages = selectedPost?.images && selectedPost.images.length > 0
    ? selectedPost.images
    : selectedPost ? [selectedPost.imageUrl] : [];

  const openPost = (id: string) => {
    setActiveImageIndex(0);
    setSelectedPostId(id);
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((i) => (i - 1 + selectedImages.length) % selectedImages.length);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((i) => (i + 1) % selectedImages.length);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLikePost(id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    onAddComment(selectedPost.id, { username: 'you_sweet_lover', text: newComment.trim() });
    setNewComment('');
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-[#FFF5F8] rounded-[32px] p-8 sm:p-12 border border-[#F6B8C8]/20 text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] flex items-center justify-center gap-1">
          <Sparkles className="h-4 w-4" /> Live Instagram Gallery
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#1E1E1E]">Boutique Sweet Showcase</h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Explore real creations handcrafted in our Greater Noida home kitchen. Click on any post to view details, swipe through more angles, or post a comment directly to our simulated social timeline!
        </p>
      </div>

      {/* Masonry-style Grid */}
      <div className="columns-1 md:columns-3 gap-6 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => openPost(post.id)}
            className="break-inside-avoid bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative"
          >
            {/* Image Stage */}
            <div className="relative overflow-hidden bg-gray-50">
              <img
                src={resolveCakeImage(post.imageUrl)}
                alt={post.caption}
                className="w-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {post.images && post.images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Images className="h-3 w-3" /> {post.images.length}
                </div>
              )}
              
              {/* Overlay with Quick Info */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-6">
                <button 
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center gap-1 hover:text-[#F6B8C8] transition-colors font-bold text-sm"
                >
                  <Heart className="h-5 w-5 fill-transparent hover:fill-[#D63384]" /> {post.likes}
                </button>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <MessageCircle className="h-5 w-5" /> {post.comments.length}
                </div>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <Eye className="h-5 w-5" /> View
                </div>
              </div>
            </div>

            {/* Post details preview */}
            <div className="p-5 space-y-3">
              <p className="text-xs text-gray-500 font-semibold">{post.date}</p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 font-sans">
                {post.caption}
              </p>
              
              {/* Interactive quick feedback */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-[10px] uppercase font-bold text-[#D63384]">@cakeasy.in</span>
                <span className="text-[10px] text-gray-400">{post.likes} ❤️</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL WITH DETAILED SOCIAL CHAT TIMELINE */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] overflow-hidden max-w-4xl w-full border border-[#FFF5F8] grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-scaleIn max-h-[90vh]">
            
            {/* Left Box: Large image aspect */}
            <div className="bg-neutral-900 relative flex items-center justify-center aspect-square md:h-full">
              <img
                src={resolveCakeImage(selectedImages[activeImageIndex])}
                alt={selectedPost.caption}
                className="max-h-[50vh] md:max-h-[80vh] w-full object-cover"
              />
              <button
                onClick={() => setSelectedPostId(null)}
                className="absolute top-4 left-4 h-10 w-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center md:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={showPrevImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={showNextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-2.5 py-1.5 rounded-full">
                    {selectedImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                        aria-label={`View photo ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Box: Chat timeline and actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between h-[45vh] md:h-auto overflow-y-auto">
              {/* Top Row: User & Close */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#FFF5F8] border border-[#F6B8C8] flex items-center justify-center text-xs font-bold text-[#D63384]">
                    CE
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1E1E]">Cakeasy Confectionery</h3>
                    <p className="text-[10px] text-[#D63384] font-semibold uppercase tracking-wider">Greater Noida Home Kitchen</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPostId(null)}
                  className="h-10 w-10 bg-neutral-100 hover:bg-[#FFF5F8] text-gray-400 hover:text-[#D63384] rounded-full hidden md:flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Middle Row: Scrollable Comments & Caption */}
              <div className="flex-grow overflow-y-auto my-4 space-y-4 pr-1">
                {/* Primary Caption */}
                <div className="bg-[#FFF5F8]/40 p-4 rounded-2xl border border-pink-50/50">
                  <span className="font-bold text-xs text-[#D63384] block mb-1">@cakeasy.in</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">
                    {selectedPost.caption}
                  </p>
                </div>

                {/* Comment timeline */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Comments timeline</h4>
                  {selectedPost.comments.map((comment, index) => (
                    <div key={index} className="flex gap-2.5 items-start text-xs text-gray-600 leading-snug">
                      <span className="font-bold text-gray-800 shrink-0">@{comment.username}:</span>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: Likes, input form */}
              <div className="pt-4 border-t border-gray-50 shrink-0 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <button 
                    onClick={(e) => handleLike(selectedPost.id, e)}
                    className="flex items-center gap-1.5 bg-[#FFF5F8] text-[#D63384] font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
                  >
                    ❤️ {selectedPost.likes} Likes
                  </button>
                  <span className="text-gray-400 font-medium">{selectedPost.date}</span>
                </div>

                {/* Simulated Comment input form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment to our bake live feed..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D63384] hover:bg-[#b02266] text-white p-2.5 rounded-xl transition-colors shrink-0"
                    aria-label="Send comment"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
