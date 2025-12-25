/* Import section */
import { CreatePost } from "../components/CreatePost";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const CreatePostPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:40px_40px] pointer-events-none" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-pink-600/5 blur-[100px] pointer-events-none" />

      <div className="sticky top-0 z-[50] w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center gap-3 group transition-all"
          >
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">
              Back to Feed
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full pt-16 sm:pt-24">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 sm:mb-28 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Visual Anchor Line */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-pink-600 mb-6" />

            <h1 className="text-[clamp(2.5rem,10vw,8.5rem)] font-black text-white tracking-tighter leading-[0.8] uppercase italic">
              DRAFT YOUR
            </h1>
            <h1 className="text-pink-600 text-[clamp(2.5rem,10vw,8.5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">
              EXPERTISE
            </h1>

            <div className="mt-8 px-5 py-1.5 border border-white/10 rounded-full bg-white/[0.02]">
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em]">
                Share your knowledge
              </p>
            </div>
          </motion.div>
        </div>

        {/* The Form Component Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-5xl mx-auto px-4 sm:px-10"
        >
          {/* Frameless design with corner accents */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t border-l border-white/10 pointer-events-none hidden sm:block" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b border-r border-white/10 pointer-events-none hidden sm:block" />

            <CreatePost />
          </div>
        </motion.div>
      </div>

      <div className="mt-24 flex justify-center opacity-20">
        <div className="flex items-center gap-4">
          <div className="w-1 h-1 rounded-full bg-pink-600 animate-pulse" />
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[1em]">
            Authorized_Session
          </span>
          <div className="w-1 h-1 rounded-full bg-pink-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
