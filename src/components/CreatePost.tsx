import { useMutation } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
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
  X,
} from "lucide-react";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  author: string;
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
        avatar_url: user?.user_metadata.avatar_url || null,
        author:
          user?.user_metadata?.user_name ||
          user?.email?.split("@")[0] ||
          "User",
      },
      imageFile: selectedFile,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      {/* Alert section */}
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
              className="text-center space-y-6 max-w-lg"
            >
              <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(219,39,119,0.3)]">
                <Check size={36} className="text-white" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Transmission Complete
                </h2>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em]">
                  Broadcasted to the network
                </p>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => navigate(`/post/${newPostId}`)}
                  className="flex-1 h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pink-600 hover:text-white transition-all"
                >
                  Show Post
                </button>
                <button
                  onClick={() => navigate("/posts")}
                  className="flex-1 h-14 bg-zinc-900 text-zinc-400 border border-white/10 font-black uppercase text-[10px] tracking-widest rounded-xl hover:text-white transition-all"
                >
                  Feed
                </button>
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
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={12} className="text-zinc-600" />
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Post as{" "}
                <span className="text-white">
                  {user?.user_metadata?.user_name || user?.email?.split("@")[0]}
                </span>
              </span>
            </div>
          </div>

          {/* Media Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[21/9] bg-black/40 border-b border-white/5 relative group cursor-pointer overflow-hidden flex items-center justify-center"
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
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">
                    Change Media
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-2">
                <UploadCloud
                  size={24}
                  className="mx-auto text-zinc-700 group-hover:text-pink-600 transition-colors"
                />
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  Select Header Image
                </p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-10 space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">
                Entry Title
              </label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-xl font-bold text-white outline-none rounded-xl focus:border-pink-600 transition-all placeholder:text-zinc-600 placeholder:font-medium placeholder:text-base"
                placeholder="How should this entry be titled?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">
                Main Content
              </label>
              <textarea
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-zinc-400 min-h-[250px] outline-none rounded-xl focus:border-pink-600 transition-all resize-none text-sm placeholder:text-zinc-600 placeholder:text-sm"
                placeholder="Describe your transmission..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="min-h-[20px]">
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-pink-600 text-[10px] font-bold uppercase italic"
                    >
                      <AlertCircle size={14} /> Fields Required
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isPending || !user}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${
                    isPending || !user
                      ? "bg-zinc-800 text-zinc-500"
                      : "bg-white text-black hover:bg-pink-600 hover:text-white"
                  }`}
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    Publish Entry <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
