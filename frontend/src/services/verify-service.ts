import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";
import { VerifyContentBody, VerifyContentResponse } from "@/types/verify.type";

export const verifyService = {
  verifyContent: async (body: VerifyContentBody) =>
    await http
      .post<VerifyContentResponse>(API_ROUTES.VERIFY.CONTENT, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),
};
