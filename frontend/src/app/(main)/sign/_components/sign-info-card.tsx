import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Key, Shield } from "lucide-react";

export default function SignInfoCard() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Giới thiệu về Chữ Ký Điện Tử</CardTitle>
        <CardDescription>
          Tìm hiểu về chữ ký điện tử và cách chữ ký số RSA đảm bảo tính xác thực
          và toàn vẹn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Chữ ký điện tử là gì?</h3>
          <p className="text-gray-600">
            Chữ ký điện tử (Digital Signature) là một cơ chế mật mã học được sử
            dụng để xác thực tính xác thực, toàn vẹn và không thể phủ nhận của
            thông điệp hoặc tài liệu số. Khác với chữ ký tay truyền thống, chữ
            ký điện tử sử dụng các thuật toán toán học phức tạp để tạo ra một
            &quot;dấu vân tay&quot; duy nhất cho mỗi tài liệu.
          </p>
          <p className="text-gray-600">
            Chữ ký điện tử không chỉ xác nhận danh tính của người ký mà còn đảm
            bảo rằng nội dung tài liệu không bị thay đổi sau khi được ký. Điều
            này làm cho chữ ký điện tử trở thành một công cụ quan trọng trong
            thương mại điện tử, giao dịch tài chính và các ứng dụng bảo mật
            khác.
          </p>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Đặc điểm của chữ ký điện tử</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Xác thực (Authentication):</strong> Xác nhận danh tính
                  của người ký
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Toàn vẹn (Integrity):</strong> Đảm bảo dữ liệu không
                  bị thay đổi
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Không thể phủ nhận (Non-repudiation):</strong> Người
                  ký không thể từ chối trách nhiệm
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Ràng buộc pháp lý:</strong> Có giá trị pháp lý tương
                  đương chữ ký tay
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quy trình chữ ký điện tử</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <strong>Tạo hash:</strong> Tính toán hash của tài liệu bằng
                  thuật toán như SHA-256
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <strong>Mã hóa hash:</strong> Sử dụng private key để mã hóa
                  hash thành chữ ký điện tử
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Chữ ký số RSA</h3>
          <p className="text-gray-600">
            RSA Digital Signature là một trong những phương pháp chữ ký điện tử
            phổ biến nhất, sử dụng thuật toán RSA kết hợp với các hàm hash như
            SHA-256. Quá trình ký RSA bao gồm việc tạo hash của thông điệp và
            sau đó mã hóa hash này bằng private key của người ký.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  RSA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  RSA là một thuật toán mật mã khóa công khai được sử dụng để
                  tạo chữ ký điện tử.
                </p>
              </CardContent>
            </Card>
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  SHA-256
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  SHA-256 là hàm hash mật mã được sử dụng để tạo ra một giá trị
                  băm với độ dài 256-bit có tính chất gần như duy nhất cho mỗi
                  thông điệp. Nó được thiết kế để rất khó tìm ra hai thông điệp
                  khác nhau tạo ra cùng một giá trị băm
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ứng dụng thực tế</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Lĩnh vực tài chính</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Giao dịch ngân hàng điện tử</li>
                <li>• Hợp đồng tài chính</li>
                <li>• Chứng từ kế toán</li>
                <li>• Báo cáo tài chính</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Chính phủ điện tử</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Văn bản hành chính</li>
                <li>• Giấy tờ pháp lý</li>
                <li>• Dịch vụ công trực tuyến</li>
                <li>• Hồ sơ công dân</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Thương mại điện tử</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Hợp đồng mua bán</li>
                <li>• Hóa đơn điện tử</li>
                <li>• Chứng từ vận chuyển</li>
                <li>• Bảo hành sản phẩm</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Công nghệ thông tin</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Phân phối phần mềm</li>
                <li>• Cập nhật hệ thống</li>
                <li>• Chứng chỉ SSL/TLS</li>
                <li>• API authentication</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Lưu ý bảo mật:</strong> Luôn giữ private key của bạn an toàn
            và không bao giờ chia sẻ với người khác. Private key bị lộ có nghĩa
            là bất kỳ ai cũng có thể tạo chữ ký giả mạo dưới danh nghĩa của bạn.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
