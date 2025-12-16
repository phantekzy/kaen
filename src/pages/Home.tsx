import { useMediaQuery } from "react-responsive";
import AnimatedIcon from "../components/AnimatedIcon";
import { useMousePosition } from "../hooks/useMousePosition";
import { icons } from "../utils/icons";

export const Home = () => {
    const mousePos = useMousePosition();
    const isMobile = useMediaQuery({ maxWidth: 639 });
    const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1419 });

    const displayedIcons = isMobile ? icons.slice(0, Math.ceil(icons.length / 2)) : icons;

    const ICON_COUNT = displayedIcons.length;
    const TOP_PADDING = 1;
    const BOTTOM_PADDING = 42;

    const getMobilePosition = (index: number) => {
        const step = (BOTTOM_PADDING - TOP_PADDING) / Math.max(ICON_COUNT - 1, 1);
        return {
            top: `${TOP_PADDING + index * step}%`,
            left: `${12 + (index % 3) * 32}%`,
        };
    };

    return (
        <div className={isMobile || isTablet ? "overflow-x-hidden" : ""}>
            <section className="relative min-h-screen w-full">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10"></div>

                    {displayedIcons.map((icon, index) => (
                        <AnimatedIcon
                            key={index}
                            Icon={icon.Icon}
                            size={isMobile ? icon.size * 0.3 : icon.size}
                            opacity={icon.opacity}
                            position={isMobile ? getMobilePosition(index) : icon.position}
                            depth={isMobile ? 0 : icon.depth}
                            mousePos={isMobile ? { x: 0, y: 0 } : mousePos}
                        />
                    ))}
                </div>

                <main className="relative z-10 flex flex-col items-center pt-16 sm:pt-32 pb-16 px-4 sm:px-6 space-y-6 sm:space-y-10 mx-auto w-full max-w-full">
                    <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-center leading-snug sm:leading-[1.1] w-full max-w-lg sm:max-w-4xl">
                        Where developers <span className="text-blue-400">collaborate</span>,
                        <span className="text-violet-400"> innovate</span>,
                        <span className="text-emerald-400"> and build</span>.
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-gray-300 text-center w-full max-w-md sm:max-w-3xl">
                        The dedicated platform for high-signal technical exchange. Resolve complex problems and share expertise in a focused, zero-noise environment.
                    </p>

                    <div className="mt-4 sm:mt-6 w-full flex justify-center">
                        <button className="group relative inline-flex items-center justify-center 
                               px-4 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white 
                               rounded-lg transition-all duration-300 ease-in-out 
                               bg-blue-600 hover:bg-blue-500 overflow-hidden w-fit">
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></span>
                            <span className="relative z-10 tracking-wide text-center">Join the Community</span>
                            <span className="absolute right-0 w-6 h-24 sm:w-8 sm:h-32 -mt-12 transition-all duration-1000 transform translate-x-10 bg-white opacity-10 rotate-12 group-hover:translate-x-0"></span>
                        </button>
                    </div>
                </main>

                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">Testimonials</h2>
                    <p className="text-gray-300 mb-4">
                        "This platform helped me level up my coding skills!" – Developer A
                    </p>
                    <p className="text-gray-300 mb-4">
                        "I love collaborating with like-minded engineers here." – Developer B
                    </p>
                    <p className="text-gray-300">
                        "A zero-noise environment is exactly what I needed." – Developer C
                    </p>
                </div>
            </section>

            <section className="bg-black text-white py-16 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">More Features</h2>
                    <p className="text-gray-300 mb-4">Feature 1 description goes here.</p>
                    <p className="text-gray-300 mb-4">Feature 2 description goes here.</p>
                    <p className="text-gray-300">Feature 3 description goes here.</p>
                </div>
            </section>
        </div>
    );
};

