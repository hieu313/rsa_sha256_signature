import { RsaHelper } from "@/lib/rsa";
import { DocumentType } from "@/types/sign.type";
import { z } from "zod";

export const verifyContentSchema = z.object({
  documentType: z
    .nativeEnum(DocumentType)
    .transform((val) => val.toLowerCase()),
  textContent: z.string().optional(),
  file: z.instanceof(File).optional(),
  signatureValue: z.string(),
  publicKeyPem: z.string().refine(
    (value) => {
      try {
        return (
          value.trim() !== "" &&
          value.trim() !== null &&
          value.trim() !== undefined &&
          value.startsWith(RsaHelper.BEGIN_PUBLIC_KEY) &&
          value.endsWith(RsaHelper.END_PUBLIC_KEY)
        );
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    {
      message: "Public key không hợp lệ",
    }
  ),
});
