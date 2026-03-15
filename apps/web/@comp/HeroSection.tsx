import { motion, Variants } from "framer-motion";
import { AnimatedBadge } from "./AnimatedBadge";
import { AnimatedHeadline } from "./AnimatedHeadline";
import { PromptDemo } from "./PromptDemo";
import { CTAButton } from "./CTAButton";
import { ParticleField } from "./ParticleField";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const HeroSection = () => {

  const route = useRouter()

  return (
    <section className="relative min-h-screen overflow-hidden py-20 flex flex-col justify-center">
      {/* Particle background */}
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4"
      >
        {/* Text content */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <motion.div variants={itemVariants} className="mb-8">
            <AnimatedBadge />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <AnimatedHeadline />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-[#7fbfb0] max-w-2xl mx-auto mb-10"
          >
            Transform vague ideas into powerful, optimized prompts that get
            better results from any AI model.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <CTAButton onClick={() => { route.push("/generate") }}>
              Generate Prompt
            </CTAButton>

            <CTAButton
              variant="secondary"
            >
              See How It Works
            </CTAButton>
          </motion.div>
        </div>

        {/* Demo section */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <PromptDemo />
        </motion.div>
      </motion.div>
    </section>
  );
};
