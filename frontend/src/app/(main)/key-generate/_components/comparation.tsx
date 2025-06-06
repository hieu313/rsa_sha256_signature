export default function Comparation() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">So sánh với các thuật toán khác</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Thuật toán</th>
              <th className="border p-2 text-left">Loại</th>
              <th className="border p-2 text-left">Độ dài khóa</th>
              <th className="border p-2 text-left">Tốc độ</th>
              <th className="border p-2 text-left">Bảo mật</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">RSA</td>
              <td className="border p-2">Khóa công khai</td>
              <td className="border p-2">2048-4096 bits</td>
              <td className="border p-2">Chậm</td>
              <td className="border p-2">Cao</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">ECC</td>
              <td className="border p-2">Khóa công khai</td>
              <td className="border p-2">256-384 bits</td>
              <td className="border p-2">Nhanh hơn RSA</td>
              <td className="border p-2">Cao</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">AES</td>
              <td className="border p-2">Khóa đối xứng</td>
              <td className="border p-2">128-256 bits</td>
              <td className="border p-2">Rất nhanh</td>
              <td className="border p-2">Cao</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">DSA</td>
              <td className="border p-2">Khóa công khai</td>
              <td className="border p-2">1024-3072 bits</td>
              <td className="border p-2">Nhanh hơn RSA</td>
              <td className="border p-2">Cao</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
