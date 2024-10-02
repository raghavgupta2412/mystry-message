import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "NOt more than 20 Charaters")
  .regex(/^[a-zA-Z0-9]+$/, "username must not contain special charaters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Pasword must be atleast 6 charaters" }),
});
