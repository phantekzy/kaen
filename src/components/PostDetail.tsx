// Import section
import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

// Props type
interface Props {
  postId: number;
}

// Fetch from supabase
const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Post;
};

// Postdetail section
export const PostDetail = ({ postId }: Props) => {
  // React query
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  // Conditions
  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-pink-600/20 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
          Error : {error.message}
        </div>
      </div>
    );

  // Return section
  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 pt-6 pb-20">
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden">
        {/* Header section with Title */}
        <div className="p-4 md:p-5 pb-2">
          <p className="text-[#818384] text-xs mb-2">
            Posted on : {new Date(data!.created_at).toLocaleDateString()}
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-[#d7dadc] leading-tight">
            {data?.title}
          </h2>
        </div>

        {/* Image section */}
        {data?.image_url && (
          <div className="w-full bg-black border-y border-[#343536]">
            <img
              src={data?.image_url}
              alt={data?.title}
              className="w-full h-auto object-cover block"
            />
          </div>
        )}

        {/* Content section */}
        <div className="p-4 md:p-5">
          <p className="text-[#d7dadc] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {data?.content}
          </p>
        </div>

        {/* Like and dislike buttons  */}
        <div className="px-4 py-2 border-t border-[#343536] bg-[#272729]/50">
          <LikeButton postId={postId} />
        </div>

        {/* Comment section */}
        <div className="p-4 md:p-5 border-t border-[#343536]">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};
