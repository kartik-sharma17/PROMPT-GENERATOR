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
      <ParticleField />

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
            <CTAButton onClick={()=>{route.push("/generate")}} className="neon-glow-box">
              Generate Prompt
            </CTAButton>

            <CTAButton
              variant="secondary"
              className="border border-[#1f2e28] text-[#ecfdf5] hover:border-[#00ffaa]"
            >
              See How It Works
            </CTAButton>
          </motion.div>
        </div>

        {/* Demo section */}
        <motion.div
          variants={itemVariants}
          className="relative glass-card glass-card-hover"
        >
          <PromptDemo />
        </motion.div>
      </motion.div>
    </section>
  );
};
