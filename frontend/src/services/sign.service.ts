import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";
import {
  SignContentBody,
  SignContentResponse,
  SignVerifyBody,
  SignVerifyResponse,
} from "@/types/sign.type";

export const signService = {
  createDocument: async (body: SignContentBody) =>
    await http
      .post<SignContentResponse>(API_ROUTES.SIGN.CONTENT, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),
  verifySignature: async (body: SignVerifyBody) =>
    await http
      .post<SignVerifyResponse>(API_ROUTES.SIGN.VERIFY, body)
      .then((res) => res.data),
};
