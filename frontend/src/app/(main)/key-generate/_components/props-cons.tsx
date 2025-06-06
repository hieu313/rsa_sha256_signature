const props = [
  {
    title: "Bảo mật cao:",
    description: "Dựa trên bài toán phân tích thừa số khó giải quyết",
  },
  {
    title: "Khóa công khai:",
    description:
      "Cho phép chia sẻ khóa công khai mà không ảnh hưởng đến bảo mật",
  },
  {
    title: "Chữ ký số:",
    description: "Hỗ trợ xác thực và không thể phủ nhận",
  },
  {
    title: "Tiêu chuẩn công nghiệp:",
    description: "Được sử dụng rộng rãi và có nhiều thư viện hỗ trợ",
  },
];
const cons = [
  {
    title: "Tốc độ chậm:",
    description:
      "Chậm hơn so với các thuật toán mã hóa đối xứng cùng kích thước khóa",
  },
  {
    title: "Kích thước khóa lớn:",
    description: "Yêu cầu khóa dài để đảm bảo an toàn, nhưng điều này cũng làm tăng tải lượng tính toán",
  },
  {
    title: "Dễ bị tấn công:",
    description:
      "Có thể bị tấn công nếu private key bị lộ",
  },
  {
    title: "Nguy cơ từ máy tính lượng tử:",
    description: "Có thể bị phá vỡ bởi máy tính lượng tử trong tương lai",
  },
];
export default function PropsCons() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ưu điểm của RSA</h3>
        <ul className="space-y-2 text-gray-600">
          {props.map((prop) => (
            <li className="flex items-start" key={prop.title}>
              <div className="mr-2 mt-1">•</div>
              <div>
                <strong>{prop.title}</strong> {prop.description}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Nhược điểm của RSA</h3>
        <ul className="space-y-2 text-gray-600">
          {cons.map((con) => (
            <li className="flex items-start" key={con.title}>
              <div className="mr-2 mt-1">•</div>
              <div>
                <strong>{con.title}</strong> {con.description}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
