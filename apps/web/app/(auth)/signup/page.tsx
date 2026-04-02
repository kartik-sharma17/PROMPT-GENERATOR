"use client";

import { CustomInput, CustomPasswordInput } from "@/@core";
import { useSignupMutation } from "@/reduxConfig/service/authService";
import { registerSchema } from "@/zodSchema";
import { useFormik } from "formik";
import { LoaderCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { motion } from "framer-motion";

const initialValues = {
  full_name: "",
  email: "",
  role: "user",
  phone: "",
  password: "",
};

// ── Floating dot ─────────────────────────────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{ width: 2.5, height: 2.5, background: "rgba(0,255,170,0.3)", top: y, left: x }}
    animate={{ y: [0, -14, 0], opacity: [0.15, 0.65, 0.15] }}
    transition={{ duration: 4.5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  delay: (i * 0.41) % 3.5,
  x: `${(i * 11 + 9) % 100}%`,
  y: `${(i * 19 + 3) % 100}%`,
}));

// ── Page ──────────────────────────────────────────────────────────────────────
const SignupPage = () => {
  const [signupApi, { isLoading }] = useSignupMutation();
  const navigate = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values) => {
      try {
        const response = await signupApi(values).unwrap();
        toast.success(
          response?.message || "Verification email sent to your registered email"
        );
        setTimeout(() => {
          navigate.replace(`/verify?email=${encodeURIComponent(values.email)}`);
        }, 2000);
      } catch (exception: any) {
        toast.error(
          exception?.data?.message || "Something went wrong, please try again"
        );
      }
    },
  });

  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 overflow-hidden"
      style={{ background: "#080e0a" }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 60% 0%, rgba(34,211,238,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,170,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,170,0.04) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Floating dots ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(10, 20, 14, 0.85)",
            border: "1px solid rgba(0,255,170,0.13)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px rgba(0,255,170,0.04), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(0,255,170,0.03)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(0,255,170,0.5), transparent)",
            }}
          />

          <div className="px-8 py-10">
            {/* Brand mark */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,255,170,0.18), rgba(34,211,238,0.1))",
                  border: "1px solid rgba(0,255,170,0.25)",
                  boxShadow: "0 0 20px rgba(0,255,170,0.12)",
                }}
              >
                <Zap className="w-5 h-5 text-[#00ffaa]" />
              </motion.div>

              {/* Status badge */}
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{
                  background: "rgba(0,255,170,0.07)",
                  border: "1px solid rgba(0,255,170,0.18)",
                  color: "#00ffaa",
                }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ffaa] animate-pulse" />
                Get Started Free
              </span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                Create your account
              </h1>
              <p className="text-sm" style={{ color: "#6b8a7a" }}>
                Join thousands of creators crafting perfect prompts
              </p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <CustomInput
                customClass="w-full"
                name="full_name"
                placeholder="Enter your full name"
                formik={formik}
                label="Full Name"
              />

              <CustomInput
                customClass="w-full"
                name="email"
                placeholder="Enter your email"
                formik={formik}
                label="Email"
              />

              <CustomInput
                customClass="w-full"
                name="phone"
                placeholder="Enter your phone number"
                formik={formik}
                label="Phone No."
              />

              <CustomPasswordInput
                customClass="w-full"
                name="password"
                placeholder="Create a strong password"
                formik={formik}
                label="Password"
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.015 } : {}}
                whileTap={!isLoading ? { scale: 0.985 } : {}}
                className="relative w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 overflow-hidden transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #00ffaa 0%, #22d3ee 100%)",
                  color: "#011a0d",
                  boxShadow:
                    "0 0 28px rgba(0,255,170,0.28), 0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {/* Shimmer */}
                {!isLoading && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                )}
                {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                {isLoading ? "Creating account…" : "Create Account"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "#3d5a4a" }}>
                Already a member?
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            <p className="text-center text-sm" style={{ color: "#6b8a7a" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: "#00ffaa" }}
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{ boxShadow: "0 0 0 1px rgba(0,255,170,0.05)" }}
        />
      </motion.div>
    </div>
  );
};

export default SignupPage;