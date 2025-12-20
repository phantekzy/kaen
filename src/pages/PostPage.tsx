// Import section
import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";
// Post page section
export const PostPage = () => {
  // useParams
  const{id} = useParams<{id:string}>()   
  return (
    <div className="pt-10">
      <PostDetail postId={Number(id)} />
    </div>
  );
};
