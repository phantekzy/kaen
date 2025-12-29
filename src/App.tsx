/* Import section */
import { Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { Posts } from "./pages/Posts";
import { PostPage } from "./pages/PostPage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import RootLayout from "./components/RootLayout";
import { SelectCreation } from "./pages/SelectCreation";

import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";

/* App section */
function App() {
    const location = useLocation();

    /* Return section */
    return (
        <div className="min-h-screen bg-black text-gray-100 pt-20">
            <Navbar />
            <ScrollToTop />
            <ScrollProgress />
            <main className="container mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route
                            path="/"
                            element={
                                <RootLayout>
                                    <Home />
                                </RootLayout>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <RootLayout>
                                    <SelectCreation />
                                </RootLayout>
                            }
                        />
                        <Route
                            path="/create-post"
                            element={
                                <RootLayout>
                                    <CreatePostPage />
                                </RootLayout>
                            }
                        />
                        <Route
                            path="/posts"
                            element={
                                <RootLayout>
                                    <Posts />
                                </RootLayout>
                            }
                        />
                        {/* COMMUNITY ROUTES UPDATED TO USE PAGES */}
                        <Route
                            path="/create-community"
                            element={
                                <RootLayout>
                                    <CreateCommunityPage />
                                </RootLayout>
                            }
                        />
                        <Route
                            path="/communities"
                            element={
                                <RootLayout>
                                    <CommunitiesPage />
                                </RootLayout>
                            }
                        />

                        <Route
                            path="/post/:id"
                            element={
                                <RootLayout>
                                    <PostPage />
                                </RootLayout>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}

export default App;
