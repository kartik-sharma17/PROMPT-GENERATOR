import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const inputText = "Write a prompt to create a login page using react";
const outputText = `You are a senior frontend developer.

Create a modern, responsive Login Page with clean UI/UX using React (with functional components) and Tailwind CSS.

Requirements:
- The page...................................................`;

const modelChips = [
  { name: "ChatGPT", delay: 0 },
  { name: "Claude", delay: 0.3 },
  { name: "Gemini", delay: 0.6 },
];

export const PromptDemo = () => {
  const [displayedInput, setDisplayedInput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  // ✅ cycle counter — incrementing this re-triggers the effect cleanly
  const [cycle, setCycle] = useState(0);

  // ✅ keep refs to all timers so we can clean them all up on unmount
  const inputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const outputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const optimizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - (rect.left + rect.width / 2));
    y.set(event.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    // ── reset visible state at the start of every cycle ──
    setDisplayedInput("");
    setDisplayedOutput("");
    setIsOptimizing(false);
    setShowOutput(false);

    let inputIndex = 0;

    // Phase 1 — type the input
    inputIntervalRef.current = setInterval(() => {
      inputIndex++;
      setDisplayedInput(inputText.slice(0, inputIndex));

      if (inputIndex >= inputText.length) {
        clearInterval(inputIntervalRef.current!);
        setIsOptimizing(true);

        // Phase 2 — "optimising" pause
        optimizeTimerRef.current = setTimeout(() => {
          setIsOptimizing(false);
          setShowOutput(true);

          let outputIndex = 0;

          // Phase 3 — type the output
          outputIntervalRef.current = setInterval(() => {
            outputIndex++;
            setDisplayedOutput(outputText.slice(0, outputIndex));

            if (outputIndex >= outputText.length) {
              clearInterval(outputIntervalRef.current!);

              // Phase 4 — hold, then restart by bumping the cycle counter
              resetTimerRef.current = setTimeout(() => {
                setCycle((c) => c + 1); // ✅ triggers the effect to re-run
              }, 4000);
            }
          }, 20);
        }, 1500);
      }
    }, 80);

    // ✅ clean up every timer when the effect re-runs or the component unmounts
    return () => {
      clearInterval(inputIntervalRef.current!);
      clearInterval(outputIntervalRef.current!);
      clearTimeout(optimizeTimerRef.current!);
      clearTimeout(resetTimerRef.current!);
    };
  }, [cycle]); // ✅ correct dependency — re-runs only when cycle increments

  return (
    <div className="relative">
      {/* Orbiting model chips */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {modelChips.map((chip, index) => (
          <motion.div
            key={chip.name}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{
              opacity: { delay: chip.delay + 1, duration: 0.5 },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: chip.delay,
              },
            }}
            style={{ transformOrigin: "center center" }}
          >
            <motion.div
              className="glass-card px-3 py-1.5 text-sm font-medium text-theme-foreground/80"
              style={{ transform: `translateX(${160 + index * 20}px)` }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: chip.delay,
              }}
              whileHover={{ scale: 1.1 }}
            >
              {chip.name}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main prompt card */}
      <motion.div
        className="glass-card p-8 max-w-2xl mx-auto relative z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        whileHover={{
          boxShadow:
            "0 0 80px hsl(var(--glow) / 0.3), 0 25px 50px -12px hsl(var(--background) / 0.8)",
        }}
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Input section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-(--theme-primary-raw)/50" />
              <span className="text-sm text-(--theme-primary-raw)">Your prompt</span>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 min-h-[60px] font-mono text-theme-foreground/80">
              {displayedInput}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-theme-primary ml-1 align-middle"
              />
            </div>
          </div>

          {/* Optimising indicator */}
          {isOptimizing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 my-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-theme-primary" />
              </motion.div>
              <span className="text-theme-primary font-medium">Optimizing...</span>
            </motion.div>
          )}

          {/* Arrow — shown once input is fully typed and we're not optimising */}
          {!isOptimizing && displayedInput.length === inputText.length && !showOutput && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="flex justify-center my-4"
            >
              <ArrowRight className="w-6 h-6 text-theme-primary" />
            </motion.div>
          )}

          {/* Output section */}
          {showOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="w-2 h-2 rounded-full bg-theme-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-theme-primary font-medium">
                  Optimized prompt
                </span>
              </div>
              <div className="bg-theme-primary/10 border border-theme-primary/20 rounded-xl p-4 min-h-[80px] font-mono text-theme-foreground">
                {displayedOutput}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};