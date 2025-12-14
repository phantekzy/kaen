/* Import section */
import { useState } from "react"
import { Link } from "react-router"
import { Menu, X } from "lucide-react"

/* Navigation bar links */
const navLinks = [
    { name: "Home", link: "/" },
    { name: "Create Post", link: "/create" },
    { name: "Forums", link: "/forums" },
    { name: "Create Forum", link: "/forum/create" },
]

/* Navigation bar */
export const Navbar = () => {
    /* use state section */
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev)
    }

    return (
        // The main nav bar is fixed at the top
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link
                        className="flex flex-row items-center justify-center font-mono text-xl font-bold text-white"
                        to={"/"}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo image"
                            width={55}
                            height={55}
                            className="w-[55] h-[55]"
                        />
                        <p className="pt-2">
                            K<span className="text-blue-400">ae</span>n
                        </p>
                    </Link>

                    {/* Desktop navigation bar */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map(({ name, link }) => (
                            <Link
                                key={name}
                                to={link}
                                className="text-gray-300 hover:text-blue-400 transition-colors"
                            >
                                {name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            className="text-gray-300 focus:outline-none hover:text-blue-400 transition-colors"
                            onClick={toggleMenu}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile navigation bar */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-max-height duration-500 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'
                    } absolute w-full bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-white/10`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map(({ name, link }) => (
                        <Link
                            key={name}
                            to={link}
                            onClick={toggleMenu}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-colors"
                        >
                            {name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
