import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Info, XCircle } from "lucide-react";

export default function VerifyInfomation() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Quy Trình Xác Thực Chữ Ký Số</CardTitle>
        <CardDescription>
          Tìm hiểu cách chữ ký số RSA được xác thực để đảm bảo tính toàn vẹn của
          dữ liệu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Nguyên lý xác thực chữ ký số</h3>
          <p className="text-gray-600">
            Xác thực chữ ký số là quá trình kiểm tra tính hợp lệ của chữ ký để
            đảm bảo rằng nội dung không bị thay đổi sau khi được ký và chữ ký
            thực sự được tạo bởi người sở hữu private key tương ứng. Quá trình
            này sử dụng public key của người ký để xác minh chữ ký.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-lg font-medium text-gray-900">
              Các bước xác thực
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                <span className="text-lg font-medium text-blue-600">1</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Nhận dữ liệu và chữ ký</h4>
                <p className="text-gray-600">
                  Người nhận nhận được nội dung (văn bản hoặc file) cùng với chữ
                  ký số đi kèm. Chữ ký này được tạo ra bởi người gửi sử dụng
                  private key của họ.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                <span className="text-lg font-medium text-blue-600">2</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">
                  Tính toán hash của nội dung
                </h4>
                <p className="text-gray-600">
                  Hệ thống tính toán giá trị hash của nội dung nhận được bằng
                  cùng một thuật toán hash (như SHA-256) đã được sử dụng trong
                  quá trình ký.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                <span className="text-lg font-medium text-blue-600">3</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Giải mã chữ ký</h4>
                <p className="text-gray-600">
                  Sử dụng public key của người gửi để giải mã chữ ký số, thu
                  được giá trị hash ban đầu mà người gửi đã tính toán từ nội
                  dung gốc.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                <span className="text-lg font-medium text-blue-600">4</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">So sánh giá trị hash</h4>
                <p className="text-gray-600">
                  So sánh giá trị hash vừa tính toán từ nội dung nhận được với
                  giá trị hash thu được từ việc giải mã chữ ký. Nếu hai giá trị
                  này giống nhau, chữ ký được xác thực là hợp lệ.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Khi chữ ký hợp lệ</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-green-800">
                    <strong>Nội dung nguyên vẹn:</strong> Nội dung không bị thay
                    đổi kể từ khi được ký.
                  </p>
                  <p className="text-green-800">
                    <strong>Người gửi xác thực:</strong> Chữ ký được tạo bởi
                    người sở hữu private key tương ứng với public key được sử
                    dụng để xác thực.
                  </p>
                  <p className="text-green-800">
                    <strong>Không thể phủ nhận:</strong> Người ký không thể phủ
                    nhận việc đã ký nội dung này.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Khi chữ ký không hợp lệ</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-red-800">
                    <strong>Nội dung đã bị sửa đổi:</strong> Nội dung có thể đã
                    bị thay đổi sau khi được ký.
                  </p>
                  <p className="text-red-800">
                    <strong>Chữ ký không khớp:</strong> Chữ ký có thể không được
                    tạo cho nội dung này.
                  </p>
                  <p className="text-red-800">
                    <strong>Public key không đúng:</strong> Public key không
                    tương ứng với private key đã tạo chữ ký.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Ứng dụng của xác thực chữ ký số
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Xác thực email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Xác minh nguồn gốc email và đảm bảo nội dung không bị sửa đổi,
                  chống lại các cuộc tấn công phishing
                </p>
              </CardContent>
            </Card>
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Xác thực phần mềm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Đảm bảo phần mềm đến từ nhà phát triển chính thức và không bị
                  sửa đổi, ngăn chặn malware
                </p>
              </CardContent>
            </Card>
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Xác thực tài liệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Xác minh tính xác thực của hợp đồng điện tử, văn bản pháp lý
                  và tài liệu quan trọng khác
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Mẹo:</strong> Luôn đảm bảo bạn có public key đúng của người
            ký. Sử dụng các kênh an toàn để trao đổi public key hoặc sử dụng hệ
            thống PKI (Public Key Infrastructure) để xác thực public key.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
