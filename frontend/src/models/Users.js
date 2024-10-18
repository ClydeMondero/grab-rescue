import { z } from "zod";

// User login schema
export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email or username")
    .or(z.string().email("Please enter a valid email")),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
