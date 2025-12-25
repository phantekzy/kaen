import { CreatePost } from "../components/CreatePost";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user, signInWithGitHub } = useAuth();

  return (
    <div className="bg-black min-h-screen pb-32 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-pink-600/5 blur-[100px] pointer-events-none" />

      <div className="sticky top-0 z-[50] w-full pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate("/posts")}
            className="pointer-events-auto flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/5 p-2 pr-6 rounded-xl group transition-all hover:border-pink-600/50 w-fit"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors whitespace-nowrap">
              Back to Feed
            </span>
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 w-full pt-8 sm:pt-16">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 sm:mb-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-pink-600 mb-6" />
            <h1 className="text-[clamp(2.5rem,10vw,8.5rem)] font-black text-white tracking-tighter leading-[0.8] uppercase italic">
              DRAFT YOUR
            </h1>
            <h1 className="text-pink-600 text-[clamp(2.5rem,10vw,8.5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">
              EXPERTISE
            </h1>
          </motion.div>
        </div>

        {/* AUTH GUARD LOGIC */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-10">
          {!user ? (
            /* --- ACCESS DENIED MESSAGE --- */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/20 border border-white/5 rounded-2xl p-12 backdrop-blur-sm flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-pink-600/10 border border-pink-600/20 flex items-center justify-center text-pink-600 shadow-[0_0_30px_rgba(219,39,119,0.1)]">
                <Lock size={30} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">
                  Unauthorized Access
                </h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                  Only logged-in operators can broadcast technical expertise to
                  the network.
                </p>
              </div>
              <button
                onClick={() => signInWithGitHub()}
                className="mt-4 flex items-center gap-3 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-pink-600 hover:text-white transition-all shadow-xl"
              >
                <UserPlus size={16} /> Sign In to Create
              </button>
            </motion.div>
          ) : (
            /* --- THE ACTUAL FORM --- */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 border-t border-l border-white/10 pointer-events-none hidden sm:block" />
              <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b border-r border-white/10 pointer-events-none hidden sm:block" />
              <CreatePost />
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer node indicator */}
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
