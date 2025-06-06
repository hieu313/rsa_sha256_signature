import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const applications = [
  {
    title: "SSL/TLS",
    description: "Bảo mật kết nối HTTPS giữa trình duyệt và máy chủ web",
  },
  {
    title: "Chữ ký số",
    description: "Xác thực tài liệu điện tử, phần mềm và giao dịch",
  },
  {
    title: "Mã hóa email",
    description: "Bảo vệ nội dung email khỏi bị đọc trộm",
  },
];

export default function Application() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ứng dụng của RSA</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {applications.map((application) => (
          <Card key={application.title} className="gap-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{application.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{application.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
