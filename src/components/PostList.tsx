import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { LayoutGrid, List, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

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

const fetchPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Post[];
};

export const PostList = () => {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    const { data, isLoading } = useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center py-40 w-full">
                <Loader2 className="text-pink-600 animate-spin mb-4" size={40} />
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                    Syncing_Database
                </span>
            </div>
        );

    // --- PAGINATION LOGIC ---
    const totalPosts = data?.length || 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data?.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 w-full pb-32">
            {/* Header / Sticky Nav */}
            <div className="hidden md:block sticky top-24 z-50 w-full mb-12">
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 250, damping: 30, mass: 0.8 }}
                    className={`flex items-center overflow-hidden border border-white/5 backdrop-blur-xl ${isScrolled
                        ? "bg-zinc-900/90 rounded-2xl p-1.5 w-max shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
                        : "w-full justify-between py-6 bg-transparent border-t-0 border-x-0 border-b"
                        }`}
                >
                    <motion.div
                        layout
                        animate={{
                            opacity: isScrolled ? 0 : 1,
                            width: isScrolled ? 0 : "auto",
                            marginRight: isScrolled ? 0 : 20,
                        }}
                        className="flex flex-col whitespace-nowrap overflow-hidden"
                    >
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Feed</h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            {totalPosts} Total Posts
                        </p>
                    </motion.div>

                    <motion.div
                        layout
                        className={`flex items-center gap-1.5 ${!isScrolled && "bg-zinc-900/50 p-1 rounded-xl border border-white/5"}`}
                    >
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden mb-10 border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Feed</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">
                    {totalPosts} Total Posts
                </p>
            </div>

            {/* Posts Grid/List */}
            <motion.div
                layout
                className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}`}
            >
                <AnimatePresence mode="popLayout">
                    {currentPosts?.map((post) => (
                        <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full"
                        >
                            <PostItem post={post} variant={viewMode} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="mt-20 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === number
                                        ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {number.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
            )}
        </div>
    );
};
