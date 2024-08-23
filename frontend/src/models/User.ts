import {z} from "zod";

//user login schema
export const userLoginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password : z.string().min(8, "Password must be at least 8 characters long")
});

//user login type 
export type userLoginType = z.infer<typeof userLoginSchema>;

//user register schema
export const userRegisterSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email"),
    password : z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword : z.string().min(8, "Password must be at least 8 characters long")
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]});

//user register type
export type userRegisterType = z.infer<typeof userRegisterSchema>;

