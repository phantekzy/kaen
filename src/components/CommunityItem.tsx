import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle, X, Check, Globe, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "../supabase-client"
import { Link } from "react-router"
import type { Community } from "./CommunityList"

interface Props {
    community: Community
}

export const CommunityItem = ({ community }: Props) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [isConfirming, setIsConfirming] = useState(false)

    const springTransition = { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getUser()
            setCurrentUserId(data.user?.id || null)
        }
        getSession()
    }, [])

    const handleDelete = async () => {
        const { error } = await supabase.from("communities").delete().eq("id", community.id)
        if (!error) window.location.reload()
    }

    return (
        <motion.div layout transition={springTransition} className="group relative h-full w-full">
            <AnimatePresence>
                {isConfirming && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center p-4 border border-red-500/40"
                    >
                        <div className="p-2 bg-red-500/10 rounded-full mb-3">
                            <AlertTriangle className="text-red-500" size={18} />
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={(e) => { e.preventDefault(); setIsConfirming(false); }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-lg text-zinc-400 text-[9px] uppercase font-bold border border-white/5 whitespace-nowrap transition-colors hover:text-white"
                            >
                                <X size={10} /> Abort
                            </button>

                            <button
                                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 rounded-lg text-red-500 text-[9px] uppercase font-bold border border-red-500/50 whitespace-nowrap hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Check size={10} /> Execute
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link to="community" className="block h-full">
                <motion.div
                    layout
                    transition={springTransition}
                    className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 h-full backdrop-blur-sm relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01] group-hover:border-pink-600/40"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                            <span className="text-pink-600 font-black text-[9px] uppercase tracking-[0.2em]">
                                {community.creator || "System"}
                            </span>
                            <span className="text-zinc-600 font-mono text-[8px] uppercase tracking-widest mt-0.5">
                                {community.created_at ? new Date(community.created_at).toLocaleDateString() : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {currentUserId === community.user_id && (
                                <button
                                    onClick={(e) => { e.preventDefault(); setIsConfirming(true); }}
                                    className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={13} />
                                </button>
                            )}
                            <div className="p-1.5 bg-white/5 rounded-md border border-white/5 text-zinc-500">
                                <Globe size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg uppercase tracking-tighter mb-2 italic group-hover:text-pink-500 transition-colors">
                            {community.name}
                        </h3>
                        <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2 mb-5">
                            {community.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="flex items-center gap-2 text-pink-600 text-[9px] font-black uppercase tracking-[0.2em]">
                            Enter Community <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}
