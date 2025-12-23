import { PostList } from "../components/PostList";
import {
  FileCode,
  Braces,
  Terminal,
  Cpu,
  Database,
  Globe,
  Code2,
  Atom,
} from "lucide-react";
import { motion } from "framer-motion";

export const Posts = () => {
  const bgIcons = [
    { Icon: FileCode, top: "10%", left: "4%" },
    { Icon: Braces, top: "18%", right: "4%" },
    { Icon: Terminal, top: "35%", left: "4%" },
    { Icon: Globe, top: "45%", right: "4%" },
    { Icon: Cpu, top: "60%", left: "4%" },
    { Icon: Code2, top: "75%", right: "4%" },
    { Icon: Database, top: "85%", left: "4%" },
    { Icon: Atom, top: "92%", right: "4%" },
  ];

  return (
    <div className="min-h-screen bg-black relative w-full">
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-[100dvh]">
        {bgIcons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            className="absolute text-white"
            style={{
              top: item.top,
              ...(item.left ? { left: item.left } : { right: item.right }),
            }}
          >
            <item.Icon size={32} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-32 px-6">
        <header className="mb-16 border-b border-white/5 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-pink-600 font-black text-[10px] uppercase tracking-[0.5em]">
              Kaen / Archive
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
            Recent <span className="text-pink-600">Posts</span>
          </h1>

          <p className="max-w-2xl text-zinc-500 text-sm md:text-lg leading-relaxed font-medium uppercase tracking-tight">
            Engineering <span className="text-white">imagination</span> through
            the lens of <span className="text-white">kaen</span> architecture.
          </p>
        </header>

        <div className="relative">
          <PostList />
        </div>
      </div>
    </div>
  );
};
