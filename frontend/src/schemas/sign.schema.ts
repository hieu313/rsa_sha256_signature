import { DocumentType } from "@/types/sign.type";
import { z } from "zod";

export const signContentSchema = z
  .object({
    documentType: z.nativeEnum(DocumentType),
    textContent: z.string().optional(),
    file: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    const checkTextContent =
      data.documentType === DocumentType.TEXT && data.textContent === null;
    const checkFile =
      data.documentType === DocumentType.FILE && data.file === null;
    if (checkTextContent || checkFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập nội dung tài liệu",
      });
    }
  });

export const signVerifySchema = z.object({
  signValue: z.string(),
  signTimestamp: z.string(),
  hashValue: z.string(),
  sessionId: z.string(),
  publicKeyId: z.string(),
});
