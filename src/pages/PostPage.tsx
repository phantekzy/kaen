import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostDetail } from "../components/PostDetail";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Database,
  Cpu,
  Loader2,
  UserCircle2,
  ChevronRight,
} from "lucide-react";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-pink-600" size={32} />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      {/* BACKGROUND DATA LAYER */}
      <div className="fixed inset-0 pointer-events-none select-none opacity-20">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-10 -right-20 text-white/[0.03]"
        >
          <Database size={450} />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 left-0 text-pink-600/[0.05]"
        >
          <Cpu size={200} />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40 flex flex-col lg:flex-row gap-20">
        {/* SIDEBAR (LEFT) */}
        <aside className="w-full lg:w-72 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-32 space-y-16">
            {/* AUTHOR MODULE */}
            <div className="group">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-[1px] w-4 bg-pink-600" />
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">
                  Identity
                </p>
              </div>

              <div className="flex flex-col gap-4 pl-6 border-l border-zinc-900">
                {post?.avatar_url ? (
                  <img
                    src={post.avatar_url}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-2xl shadow-pink-900/10"
                    alt={post.author}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
                    <UserCircle2 size={32} />
                  </div>
                )}

                <div>
                  <h2 className="text-white text-2xl font-black tracking-tighter uppercase leading-none">
                    {post?.author || "User"}
                  </h2>
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-0.5 rounded bg-pink-600/10 border border-pink-500/20">
                    <span className="text-pink-500 font-mono text-[9px] font-bold tracking-widest uppercase">
                      KAEN_USER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DATE MODULE */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-[1px] w-4 bg-zinc-700" />
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">
                  Timeline
                </p>
              </div>

              <div className="pl-6 border-l border-zinc-900 flex items-center gap-4 group">
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors">
                  <Calendar size={18} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-white font-mono text-sm font-bold tracking-tight">
                    {new Date(post?.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-zinc-600 font-mono text-[10px] uppercase mt-0.5">
                    Stored_Entry
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK NAV INDICATOR */}
            <div className="hidden lg:block opacity-40">
              <div className="h-[1px] w-full bg-zinc-900 mb-4" />
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
                <ChevronRight size={10} className="text-pink-600" />
                Viewing_Single_Post
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN POST (RIGHT) */}
        <main className="flex-1 max-w-4xl order-1 lg:order-2">
          {/* Header Accent */}
          <div className="flex items-center gap-6 mb-16 opacity-30">
            <div className="w-12 h-[2px] bg-pink-600" />
            <span className="font-mono text-[10px] text-zinc-500 tracking-[0.4em] uppercase">
              Post_Analysis_Mode
            </span>
            <div className="flex-1 h-[1px] bg-zinc-900" />
          </div>

          <div className="relative">
            <PostDetail postId={Number(id)} />
          </div>
        </main>
      </div>
    </div>
  );
};
