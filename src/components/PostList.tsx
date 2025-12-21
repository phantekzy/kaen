// Import section
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

// Post type
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
}

// fetching the posts from supabase
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
};

// Postlist section
export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-pink-600/20 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto px-2 w-full">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-md border border-red-500/20 text-sm font-bold uppercase tracking-tight">
          Error : {error.message}
        </div>
      </div>
    );

  // Return section
  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 w-full">
      {/* Container for the feed items */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {data?.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* End of feed indicator */}
      {data && data.length > 0 && (
        <div className="py-10 text-center">
          <div className="inline-block w-1.5 h-1.5 rounded-full bg-[#343536] mx-1"></div>
          <div className="inline-block w-1.5 h-1.5 rounded-full bg-[#343536] mx-1"></div>
          <div className="inline-block w-1.5 h-1.5 rounded-full bg-[#343536] mx-1"></div>
        </div>
      )}
    </div>
  );
};
