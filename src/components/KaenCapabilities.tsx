// Import section
import { Share2, MessageSquare, Code2, ShieldCheck } from "lucide-react";

// Kean capabilities
const KaenCapabilities = () => {
  const protocols = [
    {
      id: "01",
      title: "Knowledge Exchange",
      action: "Broadcast Intelligence",
      description:
        "Inject technical insights directly into the system. Document architectures, logic flows, and framework breakthroughs.",
      icon: <Share2 size={18} />,
    },
    {
      id: "02",
      title: "System Commentary",
      action: "Peer Review",
      description:
        "Engage in brutalist, high-fidelity feedback. Audit code and refine logic with other verified engineers.",
      icon: <MessageSquare size={18} />,
    },
    {
      id: "03",
      title: "Source Injection",
      action: "Code Sharing",
      description:
        "Post raw snippets and system configurations. Let the collective optimize your syntax for maximum efficiency.",
      icon: <Code2 size={18} />,
    },
    {
      id: "04",
      title: "Reputation Status",
      action: "Earn Authority",
      description:
        "Your standing is built on signal value. Contribute high-level intelligence to unlock deeper system access.",
      icon: <ShieldCheck size={18} />,
    },
  ];

  return (
    <section className="pt-2 pb-12 sm:py-20 px-6 max-w-7xl mx-auto font-mono">
      <div className="flex flex-col gap-2 mb-10 sm:mb-16 border-l-2 border-pink-500 pl-6">
        <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">
          Engineered by Imainiginations
        </span>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          {/* UPDATED: Kean -> Kaen */}
          What is <span className="text-pink-500 text-5xl">Kaen</span> for?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {protocols.map((f) => (
          <div
            key={f.id}
            className="group bg-[#0a0a0b] border border-white/5 p-8 rounded-2xl hover:border-pink-500/40 transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-white/[0.03] rounded-xl text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                {f.icon}
              </div>
              <span className="text-[10px] text-gray-800 font-black">
                {f.id}
              </span>
            </div>

            <div className="mb-3">
              <span className="text-[9px] text-pink-500/70 font-bold uppercase tracking-widest">
                {f.action}_
              </span>
              <h3 className="text-white font-black uppercase text-base tracking-tight group-hover:translate-x-1 transition-transform">
                {f.title}
              </h3>
            </div>

            <p className="text-gray-500 text-[11px] leading-relaxed uppercase tracking-tighter group-hover:text-gray-300 transition-colors">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KaenCapabilities;
