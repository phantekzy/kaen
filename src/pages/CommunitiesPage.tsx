/* Import section */
import { CommunityList } from "../components/CommunityList"
import { motion } from "framer-motion"

/* Communities pages */
export const CommunitiesPage = () => {
    return (
        <div className="min-h-screen bg-black relative w-full">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-32 px-6">
                <header className="mb-16 border-b border-white/5 pb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-pink-600 font-black text-[10px] uppercase tracking-[0.5em]">
                            Kaen / Network
                        </span>

                        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase">
                            Explore <span className="text-pink-600">Communities</span>
                        </h1>

                        <p className="max-w-2xl text-xs sm:text-sm md:text-base text-zinc-500 leading-relaxed font-medium uppercase tracking-tight mt-6">
                            Autonomous nodes inside the kaen architecture
                        </p>
                    </motion.div>
                </header>

                <CommunityList />
            </div>
        </div>
    )
}

