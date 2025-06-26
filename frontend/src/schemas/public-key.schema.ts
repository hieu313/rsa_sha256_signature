import { RsaHelper } from "@/lib/rsa";
import { z } from "zod";

export const publicKeySchema = z
  .object({
    publicKeyPem: z
      .string()
      .min(1, { message: "Vui lòng nhập public key PEM" })
      .refine(
        (value) => {
          // Kiểm tra format PEM cơ bản
          const pemRegex = new RegExp(
            `^${RsaHelper.BEGIN_PUBLIC_KEY}\\n[\\s\\S]*\\n${RsaHelper.END_PUBLIC_KEY}$`
          );
          return pemRegex.test(value);
        },
        { message: "Public key PEM không đúng định dạng" }
      )
      .refine(
        (value) => {
          // Kiểm tra nội dung base64 hợp lệ
          try {
            const cleanPem = value
              .replace(RsaHelper.BEGIN_PUBLIC_KEY, "")
              .replace(RsaHelper.END_PUBLIC_KEY, "")
              .replaceAll("\\s+", "");
            atob(cleanPem); // Thử decode base64
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        },
        { message: "Nội dung public key PEM không hợp lệ" }
      ),
    keyAlias: z.string().min(1, { message: "Vui lòng nhập tên key" }),
    keySize: z.number().min(1, { message: "Vui lòng chọn kích thước key" }),
  })
  .superRefine((data, ctx) => {
    if (data.publicKeyPem.length > 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Public key PEM không được lớn hơn 1024 ký tự",
      });
    }
  });

export const publicKeyUpdateSchema = z.object({
  keyAlias: z.string().min(1, { message: "Vui lòng nhập tên key" }),
  expiresAt: z.date().nullable(),
  isDefault: z.boolean(),
});
