import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Activity, PlusCircle } from "lucide-react";

import AnimatedIcon from "../components/AnimatedIcon";
import { useMousePosition } from "../hooks/useMousePosition";
import { icons } from "../utils/icons";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import KaenCapabilities from "../components/KaenCapabilities";
import Testimonials from "../components/Testimonials";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  user_id: string;
  author: string;
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
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1024 });

  const [displayText, setDisplayText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [showLogs, setShowLogs] = useState(false);

  // Icons for mobile
  const Icon1 = icons[0]?.Icon;
  const Icon2 = icons[1]?.Icon;
  const Icon3 = icons[2]?.Icon;
  const Icon4 = icons[3]?.Icon;
  const Icon5 = icons[4]?.Icon;
  const Icon6 = icons[5]?.Icon;

  const { data: latestPosts, isLoading } = useQuery<Post[], Error>({
    queryKey: ["homeThreads"],
    queryFn: fetchHomeThreads,
  });

  const commands = useMemo(
    () => ["kaen --about", "kaen --origin", "kaen --utility", "kaen --status"],
    []
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentCommand = commands[commandIndex];

    if (displayText.length < currentCommand.length) {
      timer = setTimeout(() => {
        setDisplayText(currentCommand.slice(0, displayText.length + 1));
        setShowLogs(false);
      }, 120);
    } else {
      timer = setTimeout(() => {
        setShowLogs(true);
        setTimeout(() => {
          setDisplayText("");
          setCommandIndex((prev) => (prev + 1) % commands.length);
        }, 6000);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [displayText, commandIndex, commands]);

  return (
    <div
      className={
        isMobile || isTablet ? "overflow-x-hidden bg-black" : "bg-black"
      }
    >
      <section
        className={`relative min-h-[75vh] sm:min-h-screen w-full flex flex-col pt-6 sm:pt-16 pb-4 sm:pb-20 px-6 ${
          isMobile ? "overflow-hidden" : ""
        }`}
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isMobile ? (
            /* MOBILE */
            <div className="absolute inset-0 h-full w-full opacity-20">
              {Icon1 && (
                <div className="absolute top-[5%] left-[5%] text-pink-600">
                  <Icon1 size={32} className="" />
                </div>
              )}
              {Icon2 && (
                <div className="absolute top-[8%] right-[5%] text-pink-600">
                  <Icon2 size={32} className="" />
                </div>
              )}
              {Icon3 && (
                <div className="absolute top-[18%] left-[8%] text-pink-600">
                  <Icon3 size={32} className="" />
                </div>
              )}
              {Icon4 && (
                <div className="absolute top-[22%] right-[8%] text-pink-600">
                  <Icon4 size={32} className="" />
                </div>
              )}
              {Icon5 && (
                <div className="absolute top-[35%] left-[5%] text-pink-600">
                  <Icon5 size={32} className="" />
                </div>
              )}
              {Icon6 && (
                <div className="absolute top-[40%] right-[5%] text-pink-600">
                  <Icon6 size={32} className="" />
                </div>
              )}
            </div>
          ) : (
            /* DESKTOP*/
            icons.map((icon, index) => (
              <AnimatedIcon
                key={index}
                Icon={icon.Icon}
                size={icon.size}
                opacity={icon.opacity}
                position={icon.position}
                depth={icon.depth}
                mousePos={mousePos}
              />
            ))
          )}
        </div>

        <main className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3 px-4 py-1.5 border border-white/5 rounded-full bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-gray-400"
          >
            <Activity size={12} className="text-pink-500 animate-pulse" />
            <span className="uppercase italic tracking-[0.25em] text-white">
              Devs for Devs
            </span>
          </motion.div>

          <h1 className="text-[2.6rem] sm:text-8xl lg:text-9xl font-extrabold leading-[0.85] sm:leading-[0.9] tracking-tighter mb-4">
            Build together <br />{" "}
            <span className="animate-shine-text">shine alone</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
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

          <div className="mt-8 sm:mt-12 w-full max-w-3xl bg-[#0a0a0b] border border-[#343536] rounded-2xl overflow-hidden font-mono text-left mx-auto shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161617] border-b border-[#343536]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                kaen_terminal_v1.0.42
              </span>
            </div>
            <div className="p-6 h-[180px] sm:h-[240px] text-[12px] sm:text-[13px] leading-relaxed">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-pink-500 font-bold">root@kaen:~$</span>
                <span className="text-white">{displayText}</span>
                <span className="w-2 h-4 bg-pink-500 animate-pulse" />
              </div>
              <AnimatePresence mode="wait">
                {showLogs && (
                  <motion.div
                    key={commandIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {commandIndex === 0 && (
                      <p className="text-gray-400 italic">
                        [OBJECTIVE]{" "}
                        <span className="text-white">
                          A pure high-fidelity ecosystem. Built by devs, for
                          devs.
                        </span>
                      </p>
                    )}
                    {commandIndex === 1 && (
                      <div className="border-l-2 border-pink-500 pl-4 py-1">
                        <p className="text-white font-bold uppercase tracking-tight italic">
                          Architected by Imainiginations
                        </p>
                        <p className="text-gray-500 italic text-[11px]">
                          Eliminating noise. Prioritizing technical
                          intelligence.
                        </p>
                      </div>
                    )}
                    {commandIndex === 2 && (
                      <div className="flex flex-col gap-1">
                        <p className="text-white font-bold">USE_CASES:</p>
                        <p className="text-gray-400 text-[11px]">
                          - Share advanced technical intelligence
                          <br />- Audit peer-to-peer system architectures
                          <br />- Document engineering breakthroughs
                        </p>
                      </div>
                    )}
                    {commandIndex === 3 && (
                      <div className="flex items-center gap-3 text-white font-bold border border-white/10 w-fit px-3 py-1 rounded">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="tracking-widest uppercase text-[10px]">
                          Kaen Core: Online // Signal Stable
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

      <KaenCapabilities />

      <section className="py-8 sm:py-16 px-6 max-w-7xl mx-auto border-t border-[#1a1a1b]">
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic text-white">
              Active Threads
            </h2>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-1">
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
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0b] border border-[#343536] p-6 rounded-2xl animate-pulse h-32"
                />
              ))
            : latestPosts?.map((post, i) => (
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
                      @{post.author || "user"}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <Testimonials />
    </div>
  );
};
