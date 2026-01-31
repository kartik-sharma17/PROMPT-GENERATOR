import { motion, Variants } from "framer-motion";

const words = ["Generate", "Perfect", "Prompts.", "Instantly."];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const wordVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const AnimatedHeadline = () => {
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariant}
          className={`inline-block mr-4 ${
            word === "Perfect" || word === "Instantly."
              ? "gradient-text-animated"
              : "text-[#ecfdf5]"
          }`}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};
