"use client";

import { CustomInput, CustomPasswordInput } from "@/@core";
import { useLoginMutation } from "@/reduxConfig/service/authService";
import { setCredentials } from "@/reduxConfig/slice/authSlice";
import { loginSchema } from "@/zodSchema";
import { useFormik } from "formik";
import { LoaderCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const initialValues = {
  email: "",
  password: "",
};

// ── Floating dot ─────────────────────────────────────────────────────────────
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

const DOTS = Array.from({ length: 24 }, (_, i) => ({
  delay: (i * 0.37) % 3,
  x: `${(i * 13 + 7) % 100}%`,
  y: `${(i * 17 + 5) % 100}%`,
}));

// ── Page ──────────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const [loginApi, { isLoading }] = useLoginMutation();
  const navigate = useRouter();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
        const response = await loginApi(values).unwrap();
        toast.success(response?.message || "Login successful!");

        dispatch(
          setCredentials({
            user: response?.data,
            token: response?.data?.token,
            subscriptionDetails: response?.data?.subscriptionDetails ?? null,
          })
        );

        Cookies.set("token", response?.data?.token, { expires: 7, path: "/" });

        setTimeout(() => {
          navigate.replace("/generate");
        }, 1500);
      } catch (exception: any) {
        toast.error(exception?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: "#080e0a" }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--theme-primary-raw) 10%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--theme-primary-raw) 6%, transparent) 0%, transparent 70%)",
          filter: "blur(60px)",
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
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
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
            {/* Logo / brand mark */}
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
                <Zap className="w-5 h-5" style={{ color: "var(--theme-primary-raw)" }} />
              </motion.div>

              {/* Status badge */}
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
                Secure Login
              </span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm" style={{ color: "#6b8a7a" }}>
                Sign in to continue to your workspace
              </p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <CustomInput
                customClass="w-full"
                name="email"
                placeholder="Enter your email"
                formik={formik}
                label="Email"
              />

              <div>
                <CustomPasswordInput
                  customClass="w-full"
                  name="password"
                  placeholder="Enter your password"
                  formik={formik}
                  label="Password"
                />
                <div className="flex justify-end mt-2">
                  <Link
                    href="/forget-password"
                    className="text-xs transition-colors"
                    style={{ color: "#6b8a7a" }}
                    onMouseOver={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--theme-primary-raw)")
                    }
                    onMouseOut={(e) =>
                      ((e.target as HTMLElement).style.color = "#6b8a7a")
                    }
                  >
                    Forgot password?
                  </Link>
                </div>
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
                {/* Shimmer effect */}
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
                {isLoading ? "Signing in…" : "Sign In"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "#3d5a4a" }}>
                New here?
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm" style={{ color: "#6b8a7a" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold transition-colors"
                style={{ color: "var(--theme-primary-raw)" }}
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            background: "transparent",
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--theme-primary-raw) 6%, transparent)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;