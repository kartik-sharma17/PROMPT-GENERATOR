import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const AnimatedBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        glass-card breathing-glow
      "
    >
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-4 h-4 text-[#00ffaa]" />
      </motion.span>

      <span className="text-sm font-medium text-[#ecfdf5]/90">
        New: AI Prompt Optimizer
      </span>
    </motion.div>
  );
};
