import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, MessageSquare, Loader2, Search, Hash, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase-client";

export const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    const [posts, setPosts] = useState<any[]>([]);
    const [communities, setCommunities] = useState<any[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const [pRes, cRes] = await Promise.all([
                supabase.from('posts').select('*, communities(name)').ilike('title', `%${query}%`),
                supabase.from('communities').select('*').ilike('name', `%${query}%`)
            ]);
            setPosts(pRes.data || []);
            setCommunities(cRes.data || []);
            setLoading(false);
        };
        if (query) fetchResults();
    }, [query]);

    const filteredResults = () => {
        if (activeTab === "posts") return posts.map(p => ({ ...p, type: 'post' }));
        if (activeTab === "communities") return communities.map(c => ({ ...c, type: 'community' }));
        return [
            ...communities.map(c => ({ ...c, type: 'community' })),
            ...posts.map(p => ({ ...p, type: 'post' }))
        ];
    };

    return (
        <div className="min-h-screen bg-black pt-5 pb-20">
            <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

                <main>
                    {/* SEARCH HEADER */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/" className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">Network Search</p>
                            <h1 className="text-2xl font-bold text-white tracking-tight">"{query}"</h1>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex gap-8 border-b border-white/10 mb-6">
                        {["all", "posts", "communities"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="search-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* RESULTS LIST */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="animate-spin text-pink-500" size={32} />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <AnimatePresence mode="popLayout">
                                {filteredResults().length > 0 ? (
                                    filteredResults().map((item) => (
                                        <ResultRow key={item.id + item.type} item={item} />
                                    ))
                                ) : (
                                    <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl">
                                        <Search className="mx-auto text-white/10 mb-4" size={40} />
                                        <h3 className="text-white font-bold">No results found</h3>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                {/* SIDEBAR */}
                <aside className="hidden lg:flex flex-col gap-4">
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 sticky top-24">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <Info size={16} className="text-pink-500" />
                            <h2 className="text-sm font-bold tracking-tight">Summary</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-bold uppercase">Matches</span>
                                <span className="text-xs text-white font-mono">{posts.length + communities.length}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-xs text-gray-500 font-bold uppercase">Communities</span>
                                <span className="text-xs text-white font-mono">{communities.length}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-xs text-gray-500 font-bold uppercase">Posts</span>
                                <span className="text-xs text-white font-mono">{posts.length}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const ResultRow = ({ item }: { item: any }) => {
    const isPost = item.type === 'post';
    const destination = isPost ? `/post/${item.id}` : `/community/${item.id}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative"
        >
            <Link to={destination} className="block w-full">
                <div className="flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all duration-200 border-l-2 border-l-transparent hover:border-l-pink-500/50">

                    {/* ICON */}
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isPost
                        ? "bg-black border-white/10 text-gray-500 group-hover:text-blue-500 group-hover:border-blue-500/30"
                        : "bg-pink-600/10 border-pink-500/20 text-pink-500 group-hover:bg-pink-600 group-hover:text-white"
                        }`}>
                        {isPost ? <MessageSquare size={18} /> : <Hash size={18} />}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isPost ? 'text-gray-500' : 'text-pink-500'}`}>
                                {isPost ? `k/${item.communities?.name || 'Kaen'}` : "Community"}
                            </span>
                            <span className="text-gray-800">•</span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase">
                                {isPost ? "Article" : "Network"}
                            </span>
                        </div>

                        <h3 className="text-[15px] font-bold text-[#d7dadc] group-hover:text-white transition-colors leading-snug">
                            {isPost ? item.title : item.name}
                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">
                            {item.content || item.description || "View details for this entry..."}
                        </p>
                    </div>

                    {/* ARROW */}
                    <div className="self-center p-2 text-gray-700 group-hover:text-white transition-colors">
                        <ChevronRight size={18} />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
