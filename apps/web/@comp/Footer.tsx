import { ArrowRight } from "lucide-react";
import { useState } from "react";


const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid">
        <div className="flex flex-col md:flex-row justify-between gap-12 ml-auto">

          {/* Newsletter */}
          <div className="max-w-sm w-full">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Stay Updated
            </h3>
            <p className="text-foreground-raw text-sm mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-sidebar-primary rounded-full px-5 py-3 text-sm text-foreground-raw placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-(--theme-primary-raw) text-foreground hover:brightness-110 transition-all shrink-0"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Prompt Generator. All rights reserved.
          </p>
        </div>
      </div>

      {/* Big brand watermark */}
      <div
        className="overflow-hidden grid"
        aria-hidden="true"
      >
        <span className="text-[100px] my-20 font-black mx-auto leading-none text-(--theme-primary-raw)/10 whitespace-nowrap translate-y-[20%]">
          Prompt Generator
        </span>
      </div>
    </footer>
  );
};

export default Footer;
