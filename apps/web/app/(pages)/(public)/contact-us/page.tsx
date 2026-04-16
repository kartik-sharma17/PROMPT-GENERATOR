"use client";

import { CustomInput } from "@/@core";
import { useContactUsMutation } from "@/reduxConfig/service/authService";
import { useFormik } from "formik";
import { LoaderCircle, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useState } from "react";
import { Footer, Navbar } from "@/@comp";

// ── Zod schema ────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name is too long"),
  email: z.string().email("Please enter a valid email address"),
  have_account: z.boolean(),
  description: z
    .string()
    .min(20, "Please describe your issue in at least 20 characters")
    .max(1000, "Description is too long"),
});

// ── Floating dot ──────────────────────────────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 3,
      height: 3,
      background: "color-mix(in srgb, var(--theme-primary-raw) 35%, transparent)",
      top: y,
      left: x,
    }}
    animate={{ y: [0, -16, 0], opacity: [0.2, 0.7, 0.2] }}
    transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const DOTS = Array.from({ length: 26 }, (_, i) => ({
  delay: (i * 0.37) % 3,
  x: `${(i * 13 + 7) % 100}%`,
  y: `${(i * 17 + 5) % 100}%`,
}));

// ── Page ──────────────────────────────────────────────────────────────────────
const ContactUsPage = () => {
  const [contactApi, { isLoading }] = useContactUsMutation();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      have_account: false,
      description: "",
    },
    validationSchema: toFormikValidationSchema(contactSchema),
    onSubmit: async (values) => {
      try {
        const response = await contactApi(values).unwrap();
        toast.success(response?.message || "Message sent! We'll get back to you soon.");
        setSubmitted(true);
      } catch (exception: any) {
        toast.error(exception?.data?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <>
    <Navbar/>
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden py-12"
      style={{ background: "#080e0a" }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--theme-primary-raw) 10%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--theme-primary-raw) 6%, transparent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Floating dots ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Card ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(10, 20, 14, 0.85)",
            border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 14%, transparent)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--theme-primary-raw) 4%, transparent), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px color-mix(in srgb, var(--theme-primary-raw) 4%, transparent)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 60%, transparent), transparent)",
            }}
          />

          <div className="px-8 py-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success state ──────────────────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary-raw) 20%, transparent), color-mix(in srgb, var(--theme-primary-raw) 8%, transparent))",
                      border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 30%, transparent)",
                      boxShadow: "0 0 32px color-mix(in srgb, var(--theme-primary-raw) 16%, transparent)",
                    }}
                  >
                    <CheckCircle2 className="w-9 h-9" style={{ color: "var(--theme-primary-raw)" }} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Received!</h2>
                  <p className="text-sm" style={{ color: "#6b8a7a" }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                /* ── Form state ─────────────────────────────────────────── */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Header */}
                  <div className="flex flex-col items-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary-raw) 18%, transparent), color-mix(in srgb, var(--theme-primary-raw) 8%, transparent))",
                        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
                        boxShadow: "0 0 20px color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
                      }}
                    >
                      <Mail className="w-5 h-5" style={{ color: "var(--theme-primary-raw)" }} />
                    </motion.div>

                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
                      style={{
                        background: "color-mix(in srgb, var(--theme-primary-raw) 7%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 18%, transparent)",
                        color: "var(--theme-primary-raw)",
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "var(--theme-primary-raw)" }}
                      />
                      Get In Touch
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                      Contact Us
                    </h1>
                    <p className="text-sm" style={{ color: "#6b8a7a" }}>
                      Have a question or need help? We&apos;re here for you.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit}>
                    {/* Full Name */}
                    <CustomInput
                      customClass="w-full"
                      name="full_name"
                      placeholder="Enter your full name"
                      formik={formik}
                      label="Full Name"
                    />

                    {/* Email */}
                    <CustomInput
                      customClass="w-full"
                      name="email"
                      placeholder="Enter your email"
                      formik={formik}
                      label="Email"
                    />

                    {/* Have Account — two-button toggle (no HOC for boolean fields) */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="text-[#929294] text-sm ml-1 mb-2">
                        Do you have an account? <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-3 w-full">
                        {[
                          { label: "Yes, I have one", value: true },
                          { label: "No, I'm new here", value: false },
                        ].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => formik.setFieldValue("have_account", opt.value)}
                            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={
                              formik.values.have_account === opt.value
                                ? {
                                    background:
                                      "color-mix(in srgb, var(--theme-primary-raw) 15%, transparent)",
                                    border:
                                      "1px solid color-mix(in srgb, var(--theme-primary-raw) 40%, transparent)",
                                    color: "var(--theme-primary-raw)",
                                  }
                                : {
                                    background: "#1C1D21",
                                    border: "1px solid transparent",
                                    color: "#929294",
                                  }
                            }
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description — textarea (no HOC for this field type) */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="text-[#929294] text-sm ml-1 mb-1">
                        How can we help? <span className="text-red-600">*</span>
                      </label>
                      <div className="relative w-full">
                        <textarea
                          name="description"
                          placeholder="Describe your issue or question in detail..."
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows={4}
                          className={`w-full px-3 py-3 rounded-lg text-sm text-white placeholder:text-[#3d5a4a] resize-none bg-[#1C1D21] border focus:outline-none focus-visible:ring-0 ${
                            formik.touched.description && formik.errors.description
                              ? "border-red-600"
                              : "border-transparent"
                          }`}
                        />
                        <span
                          className="absolute bottom-3 right-3 text-[10px]"
                          style={{
                            color: formik.values.description.length > 900 ? "#ef4444" : "#3d5a4a",
                          }}
                        >
                          {formik.values.description.length}/1000
                        </span>
                      </div>
                      <AnimatePresence>
                        {formik.touched.description && formik.errors.description && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs text-red-400 mt-1 ml-1"
                          >
                            {formik.errors.description as string}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.015 } : {}}
                      whileTap={!isLoading ? { scale: 0.985 } : {}}
                      className="relative w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 overflow-hidden transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--theme-primary-raw) 0%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
                        color: "#011a0d",
                        boxShadow:
                          "0 0 28px color-mix(in srgb, var(--theme-primary-raw) 28%, transparent), 0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {!isLoading && (
                        <motion.span
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                          }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                        />
                      )}
                      {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                      {isLoading ? "Sending…" : "Send Message"}
                    </motion.button>
                  </form>

                  <p className="text-center text-xs mt-6" style={{ color: "#3d5a4a" }}>
                    We typically respond within{" "}
                    <span style={{ color: "var(--theme-primary-raw)" }}>24 hours</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--theme-primary-raw) 6%, transparent)",
          }}
        />
      </motion.div>
    </div>
    <Footer/>
    </>
  );
};

export default ContactUsPage;