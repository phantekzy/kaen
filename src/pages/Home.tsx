import { useMediaQuery } from "react-responsive";
import AnimatedIcon from "../components/AnimatedIcon";
import { useMousePosition } from "../hooks/useMousePosition";
import { icons } from "../utils/icons";

export const Home = () => {
  const mousePos = useMousePosition();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1419 });

  const displayedIcons = isMobile
    ? icons.slice(0, Math.ceil(icons.length / 2))
    : icons;

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
    <div
      className={
        isMobile || isTablet ? "overflow-x-hidden bg-black" : "bg-black"
      }
    >
      <section className="relative min-h-screen w-full">
        {/* Background Layer */}
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

        {/* Hero Content */}
        <main className="relative z-10 flex flex-col items-center pt-16 sm:pt-32 pb-16 space-y-1 sm:space-y-4 mx-auto w-full max-w-full">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-center leading-snug sm:leading-[1.1] w-full text-white">
            Build together
          </h1>
          <h1 className="text-pink-600 text-5xl sm:text-7xl md:text-8xl lg:text-8xl font-extrabold text-center w-full whitespace-nowrap">
            shine alone
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-gray-300 text-center pt-6 sm:pt-2 w-full max-w-md sm:max-w-3xl px-4">
            The dedicated platform for high-signal technical exchange. Resolve
            complex problems and share expertise in a focused, zero-noise
            environment.
          </p>

          {/*BUTTON SECTION */}
          <div className="mt-8 sm:mt-10 w-full flex justify-center">
            <button
              className="group relative inline-flex items-center justify-center 
                            px-8 sm:px-12 py-3.5 sm:py-4 text-lg sm:text-xl font-bold text-white 
                            rounded-full transition-all duration-500 ease-in-out 
                            bg-pink-600 hover:bg-pink-500 overflow-hidden shadow-xl shadow-pink-900/20 w-fit"
            >
              {/* Hover Gradient Background */}
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></span>

              {/* Button Text */}
              <span className="relative z-10 tracking-wide text-center">
                Get Started
              </span>

              {/* Shine Animation - travels across button on hover */}
              <span className="absolute right-0 w-12 h-32 -mt-12 transition-all duration-1000 transform translate-x-20 bg-white opacity-20 rotate-12 group-hover:-translate-x-[600px]"></span>
            </button>
          </div>
        </main>
      </section>

      {/* More Features Section */}
      <section className="bg-black text-white py-16 sm:py-20 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">More Features</h2>
          <p className="text-gray-300 mb-4">
            The zero-noise platform for modern developers.
          </p>
          <p className="text-gray-300 mb-4">
            Collaborate on complex problems in real-time.
          </p>
          <p className="text-gray-300">
            Share your expertise and build your technical reputation.
          </p>
        </div>
      </section>
    </div>
  );
};
