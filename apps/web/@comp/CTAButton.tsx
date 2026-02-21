import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export const CTAButton = ({
  children,
  variant = "primary",
  onClick,
}: CTAButtonProps) => {
  /* ---------------- Secondary Button ---------------- */
  if (variant === "secondary") {
    return (
      <motion.button
        onClick={onClick}
        className="
          group relative px-6 py-3 rounded-xl font-medium
          text-[#ecfdf5]
          border border-[#1f2e28]
          hover:border-[#00ffaa]
          transition-colors
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative">
          {children}
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-[#00ffaa]"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.button>
    );
  }

  /* ---------------- Primary Button ---------------- */
  return (
    <motion.button
      onClick={onClick}
      className="
        group relative px-8 py-4 rounded-xl overflow-hidden
        bg-[#00ffaa]
        text-[#022014]
        font-semibold
      "
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {/* Neon glow background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 255, 170, 0.3)",
            "0 0 40px rgba(0, 255, 170, 0.5)",
            "0 0 20px rgba(0, 255, 170, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Button content */}
      <span className="relative flex items-center gap-2">
        {children}
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </span>
    </motion.button>
  );
};
