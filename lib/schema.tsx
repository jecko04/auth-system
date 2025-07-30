import z from "zod";

export const adminRegisterSchema = z.object({

  full_name: z.string().min(1, "Name is required"),
  email: 
  z.string()
  .email("Invalid email address")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  password: 
  z.string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
  .min(1, "Confirm Password is required")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Confirm Password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
});

export type AdminRegisterSchema = z.infer<typeof adminRegisterSchema>;

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

export const emailChecker = z.object({
 email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
});
export type EmailChecker = z.infer<typeof emailChecker>;