import { z } from "zod";

export const userLoginSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserLogin = z.infer<typeof userLoginSchema>;

export const userRegistrationSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
