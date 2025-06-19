import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";

export const publicKeyService = {
  uploadPublicKey: async (publicKeyPem: string, keyAlias: string) =>
    await http
      .post(API_ROUTES.PUBLIC_KEY.UPLOAD, { publicKeyPem, keyAlias })
      .then((res) => res.data),
  deletePublicKey: async (keyId: string) =>
    await http
      .delete(API_ROUTES.PUBLIC_KEY.DELETE(keyId))
      .then((res) => res.data),
  getPublicKeys: async () =>
    await http.get(API_ROUTES.USER.PUBLIC_KEYS).then((res) => res.data),
};
