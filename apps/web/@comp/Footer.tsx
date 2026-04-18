import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  About: [
    { label: "About us", href: "/about-us" },
    { label: "Pricing", href: "/choose-plan" },
  ],
  Info: [
    { label: "Contact Us", href: "/contact-us" },
    { label: "Introducing Prompter", href: "/about-us" },
  ],
};

const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <Link href={href}>
    <motion.div
      className="group flex items-center justify-between py-4 border-b border-[#253c29]/30 text-lg md:text-xl text-[#86a38a] hover:text-[#00f279] transition-colors duration-300"
      whileHover={{ x: 4 }}
    >

      <span>{label}</span>
      <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-[#00f279] transition-all duration-300" />

    </motion.div>
  </Link>
);

export const Footer = () => {
  return (
    <footer className="relative pt-0 pb-0 overflow-hidden bg-gradient-to-b from-[#0a100a] to-[#0a100a]">
      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto">
        {/* Logo + branding area */}
        <div className="container pt-16 pb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-[#effaf0]"
            >
              Prompter
            </motion.h2>
          </div>
        </div>

        {/* Link columns */}
        <div className="container pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
            {Object.entries(footerLinks).map(([category, links], i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86a38a] mb-2">
                  {category}
                </p>
                <div className="flex flex-col">
                  {links.map((link) => (
                    <FooterLink key={link.label} {...link} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#253c29]/20">
            <p className="text-xs uppercase tracking-[0.15em] text-[#86a38a]">
              © Prompter Technologies, 2026
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs uppercase tracking-[0.15em] text-[#86a38a] hover:text-[#00f279] transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs uppercase tracking-[0.15em] text-[#86a38a] hover:text-[#00f279] transition-colors duration-200"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};