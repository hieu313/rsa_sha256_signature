import { signContentSchema, signVerifySchema } from "@/schemas/sign.schema";
import { SuccessResponse } from "@/types/api.type";
import { z } from "zod";

export enum DocumentType {
  TEXT = "text",
  FILE = "file",
}

export type SignContentBody = z.infer<typeof signContentSchema>;
export type SignVerifyBody = z.infer<typeof signVerifySchema>;

export type SignContentResponse = SuccessResponse<{
  sessionId: string;
  hashValue: string;
}>;

export type SignVerifyResponse = SuccessResponse<{
  signatureId: string;
}>;
