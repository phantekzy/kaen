/* Import section */
import { CreateCommunity } from "../components/CreateCommunity";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

/* Create community page section */
export const CreateCommunityPage = () => {
  const navigate = useNavigate();
  const { user, signInWithGitHub } = useAuth();

  return (
    <div className="bg-black min-h-screen pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-pink-600/5 blur-[100px] pointer-events-none" />

      {/* BACK BUTTON */}
      <div className="relative z-50 max-w-7xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate("/create")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back
          </span>
        </button>
      </div>

      <div className="relative z-10 w-full pt-8 sm:pt-16">
        <div className="flex flex-col items-center mb-12 sm:mb-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-pink-600 mb-6" />
            <h1 className="text-[clamp(2.5rem,10vw,8.5rem)] font-black text-white tracking-tighter leading-[0.8] uppercase italic">
              FOUND YOUR
            </h1>
            <h1 className="text-pink-600 text-[clamp(2.5rem,10vw,8.5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">
              NETWORK
            </h1>
          </motion.div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-10">
          {!user ? (
            /* Unauthorized State */
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
                  Only logged-in operators can initialize new community
                  protocols to the network.
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 border-t border-l border-white/10 pointer-events-none hidden sm:block" />
              <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b border-r border-white/10 pointer-events-none hidden sm:block" />
              <CreateCommunity />
            </motion.div>
          )}
        </div>
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
