/* Import section */
import type { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
/* context type */
interface AuthContextType {
    user: User | null;
    signInWithGitHub: () => void;
    signOut: () => void;
}
/* Authentificion */
const AuthContext = createContext<AuthContextType | undefined>(undefined)
/* Auth provider */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    /* useState section */
    const [user, setUser] = useState<User | null>(null)
    /* user informations */
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            /* listen to the change authentification */
            const { data: listner } = supabase.auth.onAuthStateChange((_, session) => {
                setUser(session?.user ?? null)
            })
            /* unseubscribe the listener */
            return () => {
                listner.subscription.unsubscribe()
            }

        })
    }, [])
    /* signIn logic */
    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({ provider: "github" })
    }
    /* signOut logic */
    const signOut = () => {
        supabase.auth.signOut()
    }
    /* Return section */
    return <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
        {children}
    </AuthContext.Provider>
}
/* Helper */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("AuthProvider is a must to make the handler work")
    }
    return context
}
