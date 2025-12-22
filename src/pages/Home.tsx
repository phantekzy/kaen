import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Activity, PlusCircle, Info } from "lucide-react";

import AnimatedIcon from "../components/AnimatedIcon";
import { useMousePosition } from "../hooks/useMousePosition";
import { icons } from "../utils/icons";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  user_id: string;
  author: string;
  avatar_url?: string;
}

const fetchHomeThreads = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) throw new Error(error.message);
  return data as Post[];
};

const formatRelativeTime = (dateString: string) => {
  const diffInMs = new Date().getTime() - new Date(dateString).getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export const Home = () => {
  const mousePos = useMousePosition();
  const { signInWithGitHub, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const [displayText, setDisplayText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [showLogs, setShowLogs] = useState(false);

  const {
    data: latestPosts,
    isLoading,
    error,
  } = useQuery<Post[], Error>({
    queryKey: ["homeThreads"],
    queryFn: fetchHomeThreads,
  });

  const commands = useMemo(
    () => [
      "whoami --platform",
      "cat ownership.info",
      "system --version",
      "kaen --status",
    ],
    []
  );

  useEffect(() => {
    let timeout: any;
    const currentCommand = commands[commandIndex];

    if (displayText.length < currentCommand.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentCommand.slice(0, displayText.length + 1));
        setShowLogs(false);
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setShowLogs(true);
        setTimeout(() => {
          setDisplayText("");
          setCommandIndex((prev) => (prev + 1) % commands.length);
        }, 5000);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [displayText, commandIndex, commands]);

  const displayedIcons = isMobile ? icons.slice(0, 6) : icons;

  return (
    <div className="bg-black text-white selection:bg-pink-500/30 w-full min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col pt-20 px-6">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {displayedIcons.map((icon, index) => (
            <AnimatedIcon
              key={index}
              Icon={icon.Icon}
              size={isMobile ? 20 : icon.size}
              opacity={0.1}
              position={
                isMobile
                  ? {
                      top: `${(index * 15) % 60}%`,
                      left: `${(index * 30) % 80}%`,
                    }
                  : icon.position
              }
              depth={isMobile ? 0 : icon.depth}
              mousePos={isMobile ? { x: 0, y: 0 } : mousePos}
            />
          ))}
        </div>

        <main className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-4 py-1.5 border border-white/5 rounded-full bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-gray-400"
          >
            <Activity size={12} className="text-pink-500 animate-pulse" />
            <span>
              NETWORK STATUS:{" "}
              <span className="text-white font-black uppercase">Online</span>
            </span>
          </motion.div>

          <h1 className="text-[2.8rem] sm:text-8xl lg:text-9xl font-extrabold leading-[0.9] tracking-tighter mb-6">
            Build together <br />
            <span className="animate-shine-text">shine alone</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {user ? (
              <button
                onClick={() => navigate("/create")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-pink-600 text-white rounded-full font-bold transition-all hover:bg-pink-500 active:scale-95 shadow-xl shadow-pink-600/20"
              >
                <PlusCircle size={20} /> CREATE POST
              </button>
            ) : (
              <button
                onClick={() => signInWithGitHub()}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold transition-all hover:bg-gray-200 active:scale-95 shadow-xl shadow-white/5"
              >
                <Github size={20} /> GET STARTED
              </button>
            )}

            <Link
              to="/posts"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-transparent border border-[#343536] hover:bg-white/5 rounded-full font-bold transition-all"
            >
              BROWSE FEED{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="mt-12 sm:mt-16 w-full max-w-3xl bg-[#0a0a0b] border border-[#343536] rounded-2xl overflow-hidden font-mono text-left mx-auto shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161617] border-b border-[#343536]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                kaen_terminal_v1.0.4
              </span>
            </div>
            <div className="p-6 h-[260px] sm:h-[280px] text-[12px] sm:text-[13px] leading-relaxed">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-pink-500 font-bold">visitor@kaen:~$</span>
                <span className="text-white">{displayText}</span>
                <span className="w-2 h-4 bg-pink-500 animate-pulse" />
              </div>
              <AnimatePresence mode="wait">
                {showLogs && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {commandIndex === 1 && (
                      <div className="border-l-2 border-pink-500 pl-4 py-1">
                        <p className="text-white font-bold tracking-tight uppercase italic">
                          Imaginations Software
                        </p>
                        <p className="text-gray-500">
                          Directed by{" "}
                          <span className="text-white font-bold">
                            Phantekzy
                          </span>
                          .
                        </p>
                      </div>
                    )}
                    {commandIndex === 3 && (
                      <div className="flex items-center gap-3 text-green-500 font-bold">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="tracking-widest uppercase text-[10px]">
                          Ready for network synchronization
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </section>

      {/* --- ACTIVE THREADS --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#1a1a1b]">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic text-white">
              Active Threads
            </h2>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-2">
              Live synchronization
            </p>
          </div>
          <Link
            to="/posts"
            className="text-[10px] font-bold text-pink-500 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-8"
          >
            View All_
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#0a0a0b] border border-[#343536] p-6 rounded-2xl animate-pulse h-32"
              />
            ))
          ) : error ? (
            <div className="col-span-full text-red-500 text-[10px] uppercase font-bold tracking-widest">
              Error: {error.message}
            </div>
          ) : (
            latestPosts?.map((post, i) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="bg-[#0a0a0b] border border-[#343536] p-6 rounded-2xl hover:border-pink-500/50 hover:bg-white/[0.02] transition-all group cursor-pointer text-left block"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] text-pink-500 font-bold tracking-widest uppercase">
                    Signal_0{i + 1}
                  </span>
                  <span className="text-[9px] text-gray-600 uppercase font-bold">
                    {formatRelativeTime(post.created_at)}
                  </span>
                </div>
                <h4 className="text-[15px] font-bold text-gray-200 mb-4 group-hover:text-pink-400 transition-colors line-clamp-1 italic">
                  "{post.title}"
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <div className="w-4 h-px bg-pink-500/50" />
                  <span className="font-bold tracking-tight uppercase">
                    @{post.author || "system"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-[#1a1a1b] px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-10 tracking-tighter italic">
          Enter the network.
        </h2>
        <Link
          to="/about"
          className="inline-flex items-center px-12 py-5 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-xl shadow-pink-600/20 active:scale-95"
        >
          <Info size={20} className="mr-3" /> LEARN ABOUT KAEN
        </Link>
        <div className="mt-20 flex flex-col items-center gap-4">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">
            Imaginations Software © 2025 | Directed by Phantekzy
          </p>
        </div>
      </footer>
    </div>
  );
};
