import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Application from "./application";
import Comparation from "./comparation";
import PropsCons from "./props-cons";

export default function RsaInformative() {
  return (
    <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Giới thiệu về RSA</CardTitle>
          <CardDescription>
            Tìm hiểu về thuật toán mã hóa khóa công khai RSA và cách nó hoạt
            động
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Lịch sử và nguyên lý hoạt động
            </h3>
            <p className="text-gray-600">
              RSA (Rivest–Shamir–Adleman) là một trong những thuật toán mã hóa
              khóa công khai đầu tiên và được sử dụng rộng rãi nhất cho truyền
              dữ liệu an toàn. Được phát minh vào năm 1977 bởi Ron Rivest, Adi
              Shamir và Leonard Adleman tại MIT, RSA dựa trên nguyên lý toán học
              về độ khó của việc phân tích thừa số của các số nguyên lớn.
            </p>
            <p className="text-gray-600">
              Thuật toán RSA tạo ra một cặp khóa: khóa công khai (public key)
              được chia sẻ rộng rãi và khóa riêng tư (private key) được giữ bí
              mật. Dữ liệu được mã hóa bằng khóa công khai chỉ có thể được giải
              mã bằng khóa riêng tư tương ứng.
            </p>
          </div>
          <Separator />
          <PropsCons />

          <Separator />
          <Application />

          <Separator />
          <Comparation />
        </CardContent>
      </Card>
  );
}