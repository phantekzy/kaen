/* Import section */
import { CreatePost } from "../components/CreatePost";

/* Create post page */
export const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <h1 className="text-6xl font-bold mb-6 text-center bg-gradient">
        Create a new Post</h1>
      <CreatePost />
    </div>
  );
};
    