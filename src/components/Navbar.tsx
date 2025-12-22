import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Menu,
  X,
  Search,
  Plus,
  LogOut,
  LayoutGrid,
  Users,
  Bell,
  Home,
  Command,
  Github,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const { signInWithGitHub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  const navLinks = [
    { name: "Home", link: "/", icon: <Home size={18} /> },
    { name: "Feed", link: "/posts", icon: <LayoutGrid size={18} /> },
    { name: "Communities", link: "/forums", icon: <Users size={18} /> },
  ];

  return (
    <>
      {/* --- DESKTOP NAVIGATION --- */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 h-20 hidden md:flex items-center justify-center px-6"
      >
        <div className="w-full max-w-[1440px] flex items-center justify-between bg-[#1a1a1b]/80 backdrop-blur-xl border border-[#343536] h-14 rounded-2xl px-5 shadow-2xl">
          {/* LOGO SECTION */}
          <Link
            className="group flex flex-row items-center gap-3 font-sans"
            to={"/"}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-400 to-pink-600 blur opacity-20 group-hover:opacity-60 transition duration-500" />
              <img
                src="/logo.png"
                alt="Logo"
                className="relative rounded-lg w-[38px] h-[38px] object-cover border border-white/10 bg-black"
              />
            </div>
            <div className="flex flex-col leading-none">
              <p className="text-white text-lg font-bold tracking-tighter">
                K<span className="text-pink-600">ae</span>n
              </p>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest group-hover:text-pink-600 transition-colors">
                Community
              </span>
            </div>
          </Link>

          {/* NAV CENTER */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-[#343536]/50">
            {navLinks.map(({ name, link, icon }) => {
              const isActive = location.pathname === link;
              return (
                <Link
                  key={name}
                  to={link}
                  className="relative px-4 py-1.5 flex items-center gap-2 group"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 bg-[#272729] border border-[#343536] rounded-lg shadow-inner"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive
                        ? "text-pink-500"
                        : "text-[#818384] group-hover:text-white"
                    }`}
                  >
                    {icon}
                  </span>
                  <span
                    className={`relative z-10 text-[12px] font-bold tracking-tight transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#818384] group-hover:text-white"
                    }`}
                  >
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* SEARCH AMD SIGN-IN */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center bg-black/40 border transition-all duration-300 rounded-xl px-3 h-9 ${
                isSearchFocused
                  ? "w-64 border-pink-500/50 shadow-lg"
                  : "w-44 border-[#343536]"
              }`}
            >
              <Search
                size={14}
                className={isSearchFocused ? "text-pink-500" : "text-[#818384]"}
              />
              <input
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[13px] text-white ml-2 w-full placeholder-[#474748] font-sans"
              />
            </div>

            <div className="h-6 w-[1px] bg-[#343536]" />

            {user ? (
              <div className="relative group">
                <img
                  src={user.user_metadata.avatar_url}
                  className="w-9 h-9 rounded-xl border border-[#343536] cursor-pointer hover:border-pink-500 transition-colors"
                  alt=""
                />
                <div className="absolute right-0 top-full pt-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 origin-top-right">
                  <div className="bg-[#1a1a1b] border border-[#343536] w-52 rounded-2xl shadow-2xl overflow-hidden p-2">
                    <div className="p-3 bg-black/40 rounded-xl mb-1 border border-[#343536]/30">
                      <p className="text-[10px] text-pink-500 font-bold uppercase mb-1 tracking-widest">
                        Active Now
                      </p>
                      <p className="text-sm font-bold text-[#d7dadc] truncate font-sans">
                        {displayName}
                      </p>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-sans"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* SIGN IN BUTTON */
              <button
                onClick={signInWithGitHub}
                className="group relative flex items-center gap-2 px-5 h-9 rounded-xl bg-[#272729] border border-[#343536] hover:border-pink-500/50 transition-all active:scale-95 shadow-lg"
              >
                <Github
                  size={16}
                  className="text-[#818384] group-hover:text-white transition-colors"
                />
                <span className="text-[12px] font-bold text-[#d7dadc] group-hover:text-white transition-colors uppercase tracking-tight font-sans">
                  Connect
                </span>
                <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* --- MOBILE: BOTTOM DOCK --- */}
      <div className="md:hidden fixed bottom-6 inset-x-4 z-50">
        <div className="bg-[#1a1a1b]/95 backdrop-blur-2xl border border-[#343536] h-16 rounded-[20px] flex items-center justify-around px-2 shadow-2xl">
          {navLinks.map(({ name, link, icon }) => {
            const isActive = location.pathname === link;
            return (
              <Link
                key={name}
                to={link}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? "text-pink-500" : "text-[#818384]"
                }`}
              >
                {icon}
                <span className="text-[10px] font-bold tracking-tight">
                  {name}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-[#818384]"
          >
            <Menu size={18} />
            <span className="text-[10px] font-bold tracking-tight">More</span>
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 h-[55vh] bg-[#1a1a1b] border-t border-[#343536] z-[70] rounded-t-[32px] p-8 flex flex-col font-sans shadow-2xl shadow-pink-500/5"
            >
              <div className="w-12 h-1 bg-[#343536] rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-4 mb-10">
                <img
                  src={user?.user_metadata.avatar_url || "/logo.png"}
                  className="w-14 h-14 rounded-2xl border border-[#343536]"
                  alt=""
                />
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {displayName || "Guest"}
                  </h3>
                  <p className="text-pink-600 font-bold text-xs uppercase tracking-[0.2em]">
                    Network
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/create"
                  className="bg-[#272729] p-4 rounded-2xl flex flex-col gap-2 border border-[#343536]"
                >
                  <Plus className="text-pink-500" />
                  <span className="font-bold text-white">Create Post</span>
                </Link>
                <button
                  onClick={user ? signOut : signInWithGitHub}
                  className="bg-[#272729] p-4 rounded-2xl flex flex-col gap-2 border border-[#343536]"
                >
                  <LogOut className="text-red-500" />
                  <span className="font-bold text-white">
                    {user ? "Logout" : "Connect"}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
