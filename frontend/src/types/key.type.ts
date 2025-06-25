import { publicKeySchema } from "@/schemas/public-key.schema";
import { SuccessResponse } from "@/types/api.type";
import { z } from "zod";

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};

export type PublicKey = {
  id: string;
  keyAlias: string;
  publicKeyPem: string;
  fingerprint: string;
  keySize: number;
  keyUsage: number;
  revokedAt: Date | null;
  createdAt: string;
  expiresAt: Date | null;
  revoked: boolean;
  default: boolean;
};

export type PublicKeyUploadBody = z.infer<typeof publicKeySchema>;
export type PublicKeyMeta = {
  total: number;
  active: number;
  revoked: number;
  expired: number;
};
export type PublicKeyListResponse = SuccessResponse<{
  keys: PublicKey[];
  meta: PublicKeyMeta;
}>;
export type ActivePublicKeyResponse = SuccessResponse<PublicKey[]>;
