import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <motion.div className="w-full relative bg-black">
      {/* TOP SHUTTER PANEL */}
      <motion.div
        initial={{ height: "0%" }}
        animate={{ height: "0%" }}
        exit={{ height: "50%" }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] bg-[#050505] border-b border-pink-600/50 flex items-end justify-center overflow-hidden"
      >
        <div className="mb-2 text-[10px] uppercase tracking-[1em] text-pink-600/30 font-mono">
          Closing_Aperture
        </div>
      </motion.div>

      {/* BOTTOM SHUTTER PANEL */}
      <motion.div
        initial={{ height: "0%" }}
        animate={{ height: "0%" }}
        exit={{ height: "50%" }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050505] border-t border-pink-600/50 flex items-start justify-center overflow-hidden"
      >
        <div className="mt-2 text-[10px] uppercase tracking-[1em] text-pink-600/30 font-mono">
          Syncing_Kaen
        </div>
      </motion.div>

      {/* REVEAL LAYER (The one that opens up) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.1 }}
      >
        {/* Actual Content  */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RootLayout;
