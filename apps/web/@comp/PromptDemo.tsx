import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const inputText = "Write a blog post about AI...";
const outputText = "Create a comprehensive, SEO-optimized blog post about artificial intelligence trends in 2024. Include engaging hooks, data-backed insights, and actionable takeaways for business leaders.";

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

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    // Typing animation for input
    let inputIndex = 0;
    const inputInterval = setInterval(() => {
      if (inputIndex <= inputText.length) {
        setDisplayedInput(inputText.slice(0, inputIndex));
        inputIndex++;
      } else {
        clearInterval(inputInterval);
        setIsOptimizing(true);
        
        // After "optimizing", show output
        setTimeout(() => {
          setIsOptimizing(false);
          setShowOutput(true);
          
          // Typing animation for output
          let outputIndex = 0;
          const outputInterval = setInterval(() => {
            if (outputIndex <= outputText.length) {
              setDisplayedOutput(outputText.slice(0, outputIndex));
              outputIndex++;
            } else {
              clearInterval(outputInterval);
              
              // Reset and restart
              setTimeout(() => {
                setDisplayedInput("");
                setDisplayedOutput("");
                setShowOutput(false);
                inputIndex = 0;
              }, 4000);
            }
          }, 20);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(inputInterval);
  }, [displayedOutput === "" && displayedInput === ""]);

  return (
    <div className="relative">
      {/* Orbiting model chips */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {modelChips.map((chip, index) => (
          <motion.div
            key={chip.name}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              rotate: 360,
            }}
            transition={{
              opacity: { delay: chip.delay + 1, duration: 0.5 },
              rotate: { 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: chip.delay,
              },
            }}
            style={{
              transformOrigin: "center center",
            }}
          >
            <motion.div
              className="glass-card px-3 py-1.5 text-sm font-medium text-foreground/80"
              style={{
                transform: `translateX(${160 + index * 20}px)`,
              }}
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
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        whileHover={{
          boxShadow: "0 0 80px hsl(var(--glow) / 0.3), 0 25px 50px -12px hsl(var(--background) / 0.8)",
        }}
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Input section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-sm text-muted-foreground">Your prompt</span>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 min-h-[60px] font-mono text-foreground/80">
              {displayedInput}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
              />
            </div>
          </div>

          {/* Optimize indicator */}
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
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-primary font-medium">Optimizing...</span>
            </motion.div>
          )}

          {/* Arrow */}
          {!isOptimizing && displayedInput.length === inputText.length && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="flex justify-center my-4"
            >
              <ArrowRight className="w-6 h-6 text-primary" />
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
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-primary font-medium">Optimized prompt</span>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 min-h-[80px] font-mono text-foreground">
                {displayedOutput}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
