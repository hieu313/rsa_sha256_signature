"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatFileSize } from "@/lib/utils";
import { verifyService } from "@/services/verify-service";
import { DocumentType } from "@/types/sign.type";
import { AxiosError } from "axios";
import {
  AlertTriangle,
  CheckCircle,
  FileSignature,
  FileText,
  Info,
  Search,
  Shield,
  Unlock,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyForm() {
  const [verifyType, setVerifyType] = useState<DocumentType>(DocumentType.TEXT);
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const {
        data: { valid },
      } = await verifyService.verifyContent({
        documentType: verifyType,
        textContent: verifyType === DocumentType.TEXT ? textContent : undefined,
        file:
          verifyType === DocumentType.FILE && selectedFile
            ? selectedFile
            : undefined,
        signatureValue: signature,
        publicKeyPem: publicKey,
      });

      setVerificationResult(valid);
      if (valid) {
        toast.success("Xác thực chữ ký thành công!");
      } else {
        setErrorMessage("Chữ ký không hợp lệ!");
      }
    } catch (error) {
      console.error("Error verifying signature:", error);

      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Có lỗi xảy ra khi xác thực chữ ký";
        setErrorMessage(message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Có lỗi xảy ra khi xác thực chữ ký");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    let errorTimer: NodeJS.Timeout;

    if (errorMessage) {
      toast.error(errorMessage);

      // Tự động xóa error message sau khi đã hiển thị
      errorTimer = setTimeout(() => {
        setErrorMessage("");
      }, 100);
    }

    return () => {
      if (errorTimer) {
        clearTimeout(errorTimer);
      }
    };
  }, [errorMessage]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Verification Options */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Xác thực chữ ký số
          </CardTitle>
          <CardDescription>
            Nhập thông tin cần thiết để xác thực chữ ký
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verify Type Selection */}
          <div className="space-y-3">
            <Label>Loại nội dung cần xác thực</Label>
            <RadioGroup
              value={verifyType}
              onValueChange={(value: DocumentType) => setVerifyType(value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DocumentType.TEXT} id="text" />
                <Label
                  htmlFor={DocumentType.TEXT}
                  className="flex items-center gap-2 font-normal"
                >
                  <FileText className="w-4 h-4" />
                  Văn bản
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DocumentType.FILE} id="file" />
                <Label
                  htmlFor={DocumentType.FILE}
                  className="flex items-center gap-2 font-normal"
                >
                  <Upload className="w-4 h-4" />
                  File
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Content Input */}
          <div className="space-y-4">
            {verifyType === DocumentType.TEXT ? (
              <div className="space-y-2">
                <Label htmlFor="text-content">Nội dung văn bản</Label>
                <Textarea
                  id="text-content"
                  placeholder="Nhập nội dung văn bản cần xác thực..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[120px]"
                />
                {textContent && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>Độ dài: {textContent.length} ký tự</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="file-input">Chọn file</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="*/*"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile
                        ? "Thay đổi file"
                        : "Kéo thả file hoặc click để chọn"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hỗ trợ tất cả các loại file
                    </p>
                  </label>
                </div>
                {selectedFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {selectedFile.name}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {formatFileSize(selectedFile.size)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Signature Input */}
          <div className="space-y-2">
            <Label htmlFor="signature">Chữ ký số (Base64)</Label>
            <Textarea
              id="signature"
              placeholder="Nhập chữ ký số cần xác thực..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="font-mono text-xs h-24"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileSignature className="w-4 h-4" />
              <span>Chữ ký được tạo từ quá trình ký trước đó</span>
            </div>
          </div>

          <Separator />

          {/* Public Key Input */}
          <div className="space-y-2">
            <Label htmlFor="public-key">Public Key (PEM format)</Label>
            <Textarea
              id="public-key"
              placeholder="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="font-mono text-xs h-32"
            />
            <Alert>
              <Unlock className="h-4 w-4" />
              <AlertDescription>
                Public key được sử dụng để xác thực chữ ký. Đây là khóa công
                khai và có thể được chia sẻ.
              </AlertDescription>
            </Alert>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={
              isVerifying ||
              !publicKey.trim() ||
              !signature.trim() ||
              (verifyType === DocumentType.TEXT && !textContent.trim()) ||
              (verifyType === DocumentType.FILE && !selectedFile)
            }
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang xác thực...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Xác thực chữ ký
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Verification Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Kết quả xác thực
          </CardTitle>
          <CardDescription>
            Kết quả xác thực chữ ký sẽ hiển thị ở đây
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationResult === null ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Kết quả sẽ xuất hiện sau khi xác thực
              </p>
            </div>
          ) : verificationResult ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-800">
                  Chữ ký hợp lệ!
                </h3>
                <p className="text-green-700 mt-2">
                  Nội dung đã được xác thực và không bị thay đổi kể từ khi được
                  ký.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Thông tin xác thực</Label>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuật toán:</span>
                    <span className="font-medium">RSA with SHA-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {new Date().toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-medium text-green-600">Hợp lệ</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-red-800">
                  Chữ ký không hợp lệ!
                </h3>
                <p className="text-red-700 mt-2">
                  Nội dung có thể đã bị thay đổi hoặc chữ ký không khớp với nội
                  dung.
                </p>
              </div>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Có thể có một trong các vấn đề sau:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Nội dung đã bị sửa đổi sau khi ký</li>
                    <li>Chữ ký không được tạo bởi khóa tương ứng</li>
                    <li>Định dạng chữ ký không đúng</li>
                    <li>Public key không khớp với private key đã ký</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
