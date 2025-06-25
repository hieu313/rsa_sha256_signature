import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import { cookies } from "next/headers";
import SignForm from "./_components/sign-form";
import SignInfoCard from "./_components/sign-info-card";

export default async function SignPage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(AUTH_COOKIE_NAME)?.value !== undefined;
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Ký Thông Điệp</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tạo chữ ký số RSA cho văn bản hoặc file để đảm bảo tính xác thực và
          toàn vẹn
        </p>
      </div>

      <SignForm isAuth={isAuthenticated} />

      <SignInfoCard />
    </div>
  );
}
