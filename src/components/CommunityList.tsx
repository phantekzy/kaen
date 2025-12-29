/* Import section */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommunityItem } from "./CommunityItem";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { motion, useScroll } from "framer-motion";
/* Types */
export interface Community {
    id: number;
    name: string;
    description: string;
    created_at: string;
    user_id: string;
    creator: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Community[];
};
/* Community lists */
export const CommunityList = () => {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
    }, [scrollY]);

    const { data, isLoading } = useQuery({
        queryKey: ["communities"],
        queryFn: fetchCommunities,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="text-pink-600 animate-spin mb-4" size={40} />
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                    Syncing_Network
                </span>
            </div>
        );
    }

    return (
        <div className="w-full pb-32">
            {/* STICKY SWITCHER  */}
            <div className="hidden md:block sticky top-24 z-50 w-full mb-12">
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 250, damping: 30, mass: 0.8 }}
                    className={`
                        flex items-center overflow-hidden border border-white/5 backdrop-blur-xl
                        ${isScrolled
                            ? "bg-zinc-900/90 rounded-2xl p-1.5 w-max shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
                            : "w-full justify-between py-6 bg-transparent border-t-0 border-x-0 border-b"
                        }
                    `}
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
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                            Network
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            {data?.length} Communities
                        </p>
                    </motion.div>

                    <motion.div
                        layout
                        className={`flex items-center gap-1.5 ${!isScrolled && "bg-zinc-900/50 p-2 rounded-xl border border-white/5"}`}
                    >
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === "list"
                                ? "bg-white text-black"
                                : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === "grid"
                                ? "bg-white text-black"
                                : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <div className="md:hidden mb-10 border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                    Network
                </h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">
                    {data?.length} Communities
                </p>
            </div>

            <motion.div
                layout
                className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}`}
            >
                {data?.map((community) => (
                    <CommunityItem
                        key={community.id}
                        community={community}
                    />
                ))}
            </motion.div>
        </div>
    );
};

