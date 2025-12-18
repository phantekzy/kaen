/* Import section */
import { useMutation } from "@tanstack/react-query";
import React, { useState, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

/* Create post section */
export const CreatePost = () => {
  /* States */
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /* React query  */
  const { mutate } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  /* Submit helper */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({ post: { title, content }, imageFile: selectedFile });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto space-y-8 bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Create <span className="text-pink-500">New Post</span>
        </h2>

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            Title
          </label>
          <input
            className="w-full bg-black/60 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white p-3.5 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-600"
            type="text"
            id="title"
            placeholder="Enter a descriptive title..."
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            Content
          </label>
          <textarea
            id="content"
            required
            rows={6}
            placeholder="Write your technical insight here..."
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-black/60 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white p-3.5 rounded-xl outline-none transition-all duration-300 resize-none placeholder:text-gray-600"
          />
        </div>

        {/* Upload image */}
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            Media
          </label>
          <div className="relative group">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2.5 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-pink-600 file:text-white
                hover:file:bg-pink-500
                cursor-pointer transition-all file:transition-colors"
            />
          </div>
        </div>

        {/* Button Section */}
        <div className="pt-6">
          <button
            type="submit"
            className="group relative w-full inline-flex items-center justify-center 
                       px-8 py-4 text-lg font-bold text-white 
                       rounded-full transition-all duration-500 ease-in-out 
                       bg-pink-600 hover:bg-pink-500 overflow-hidden shadow-xl shadow-pink-900/20"
          >
            {/* The Pink/Rose Gradient Layer */}
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></span>

            <span className="relative z-10 tracking-wide">Publish Post</span>

            {/* The "Shine" Animation Layer */}
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-20 rotate-12 group-hover:-translate-x-[600px]"></span>
          </button>
        </div>
      </form>
    </div>
  );
};
