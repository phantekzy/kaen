/* Import section */
import { useMutation } from "@tanstack/react-query";
import React, { useState, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

// postInput type
interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
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

  const { mutate, isPending, isError } = useMutation({
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
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
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
        {/* Header - Sharp Corners */}
        <div className="p-4 sm:p-6 border-b border-[#343536]">
          <h2 className="text-[#d7dadc] font-bold text-lg sm:text-xl tracking-tight">
            Create <span className="text-pink-600">New Post</span>
          </h2>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Title
            </label>
            <input
              className="w-full bg-[#1a1a1b] border border-[#343536] text-[#d7dadc] p-3 rounded outline-none focus:border-[#d7dadc] transition-colors text-base font-semibold placeholder:text-[#474748]"
              type="text"
              required
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Content
            </label>
            <textarea
              required
              rows={8}
              value={content}
              placeholder="Text (optional)"
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#1a1a1b] border border-[#343536] text-[#d7dadc] p-3 rounded outline-none focus:border-[#d7dadc] transition-colors text-sm sm:text-base leading-relaxed resize-none placeholder:text-[#474748]"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <label className="text-[#818384] text-[10px] font-bold uppercase tracking-widest ml-0.5">
              Featured Media
            </label>
            <div className="relative border border-[#343536] rounded p-6 sm:p-10 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <p className="text-pink-600 font-bold text-xs sm:text-sm break-all">
                  {selectedFile ? selectedFile.name : "Select Image to Upload"}
                </p>
                {!selectedFile && (
                  <p className="text-[#818384] text-[10px] mt-1 uppercase">
                    JPG, PNG or GIF
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Section  */}
        <div className="p-4 sm:p-6 bg-[#272729]/30 border-t border-[#343536] flex justify-end">
          <button
            type="submit"
            disabled={isPending || !title || !selectedFile}
            className={`px-8 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95
                ${
                  isPending
                    ? "bg-[#343536] text-[#818384] cursor-not-allowed"
                    : "bg-[#d7dadc] text-black hover:bg-white shadow-md shadow-black/20"
                }`}
          >
            {isPending ? "POSTING..." : "POST"}
          </button>
        </div>

        {/* Error Message */}
        {isError && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">
            Error: Please try again
          </div>
        )}
      </form>
    </div>
  );
};
