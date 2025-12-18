/* Import section */
import { useMutation } from "@tanstack/react-query"
import React, { useState, type ReactEventHandler } from "react"
import { supabase } from "../supabase-client";

interface PostInput {
    title: string;
    content: string;
}

const createPost = async (post: PostInput) => {
    const { } = await supabase
        .from('posts')
        .insert(post)
}



/* Create post section */
export const CreatePost = () => {
    /* State */
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    /* React query  */
    const { } = useMutation({ mutationFn: createPost })
    /* Submit helper */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }
    return <form>
        {/* Title */}
        <div>
            <label>Title</label>
            <input
                type="text"
                id="title"
                required
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        {/* Content */}
        <div>
            <label>Content</label>
            <textarea id="content" required rows={5}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
        {/* Button */}
        <button type="submit">Create Post</button>
    </form>
}
