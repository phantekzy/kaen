import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useRef, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    ArrowRight,
    Loader2,
    AlertCircle,
    UploadCloud,
    User,
    ChevronDown,
    Sparkles,
} from "lucide-react";
import { type Community, fetchCommunities } from "./CommunityList";

interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    author: string;
    community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
    const filePath = `posts/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, imageFile);
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

    const { data, error } = await supabase
        .from("posts")
        .insert({
            ...post,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            image_url: publicURLData.publicUrl,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [newPostId, setNewPostId] = useState<number | null>(null);
    const [communityId, setCommunityId] = useState<number | null>(null)

    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: { post: PostInput; imageFile: File }) =>
            createPost(data.post, data.imageFile),
        onSuccess: (data) => {
            setNewPostId(data.id);
            setStatus("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: () => setStatus("error"),
    });

    const { data: communities } = useQuery<Community[], Error>({
        queryKey: ["communities"],
        queryFn: fetchCommunities,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedFile || !title) {
            setStatus("error");
            return;
        }
        mutate({
            post: {
                title,
                content,
                community_id: communityId,
                avatar_url: user?.user_metadata.avatar_url || null,
                author:
                    user?.user_metadata?.user_name ||
                    user?.email?.split("@")[0] ||
                    "User",
            },
            imageFile: selectedFile,
        });
    };

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setCommunityId(value ? Number(value) : null)
    }

    return (
        <div className="w-full">
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
                                <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-white tracking-tighter leading-[0.8] uppercase italic">POST</h2>
                                <h2 className="text-pink-600 text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">BROADCASTED</h2>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => navigate(`/post/${newPostId}`)} className="flex-1 h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-xl">Show Post</button>
                                <button onClick={() => navigate("/posts")} className="flex-1 h-14 bg-zinc-900 text-zinc-400 border border-white/10 font-black uppercase text-[10px] tracking-widest rounded-xl hover:text-white transition-all">Feed</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                className="relative bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl"
            >
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={12} className="text-zinc-600" />
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Broadcasting as <span className="text-white">{user?.user_metadata?.user_name || user?.email?.split("@")[0]}</span>
                            </span>
                        </div>
                        <Sparkles size={14} className="text-pink-600" />
                    </div>

                    <div className="p-6 md:p-10 space-y-8">
                        {/* Title Input with Updated Placeholders */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Entry Title</label>
                            <input
                                required
                                className="w-full bg-white/5 border border-white/10 p-4 text-xl font-bold text-white outline-none rounded-xl focus:border-pink-600 transition-all 
                                placeholder:text-zinc-700 placeholder:text-sm md:placeholder:text-lg placeholder:font-black placeholder:uppercase placeholder:tracking-tighter"
                                placeholder="How should this entry be titled?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Content Input with Updated Placeholders */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Main Content</label>
                            <textarea
                                required
                                className="w-full bg-white/5 border border-white/10 p-4 text-zinc-400 min-h-[250px] outline-none rounded-xl focus:border-pink-600 transition-all resize-none text-sm 
                                placeholder:text-zinc-700 placeholder:text-[10px] md:placeholder:text-sm placeholder:font-bold placeholder:uppercase placeholder:tracking-widest"
                                placeholder="Describe your transmission..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Target Community</label>
                            <div className="relative group">
                                <select
                                    onChange={handleCommunityChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold text-zinc-400 outline-none rounded-xl focus:border-pink-600 focus:text-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900 text-zinc-500">NO COMMUNITY</option>
                                    {communities?.map((community) => (
                                        <option key={community.id} value={community.id} className="bg-zinc-900 text-white">
                                            {community.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-pink-600 transition-colors">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Attachment</label>
                            <motion.div
                                whileHover={{ scale: 0.99 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[21/9] bg-black/40 border border-white/5 rounded-xl relative group cursor-pointer overflow-hidden flex items-center justify-center transition-all hover:border-pink-600/50"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center space-y-2">
                                        <UploadCloud size={24} className="mx-auto text-zinc-700 group-hover:text-pink-600 transition-colors" />
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Select Header Image</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="min-h-[20px]">
                                <AnimatePresence>
                                    {status === "error" && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-pink-600 text-[10px] font-bold uppercase italic">
                                            <AlertCircle size={14} /> Fields Required
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isPending || !user}
                                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPending || !user ? "bg-zinc-800 text-zinc-500" : "bg-white text-black hover:bg-pink-600 hover:text-white shadow-lg shadow-pink-600/10"}`}
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <>Publish Entry <ArrowRight size={14} /></>}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
