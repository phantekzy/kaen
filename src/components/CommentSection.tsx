// Import section
import React, { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";

// Types
interface Props {
  postID: number;
}

// New comment type
interface newComment {
  content: string;
  parent_comment_id?: number | null;
}

// Create comments function
const createComment = async (
  newComment: newComment,
  postId: number,
  userId: string,
  author: string
) => {};

// Commentary section
export const CommentSection = ({ postID }: Props) => {
  //   States
  const [newCommentText, setNewCommentText] = useState<string>("");
  //   user Authentification
  const { user } = useAuth();
  //   useMutation
  const {} = useMutation({
    mutationFn: (newComment) => createComment(),
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    // Mutation function
    mutate({
      content: newCommentText,
      parent_comment_id: null,
    });
  };

  return (
    <div>
      <h3>Comments</h3>
      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write a comment"
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button type="submit" disabled={!newCommentText}>
            Post comment
          </button>
        </form>
      ) : (
        <p>You must be logged in to be able to comment</p>
      )}
    </div>
  );
};
