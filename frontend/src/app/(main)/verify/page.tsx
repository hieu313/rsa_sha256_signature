import VerifyForm from "./_components/verify-form";
import VerifyInfomation from "./_components/verify-infomation";

export default function VerifyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Xác Thực Chữ Ký</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Xác minh tính hợp lệ của chữ ký số RSA để đảm bảo tính xác thực và
          toàn vẹn của dữ liệu
        </p>
      </div>

      <VerifyForm />
      <VerifyInfomation />
    </div>
  );
}
