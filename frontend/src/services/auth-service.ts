import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";
import {
  LoginFormData,
  LoginResponse,
  ProfileResponse,
  RegisterFormData,
  RegisterResponse,
} from "@/types/auth.type";

export const authService = {
  login: async (data: LoginFormData) =>
    await http
      .post<LoginResponse>(API_ROUTES.AUTH.LOGIN, data)
      .then((res) => res.data),
  register: async (data: RegisterFormData) =>
    await http
      .post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, data)
      .then((res) => res.data),
  profile: async () =>
    await http.get<ProfileResponse>(API_ROUTES.USER.ME).then((res) => res.data),
};
