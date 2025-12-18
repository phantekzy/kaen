/* Import section */
import { useMutation } from "@tanstack/react-query"
import React, { useState, type ChangeEvent } from "react"
import { supabase } from "../supabase-client";

interface PostInput {
    title: string;
    content: string;
}
const createPost = async (post: PostInput, imageFile: File) => {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`

    const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message)

    const { data: publicURLData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath)

    const { data, error } = await supabase
        .from('posts')
        .insert({ ...post, image_url: publicURLData.publicUrl })

    if (error) throw new Error(error.message)

    return data
}

/* Create post section */
export const CreatePost = () => {
    /* States */
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    /* React query  */
    const { mutate } = useMutation({
        mutationFn: (data: { post: PostInput, imageFile: File }) => {
            return createPost(data.post, data.imageFile)
        }
    })

    /* Submit helper */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) return
        mutate({ post: { title, content }, imageFile: selectedFile })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    return <form onSubmit={handleSubmit}>
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
        {/* Upload image */}
        <div>
            <label>Upload image</label>
            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
        {/* Button */}
        <button type="submit">Create Post</button>
    </form>
}
