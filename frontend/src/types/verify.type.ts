import { verifyContentSchema } from "@/schemas/verify.schema";
import { SuccessResponse } from "@/types/api.type";
import { z } from "zod";

export type VerifyContentBody = z.infer<typeof verifyContentSchema>;

export type VerifyContentResponse = SuccessResponse<{
  valid: boolean;
}>;
