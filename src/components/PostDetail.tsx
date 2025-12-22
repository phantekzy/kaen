import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { Pencil, Trash2, X, Check } from "lucide-react";
import type { Post } from "./PostList";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("posts")
        .update({ title: editTitle, content: editContent })
        .eq("id", postId)
        .eq("user_id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-pink-600/20 border-t-pink-600 animate-spin rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error.message}
      </div>
    );

  const isOwner = user?.id === data?.user_id;

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 pt-6 pb-20">
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden shadow-2xl">
        {/* OWNER TOOLBAR */}
        {isOwner && (
          <div className="flex justify-end items-center gap-2 px-4 py-2 bg-black/40 border-b border-[#343536]">
            {!isEditing ? (
              <>
                {!isConfirmingDelete ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditTitle(data!.title);
                        setEditContent(data!.content);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">
                      Are you sure?
                    </span>
                    <button
                      onClick={() => deletePost()}
                      disabled={isDeleting}
                      className="bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      className="text-gray-500 hover:text-white p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 text-xs font-bold uppercase hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePost()}
                  disabled={isUpdating}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-lg"
                >
                  <Check size={14} />{" "}
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="p-4 md:p-5 pb-2">
          <p className="text-[#818384] text-xs mb-2">
            Posted on: {new Date(data!.created_at).toLocaleDateString()}
          </p>
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg p-3 text-xl font-bold text-white outline-none focus:border-pink-500"
            />
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-[#d7dadc] leading-tight">
              {data?.title}
            </h2>
          )}
        </div>

        {/* IMAGE SECTION */}
        {data?.image_url && (
          <div className="w-full bg-black border-y border-[#343536]">
            <img
              src={data.image_url}
              alt={data.title}
              className={`w-full h-auto object-cover block transition-opacity duration-300 ${
                isEditing ? "opacity-40" : "opacity-100"
              }`}
            />
          </div>
        )}

        {/* CONTENT SECTION */}
        <div className="p-4 md:p-5">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={12}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg p-3 text-[#d7dadc] outline-none focus:border-pink-500 resize-none text-sm md:text-base leading-relaxed"
            />
          ) : (
            <p className="text-[#d7dadc] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {data?.content}
            </p>
          )}
        </div>

        {/* LIKE BUTTON SECTION */}
        <div className="px-4 py-2 border-t border-[#343536] bg-[#272729]/50">
          <LikeButton postId={postId} />
        </div>

        {/* COMMENTS SECTION */}
        <div className="p-4 md:p-5 border-t border-[#343536]">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};
