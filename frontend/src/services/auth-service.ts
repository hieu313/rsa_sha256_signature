import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";

export const authService = {
  login: async (username: string, password: string) =>
    await http.post(API_ROUTES.AUTH.LOGIN, {
      username,
      password,
    }),
  register: async (username: string, password: string) =>
    await http.post(API_ROUTES.AUTH.REGISTER, {
      username,
      password,
    }),
};
