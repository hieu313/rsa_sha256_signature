import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginResponse = {
  token: string;
};

export type RegisterResponse = {
  status: string;
};
