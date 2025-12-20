// Import section
import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";

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
  //  React query
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  //  Conditions
  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-pink-600/20 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
        Error : {error.message}
      </div>
    );

  //   Return section
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-20">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header section with Title */}
        <div className="p-8 md:p-12 pb-0">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-6 leading-tight">
            {data?.title}
          </h2>

          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">
            Posted on : {new Date(data!.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Image section */}
        {data?.image_url && (
          <div className="px-8 md:px-12">
            <img
              src={data?.image_url}
              alt={data?.title}
              className="w-full h-auto rounded-3xl border border-white/10 object-cover shadow-2xl"
            />
          </div>
        )}

        {/* Content section */}
        <div className="p-8 md:p-12">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {data?.content}
          </p>
        </div>

        {/* Shine Decor */}
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-30" />
      </div>
    </div>
  );
};
