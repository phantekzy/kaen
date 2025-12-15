/* Import section */
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { Menu, X, ChevronRight, Github } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

/* Navigation bar links */
const navLinks = [
    { name: "Home", link: "/" },
    { name: "Create Post", link: "/create" },
    { name: "Forums", link: "/forums" },
    { name: "Create Forum", link: "/forum/create" },
]

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const { signInWithGitHub, signOut, user } = useAuth()
    const displayName = user?.user_metadata.user_name || user?.email
    /* Handle scroll effect */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    /* Close mobile menu on route change */
    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Section */}
                    <Link
                        className="group flex flex-row items-center justify-center gap-3 font-mono text-xl font-bold text-white"
                        to={"/"}
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                            <img
                                src="/logo.png"
                                alt="Logo"
                                width={45}
                                height={45}
                                className="relative rounded-lg w-[45px] h-[45px] object-cover border border-white/10 bg-black"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <p className="tracking-tighter text-lg">
                                K<span className="text-blue-400">ae</span>n
                            </p>
                            <span className="text-[10px] text-gray-500 font-normal uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                                Community
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                        {navLinks.map(({ name, link }) => {
                            const isActive = location.pathname === link
                            return (
                                <Link
                                    key={name}
                                    to={link}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}>
                                        {name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs text-blue-400 font-medium">Online</p>
                                    <p className="text-sm text-gray-200 font-medium max-w-[100px] truncate">
                                        {displayName}
                                    </p>
                                </div>
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
                                    {user.user_metadata.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="User"
                                            className="relative w-10 h-10 rounded-full object-cover border-2 border-black"
                                        />
                                    ) : (
                                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-black" />
                                    )}

                                </div>
                                <button
                                    onClick={signOut}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                    title="Sign Out"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={signInWithGitHub}
                                className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium text-white transition-all duration-300 bg-white/5 rounded-full hover:bg-white/10 border border-white/10 hover:border-blue-500/50"
                            >
                                <Github size={18} />
                                <span>Sign In</span>
                                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-blue-500/50 transition-all duration-300" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        {user && (
                            <img
                                src={user.user_metadata.avatar_url || "/default-avatar.png"}
                                alt="User"
                                className="w-8 h-8 rounded-full border border-white/20"
                            />
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-gray-300 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {navLinks.map(({ name, link }, i) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={link}
                                        className={`flex items-center justify-between p-4 rounded-xl transition-all ${location.pathname === link
                                            ? "bg-blue-600/10 border border-blue-500/30 text-blue-400"
                                            : "bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10"
                                            }`}
                                    >
                                        <span className="font-medium">{name}</span>
                                        {location.pathname === link && <ChevronRight size={16} />}
                                    </Link>
                                </motion.div>
                            ))}

                            {!user && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={signInWithGitHub}
                                    className="w-full mt-4 flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
                                >
                                    <Github size={20} />
                                    Sign In with GitHub
                                </motion.button>
                            )}

                            {user && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={signOut}
                                    className="w-full mt-2 p-4 text-center text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
                                >
                                    Sign Out
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
