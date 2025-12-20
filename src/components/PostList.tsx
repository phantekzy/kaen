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
      <div className="text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
        Error : {error.message}
      </div>
    );

  // Return section
  return (
    <div className="flex flex-col gap-4">
      {data?.map((post, key) => (
        <PostItem key={key} post={post} />
      ))}
    </div>
  );
};
