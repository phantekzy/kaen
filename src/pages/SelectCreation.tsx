import { motion } from "framer-motion";
import { Plus, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export const SelectCreation = () => {
  const navigate = useNavigate();

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 1,
  } as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: springTransition },
  };

  const cards = [
    {
      title: "Create Post",
      author: "Content",
      description:
        "Share your latest updates, images, and thoughts with the community.",
      icon: <Plus size={10} />,
      path: "/create-post",
    },
    {
      title: "Create Community",
      author: "Infrastructure",
      description:
        "Start a new space to gather people around a specific topic or interest.",
      icon: <Users size={10} />,
      path: "/create-community",
    },
  ];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 bg-black overflow-hidden">
      {/* Title section  */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springTransition}
        className="text-center mb-16 md:mb-24"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white tracking-tighter uppercase italic leading-tight relative"
          whileHover={{ skewX: -5 }}
        >
          Create <span className="text-pink-600">.</span>
          {/* Subtle underline animation */}
          <motion.div
            className="absolute -bottom-2 left-0 h-1 bg-pink-600/30 w-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"
      >
        {cards.map((item) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="group relative h-full w-full"
            onClick={() => navigate(item.path)}
          >
            <motion.div
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-900/30 border border-white/5 overflow-hidden rounded-2xl h-full backdrop-blur-sm p-8 cursor-pointer group-hover:border-pink-600/50 group-hover:bg-zinc-900/50 transition-colors duration-500"
            >
              {/* Top Bar  */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
                  <span className="text-[10px] font-mono text-pink-600 uppercase font-bold tracking-[0.2em]">
                    {item.author}
                  </span>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowRight
                    size={14}
                    className="text-zinc-600 group-hover:text-white transition-colors"
                  />
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-2xl md:text-3xl lg:text-4xl mb-4 tracking-tighter uppercase leading-tight group-hover:text-pink-500 transition-colors italic">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium mb-10 group-hover:text-zinc-300 transition-colors">
                {item.description}
              </p>

              {/* Action Pill */}
              <div className="mt-auto flex items-center gap-2 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/5 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                  <span className="group-hover:rotate-90 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
                    Initialize_{item.title.split(" ")[1]}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => navigate(-1)}
        className="mt-16 text-zinc-700 hover:text-white font-mono text-[10px] uppercase tracking-[0.4em] transition-all"
      >
        [ Back ]
      </motion.button>
    </div>
  );
};
