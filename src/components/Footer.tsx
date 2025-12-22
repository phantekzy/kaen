// Import section
import { Link } from "react-router";
import {
  Github,
  Twitter,
  Terminal,
  Globe,
  ChevronRight,
  Cpu,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-12 pb-15 sm:pb-8 px-6 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Block */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
              <span className="text-white font-black tracking-tighter uppercase text-sm">
                Kaen
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-medium uppercase tracking-tight">
              Engineering high-fidelity digital systems and decentralized
              software architectures.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/[0.03] border border-white/5 rounded text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Cpu size={10} /> Imainiginations
              </span>
              <span className="px-2 py-1 bg-white/[0.03] border border-white/5 rounded text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                phantekzy
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="space-y-5">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal size={12} /> Directory
            </p>
            <nav className="flex flex-col gap-3">
              {["Home", "Posts", "Communities"].map((link) => (
                <Link
                  key={link}
                  to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-all text-sm font-bold uppercase tracking-tighter flex items-center group w-fit"
                >
                  <ChevronRight
                    size={14}
                    className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-pink-500 mr-1"
                  />
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* External Links */}
          <div className="space-y-5">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe size={12} /> External
            </p>
            <div className="flex flex-col gap-3">
              {[
                { name: "Github", icon: <Github size={14} /> },
                { name: "X / Twitter", icon: <Twitter size={14} /> },
                { name: "Linkedin", icon: <Linkedin size={14} /> },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="text-gray-400 hover:text-white transition-all text-sm font-bold uppercase tracking-tighter flex items-center group w-fit"
                >
                  <ChevronRight
                    size={14}
                    className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-pink-500 mr-1"
                  />
                  <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {social.icon}
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p className="text-[11px] text-white font-black uppercase tracking-[0.2em]">
              Created by Imainiginations Software
            </p>
            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.1em]">
              All rights reserved &copy; 2025
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-gray-800 tracking-[0.5em] uppercase hidden sm:block">
              Encrypted_Auth
            </span>
            <div className="w-8 h-px bg-white/5" />
            <span className="text-[10px] font-mono text-pink-500 font-bold uppercase">
              v1.0.42
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
