import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { SuccessResponse } from "@/types/api.type";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginResponse = SuccessResponse<{
  token: string;
}>;

export type RegisterResponse = SuccessResponse<{
  token: string;
}>;
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
export type ProfileResponse = SuccessResponse<UserProfile>;
