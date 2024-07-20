import { z } from "zod";

export const userLoginSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type UserLogin = z.infer<typeof userLoginSchema>;

export const userRegistrationSchema = z
  .object({
    fullName: z.string().min(3, "Full Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
