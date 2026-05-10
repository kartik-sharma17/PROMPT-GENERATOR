import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const route = useRouter()
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            whileHover={{ scale: 1.02 }}
          >
            <img className="h-auto w-35" src={`/clarixLogo.png`}/>
          </motion.a>

          {/* Nav links
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Docs", "Blog"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[#86a38a] hover:text-[#effaf0] transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00f279] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div> */}

          {/* CTA buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>{route.push("/signup")}}
              className="text-[#86a38a] hover:text-[#effaf0] transition-colors"
            >
              Sign in
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>{route.push("/generate")}}
              className="px-4 py-2 bg-[#00f279] text-[#00140a] font-medium rounded-lg"
            >
              Get Started
            </motion.button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
};