import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, AlertCircle, Sparkles, User } from "lucide-react";
import { supabase } from "../supabase-client";

interface CommunityInput {
    name: string;
    description: string;
}

const createCommunity = async (community: CommunityInput) => {
    const { data, error } = await supabase
        .from("communities")
        .insert(community)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const CreateCommunity = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createCommunity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["communities"] });
            setStatus("success");
            setName("");
            setDescription("");
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (err) => {
            console.error("Broadcast Error:", err);
            setStatus("error");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name || !description) {
            setStatus("error");
            return;
        }
        mutate({ name, description });
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <AnimatePresence>
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-8 max-w-lg"
                        >
                            <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(219,39,119,0.3)]">
                                <Check size={36} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="space-y-0">
                                <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-white tracking-tighter leading-[0.8] uppercase italic">FOUND YOUR</h2>
                                <h2 className="text-pink-600 text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">NETWORK</h2>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => navigate("/communities")} className="flex-1 h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-xl">Communities List</button>
                                <button onClick={() => setStatus("idle")} className="flex-1 h-14 bg-zinc-900 text-zinc-400 border border-white/10 font-black uppercase text-[10px] tracking-widest rounded-xl hover:text-white transition-all">Go Back</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div layout className="relative bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <User size={12} className="text-zinc-600" />
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Post as <span className="text-white">{user?.user_metadata?.user_name || user?.email?.split("@")[0]}</span>
                            </span>
                        </div>
                        <Sparkles size={14} className="text-pink-600" />
                    </div>

                    <div className="p-6 md:p-10 space-y-6">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Community Identity</label>
                            <input
                                required
                                className="w-full bg-white/5 border border-white/10 p-4 text-xl font-bold text-white outline-none rounded-xl focus:border-pink-600 transition-all 
                                placeholder:text-zinc-700 placeholder:text-sm md:placeholder:text-lg placeholder:font-black placeholder:uppercase placeholder:tracking-tighter"
                                placeholder="Enter Community Title..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Protocol Scope</label>
                            <textarea
                                required
                                className="w-full bg-white/5 border border-white/10 p-4 text-zinc-400 min-h-[250px] outline-none rounded-xl focus:border-pink-600 transition-all resize-none text-sm 
                                placeholder:text-zinc-700 placeholder:text-[10px] md:placeholder:text-sm placeholder:font-bold placeholder:uppercase placeholder:tracking-widest"
                                placeholder="Describe the mission of this transmission..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="min-h-[20px]">
                                <AnimatePresence>
                                    {status === "error" && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-pink-600 text-[10px] font-bold uppercase italic">
                                            <AlertCircle size={14} /> Transmission Error
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                type="submit"
                                disabled={isPending || !user}
                                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPending || !user ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-pink-600 hover:text-white shadow-lg active:scale-95"}`}
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <>Initialize Community <ArrowRight size={14} /></>}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
