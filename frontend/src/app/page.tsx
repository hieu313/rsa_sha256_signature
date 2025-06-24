import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, FileSignature, Key, Shield } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const features = [
  {
    title: "Tạo cặp khóa RSA",
    description: "Tạo cặp khóa RSA 2048-bit an toàn với thuật toán RSA",
    icon: Key,
    href: ROUTES.KEY_GENERATE,
    color: "bg-blue-500",
  },
  {
    title: "Ký thông điệp",
    description: "Sử dụng private key để ký thông điệp với SHA256",
    icon: FileSignature,
    href: ROUTES.SIGN,
    color: "bg-green-500",
  },
  {
    title: "Xác thực chữ ký",
    description: "Xác minh tính hợp lệ của chữ ký bằng public key",
    icon: Shield,
    href: ROUTES.VERIFY,
    color: "bg-purple-500",
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(AUTH_COOKIE_NAME)?.value !== null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Chữ Ký Số RSA
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Ứng dụng chữ ký số RSA với SHA256 - Tạo khóa, ký và xác thực thông
          điệp một cách an toàn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href={isAuthenticated ? ROUTES.KEY_GENERATE : ROUTES.LOGIN}>
            <Button size="lg" className="w-full sm:w-auto">
              Bắt đầu ngay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link href={ROUTES.LOGIN}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.href}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full">
                    Truy cập
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Về Chữ Ký Số RSA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Chữ ký số RSA là một phương pháp mật mã học được sử dụng để đảm
              bảo tính xác thực và toàn vẹn của dữ liệu. Nó sử dụng cặp khóa
              công khai và riêng tư để tạo và xác minh chữ ký.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                • <strong>Tính xác thực:</strong> Xác nhận người gửi
              </li>
              <li>
                • <strong>Tính toàn vẹn:</strong> Đảm bảo dữ liệu không bị thay
                đổi
              </li>
              <li>
                • <strong>Không thể từ chối:</strong> Người ký không thể phủ
                nhận
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Kỹ Thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Thuật toán:</span>
                <span className="font-medium">RSA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hash function:</span>
                <span className="font-medium">SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ dài khóa:</span>
                <span className="font-medium">2048-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salt length:</span>
                <span className="font-medium">32 bytes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API:</span>
                <span className="font-medium">Web Crypto API</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
