import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { MessageSquareOff } from "lucide-react";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  user_id: string;
  author: string;
  avatar_url?: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
};

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

  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-2 w-full py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-[#1a1a1b] border border-[#343536] p-10 rounded-xl w-full">
          <MessageSquareOff size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#d7dadc]">No posts yet</h3>
          <p className="text-gray-500 mt-2">
            Be the first one to share something with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 w-full">
      <div className="flex flex-col gap-2 sm:gap-3">
        {data.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
