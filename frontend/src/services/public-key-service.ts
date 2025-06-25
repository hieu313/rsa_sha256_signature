import { API_ROUTES } from "@/constants/api-routes";
import http from "@/lib/http";
import {
  ActivePublicKeyResponse,
  PublicKeyListResponse,
  PublicKeyUploadBody,
} from "@/types/key.type";

export const publicKeyService = {
  uploadPublicKey: async (body: PublicKeyUploadBody) =>
    await http.post(API_ROUTES.PUBLIC_KEY.UPLOAD, body).then((res) => res.data),
  revokeKey: async (keyId: string) =>
    await http
      .delete(API_ROUTES.PUBLIC_KEY.REVOKE(keyId))
      .then((res) => res.data),
  getMyPublicKeys: async () =>
    await http
      .get<PublicKeyListResponse>(API_ROUTES.USER.PUBLIC_KEYS)
      .then((res) => res.data),
  getActivePublicKeys: async (keyAlias?: string) =>
    await http
      .get<ActivePublicKeyResponse>(API_ROUTES.USER.ACTIVE_PUBLIC_KEYS, {
        params: {
          keyAlias: keyAlias || undefined,
        },
      })
      .then((res) => res.data),
};
