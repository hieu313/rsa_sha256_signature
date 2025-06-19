"use client";

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
import { changeToSlug } from "@/lib/utils";
import { Copy, Download, Info, Lock, Shield, Unlock } from "lucide-react";
import { toast } from "sonner";

interface KeyDisplayProps {
  isGenerated: boolean;
  keyAlias: string;
  publicKey: string | null;
}

export default function KeyDisplay({
  isGenerated,
  keyAlias,
  publicKey,
}: KeyDisplayProps) {
  const downloadKey = (key: string) => {
    const blob = new Blob([key], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${changeToSlug(keyAlias)}-rsa-public-key.pem`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Đã sao chép khóa công khai");
  };
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
                value={isGenerated ? publicKey || "" : ""}
              />
              {isGenerated && publicKey && (
                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyKey(publicKey)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Sao chép
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadKey(publicKey)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Tải xuống
                  </Button>
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
                placeholder="Private key đã được tải xuống tự động khi tạo khóa"
                className="font-mono text-xs h-48 resize-none bg-gray-100 cursor-not-allowed"
                readOnly
                value=""
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
                        Private key đã được tải xuống tự động khi tạo khóa
                      </p>
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
