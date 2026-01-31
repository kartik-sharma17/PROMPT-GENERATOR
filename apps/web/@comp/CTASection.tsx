import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CTAButton } from "./CTAButton";
import { Zap } from "lucide-react";

export const CTASection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,170,0.2) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Horizontal moving particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: "rgba(0,255,170,0.3)",
              top: `${Math.random() * 100}%`,
              left: "-5%",
            }}
            animate={{
              x: ["0vw", "110vw"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="
              inline-flex items-center justify-center
              w-16 h-16 rounded-2xl mb-8
              border
            "
            style={{
              backgroundColor: "rgba(0,255,170,0.1)",
              borderColor: "rgba(0,255,170,0.2)",
            }}
          >
            <Zap className="w-8 h-8 text-[#00ffaa]" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#ecfdf5]"
          >
            Stop Guessing.{" "}
            <span className="gradient-text-animated">
              Start Prompting Like a Pro.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl mb-10 text-[#7fbfb0]"
          >
            Join thousands of creators, developers, and businesses who&apos;ve
            mastered the art of AI prompting.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(0,255,170,0.2)",
                  "0 0 60px rgba(0,255,170,0.4)",
                  "0 0 30px rgba(0,255,170,0.2)",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-xl"
            >
              <CTAButton>Start Generating for Free</CTAButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
