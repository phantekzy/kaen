import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import { User, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    const hudWidth = useTransform(scrollY, [0, 200], ["320px", "120px"]);
    const imageRadius = useTransform(scrollY, [0, 200], ["24px", "16px"]);

    useEffect(() => {
        return scrollY.on("change", (latest) => setIsScrolled(latest > 100));
    }, [scrollY]);

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            const { data } = await supabase.from("posts").select("*").eq("id", id).single();
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-pink-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-pink-600/30">
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 p-4 pt-20 md:pt-40">
                <aside className="lg:w-auto shrink-0 z-50">
                    <div className="lg:hidden flex gap-2 mb-6">
                        <div className="w-24 h-24 border border-white/10 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                            {post?.avatar_url ? (
                                <img src={post.avatar_url} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <User className="w-full h-full p-6 text-zinc-800" />
                            )}
                        </div>
                        <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center backdrop-blur-md">
                            <h2 className="text-pink-600 font-black uppercase text-[10px] tracking-widest">{post?.author}</h2>
                            <p className="text-zinc-500 font-mono text-[9px] mt-1 uppercase">
                                {post?.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex sticky top-24 flex-col gap-3">
                        <motion.div
                            layout
                            style={{ width: hudWidth, borderRadius: imageRadius }}
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                            className="aspect-square bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl shrink-0"
                        >
                            <motion.img layout src={post?.avatar_url} className="w-full h-full object-cover" />
                        </motion.div>

                        <AnimatePresence mode="popLayout">
                            {!isScrolled && (
                                <motion.div
                                    key="meta-data"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10, height: 0, marginTop: 0 }}
                                    className="w-[320px] bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm overflow-hidden"
                                >
                                    <span className="text-[10px] font-mono text-pink-600 uppercase font-black tracking-widest">Author</span>
                                    <h2 className="text-xl font-black uppercase tracking-tighter truncate">{post?.author}</h2>
                                    <p className="text-zinc-500 font-mono text-[9px] uppercase mt-2">
                                        {post?.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <PostDetail postId={Number(id)} postAuthorId={post?.user_id} />
                </main>
            </div>
        </div>
    );
};
