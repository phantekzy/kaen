/* Import section */
import { Route, Routes } from "react-router"
import { Home } from "./pages/Home"
import { Navbar } from "./components/Navbar"
import { CreatePostPage } from "./pages/CreatePostPage"
/* App function  */
function App() {
    return (
        <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
            {/* Navigation bar */}
            <Navbar />
            {/* Home page */}
            <div className="container mx-auto px-4 py-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreatePostPage />} />
                </Routes>
            </div>
        </div>
    )
}
/* Export section */
export default App
