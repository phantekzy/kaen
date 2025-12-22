import { Terminal, Cpu, User, ChevronRight } from "lucide-react";

const FEEDBACK_LOGS = [
  {
    user: "phantekzy",
    log: "The UI is dangerously clean. Best signal-to-noise ratio in the dev scene.",
    role: "System Admin",
    featuring: "Core Engine",
  },
  {
    user: "hana_az",
    log: "Finally, a workspace that doesn't feel like a corporate board meeting.",
    role: "Active Member",
    featuring: "Architecture",
  },
  {
    user: "Edward_Ken",
    log: "Fast. Minimal. It just works. The latency is practically non-existent.",
    role: "Kaen Dev",
    featuring: "Performance",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 px-6 max-w-7xl mx-auto border-t border-[#1a1a1b] mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12 justify-start">
        <Terminal className="text-pink-500" size={24} />
        <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">
          Network_Feedback
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEEDBACK_LOGS.map((r, i) => (
          <div
            key={i}
            className="group bg-[#0a0a0b] border border-white/5 rounded-2xl overflow-hidden font-mono hover:border-pink-500/30 transition-all text-left flex flex-col"
          >
            <div className="px-4 py-2 bg-[#161617] border-b border-white/5 flex justify-between items-center">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                log_entry_0{i + 1}.env
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              </div>
            </div>

            <div className="p-8 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6">
                <Cpu size={12} className="text-pink-500" />
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">
                  Featuring: <span className="text-white">{r.featuring}</span>
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-10 group-hover:text-white transition-colors flex-grow italic">
                "{r.log}"
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-pink-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  @{r.user}
                </span>
                <span className="text-[9px] text-gray-500/50 font-bold uppercase flex items-center gap-1">
                  <User size={12} /> {r.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
