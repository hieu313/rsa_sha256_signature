import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .min(1, { message: "Vui lòng nhập email" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
  remember_me: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Vui lòng nhập tên" }),
    email: z
      .string()
      .email({ message: "Email không hợp lệ" })
      .min(1, { message: "Vui lòng nhập email" }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
    confirm_password: z
      .string()
      .min(1, { message: "Vui lòng nhập lại mật khẩu" }),
    accept_terms: z.boolean().refine((val) => val, {
      message: "Bạn phải đồng ý với điều khoản và điều kiện",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["confirm_password"],
      });
    }
  });
