/* Import section */
import { useMutation } from "@tanstack/react-query";
import React, { useState, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  author: string;
}

// createPost function
const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase.from("posts").insert({
    ...post,
    user_id: (await supabase.auth.getUser()).data.user?.id,
    image_url: publicURLData.publicUrl,
  });

  if (error) throw new Error(error.message);

  return data;
};

// CreatePost component
export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedFile) return;

    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        author:
          user?.user_metadata?.user_name ||
          user?.email?.split("@")[0] ||
          "kaen_user",
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden shadow-2xl transition-all"
      >
        <div className="p-4 sm:p-6 border-b border-[#343536]">
          <h2 className="text-[#d7dadc] font-bold text-lg sm:text-xl tracking-tight">
            Create <span className="text-pink-600">New Post</span>
          </h2>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Title
            </label>
            <input
              className="w-full bg-[#1a1a1b] border border-[#343536] text-[#d7dadc] p-3 rounded outline-none focus:border-[#d7dadc] transition-colors text-base font-semibold placeholder:text-[#474748] disabled:opacity-50"
              type="text"
              required
              disabled={!user}
              value={title}
              placeholder={user ? "Title" : "Please login to write a title"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Content
            </label>
            <textarea
              required
              disabled={!user}
              rows={8}
              value={content}
              placeholder={
                user ? "Text (optional)" : "Please login to write content"
              }
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#1a1a1b] border border-[#343536] text-[#d7dadc] p-3 rounded outline-none focus:border-[#d7dadc] transition-colors text-sm sm:text-base leading-relaxed resize-none placeholder:text-[#474748] disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Featured Media
            </label>
            <div
              className={`relative border border-[#343536] rounded p-6 sm:p-10 flex flex-col items-center justify-center bg-black/20 transition-all ${
                user
                  ? "hover:bg-black/40 cursor-pointer group"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                required
                disabled={!user}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="text-center">
                <p className="text-pink-600 font-bold text-xs sm:text-sm break-all">
                  {selectedFile
                    ? selectedFile.name
                    : user
                    ? "Select Image to Upload"
                    : "Upload disabled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#272729]/30 border-t border-[#343536] flex justify-end">
          <button
            type="submit"
            disabled={isPending || !title || !selectedFile || !user}
            className={`px-8 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95
                ${
                  isPending || !user
                    ? "bg-[#343536] text-[#818384] cursor-not-allowed"
                    : "bg-[#d7dadc] text-black hover:bg-white shadow-md shadow-black/20"
                }`}
          >
            {isPending ? "POSTING..." : "POST"}
          </button>
        </div>
      </form>
    </div>
  );
};
