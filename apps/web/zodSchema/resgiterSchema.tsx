import { z } from "zod";

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  // phone: z
  //   .string()
  //   .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
