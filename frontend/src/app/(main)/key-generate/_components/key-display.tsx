import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Info, Lock, Shield, Unlock } from "lucide-react";

interface KeyDisplayProps {
  isGenerated: boolean;
}

export default function KeyDisplay({ isGenerated }: KeyDisplayProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Cặp khóa RSA
        </CardTitle>
        <CardDescription>
          Khóa công khai và khóa riêng tư của bạn sẽ hiển thị ở đây
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              <span>Public Key</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Private Key</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="public" className="space-y-4 mt-4">
            <div className="relative">
              <Textarea
                placeholder={
                  isGenerated ? "" : "Public key sẽ hiển thị ở đây..."
                }
                className="font-mono text-xs h-48 resize-none bg-gray-100 cursor-not-allowed"
                readOnly
              />
              {isGenerated && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Unlock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Public Key</p>
                      <p className="text-sm text-gray-500">
                        Khóa công khai của bạn đã được tạo
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4 mr-1" />
                        Sao chép
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Public key có thể được chia sẻ công khai và được sử dụng để xác
                minh chữ ký hoặc mã hóa dữ liệu.
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="private" className="space-y-4 mt-4">
            <div className="relative">
              <Textarea
                placeholder={
                  isGenerated ? "" : "Private key sẽ hiển thị ở đây..."
                }
                className="font-mono text-xs h-48 resize-none bg-gray-100 cursor-not-allowed"
                readOnly
              />
              {isGenerated && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Private Key</p>
                      <p className="text-sm text-gray-500">
                        Khóa riêng tư của bạn đã được tạo
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4 mr-1" />
                        Sao chép
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Private key phải được giữ bí mật. Không bao giờ chia sẻ private
                key của bạn với người khác.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
