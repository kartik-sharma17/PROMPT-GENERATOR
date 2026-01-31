import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelsCount = 6;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const panels = wrapperRef.current;

    gsap.to(panels, {
      xPercent: -100 * (panels.children.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: panels,
        start: "top top",
        end: `+=${window.innerHeight * (panels.children.length - 1)}`,
        scrub: true,
        pin: true,
      },
    });
  }, []);

  return (
    <div>

      {/* Horizontal scroll section */}
      <section className={`relative bg-red-500 h-[${panelsCount * 100}vh]`}>
        <div
          ref={wrapperRef}
          className="flex sticky top-0 gap-4 px-4"
        >
          {[...Array(panelsCount)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[30vw] h-100 flex items-center justify-center text-white text-4xl"
              style={{
                backgroundColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
              }}
            >
              Panel {i + 1}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
