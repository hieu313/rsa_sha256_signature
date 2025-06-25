"use client";

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
import { RsaHelper } from "@/lib/rsa";
import { formatDateTime, formatFileSize } from "@/lib/utils";
import { signService } from "@/services/sign.service";
import { PublicKey } from "@/types/key.type";
import { DocumentType } from "@/types/sign.type";
import { AxiosError } from "axios";
import {
  Calendar,
  CheckCircle,
  Copy,
  Download,
  FileSignature,
  FileText,
  Info,
  Lock,
  Shield,
  Upload,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoginDialog from "./login-dialog";
import NoKeyDialog from "./no-key-dialog";
import { PublicKeySelector } from "./public-key-selector";

interface SignFormProps {
  isAuth: boolean;
}

export default function SignForm({ isAuth }: SignFormProps) {
  const MAX_TEXT_LENGTH = 1000;
  const [hasKey, setHasKey] = useState(true);
  const [showNoKeyDialog, setShowNoKeyDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [signType, setSignType] = useState("text");
  const [textLength, setTextLength] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [keyPairValid, setKeyPairValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedKeyInfo, setSelectedKeyInfo] = useState<PublicKey | null>(
    null
  );
  const [signatureValue, setSignatureValue] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const privateKeyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isAuth) {
      setShowLoginDialog(true);
    }
  }, [isAuth]);

  useEffect(() => {
    if (!hasKey) {
      setShowNoKeyDialog(true);
    }
  }, [hasKey]);

  const handleKeySelect = useCallback((key: PublicKey | null) => {
    setSelectedKeyInfo(key);
    if (key) {
      setPublicKey(key.publicKeyPem);
      setKeyPairValid(null);
    } else {
      setPublicKey("");
      setKeyPairValid(null);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSign = async () => {
    if (!isAuth) {
      setShowLoginDialog(true);
      return;
    }

    if (!hasKey) {
      setShowNoKeyDialog(true);
      return;
    }

    try {
      setIsSigning(true);

      // Lấy private key từ textarea ref thay vì state
      const privateKey = privateKeyRef.current?.value || "";

      if (!privateKey.trim()) {
        toast.error("Vui lòng nhập private key");
        return;
      } else if (
        !privateKey.includes(RsaHelper.BEGIN_PRIVATE_KEY) ||
        !privateKey.includes(RsaHelper.END_PRIVATE_KEY)
      ) {
        toast.error("Private key không đúng định dạng");
        return;
      }

      // Step 1: Create document and get hash value
      const createDocumentData = {
        documentType:
          signType === "text" ? DocumentType.TEXT : DocumentType.FILE,
        textContent: signType === "text" ? textContent : undefined,
        file: signType === "file" && selectedFile ? selectedFile : undefined,
      };

      const {
        data: { hashValue, sessionId },
      } = await signService.createDocument(createDocumentData);

      // Step 2: Sign hash value with private key
      const signature = await RsaHelper.sign(hashValue, privateKey);
      setSignatureValue(signature);

      // Step 3: Verify signature
      const {
        success,
        message,
        data: { signatureId: newSignatureId },
      } = await signService.verifySignature({
        signValue: signature,
        signTimestamp: new Date().toISOString().replace("Z", ""),
        hashValue,
        sessionId,
        publicKeyId: selectedKeyInfo?.id || "",
      });

      if (success) {
        setSignatureId(newSignatureId);
        setIsSigned(true);
        toast.success("Tạo chữ ký số thành công!");
      } else {
        setErrorMessage(message);
      }
    } catch (err) {
      console.error("Error signing document:", err);

      if (err instanceof AxiosError) {
        setErrorMessage(
          err.response?.data?.message || "Có lỗi xảy ra khi tạo chữ ký số"
        );
      } else {
        setErrorMessage("Có lỗi xảy ra khi tạo chữ ký số");
      }
    } finally {
      setIsSigning(false);
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

  const handleCopySignature = async () => {
    try {
      await navigator.clipboard.writeText(signatureValue);
      toast.success("Đã sao chép chữ ký");
    } catch (err) {
      console.error("Error copying signature:", err);
      toast.error("Không thể sao chép chữ ký");
    }
  };

  const handleCopyPublicKey = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      toast.success("Đã sao chép public key");
    } catch (err) {
      console.error("Error copying public key:", err);
      toast.error("Không thể sao chép public key");
    }
  };

  const handleDownloadSignature = () => {
    const blob = new Blob([signatureValue], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signature-${signatureId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Reset isSigned khi có thay đổi
  useEffect(() => {
    setIsSigned(false);
  }, [signType, textContent, selectedFile, publicKey]);

  // Reset isSigned khi private key thay đổi
  useEffect(() => {
    const handlePrivateKeyChange = () => {
      setIsSigned(false);
    };

    const privateKeyElement = privateKeyRef.current;
    if (privateKeyElement) {
      privateKeyElement.addEventListener("input", handlePrivateKeyChange);
      return () => {
        privateKeyElement.removeEventListener("input", handlePrivateKeyChange);
      };
    }
  }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Signing Options */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Tạo chữ ký số
          </CardTitle>
          <CardDescription>
            Chọn loại nội dung và nhập thông tin cần ký
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sign Type Selection */}
          <div className="space-y-3">
            <Label>Loại nội dung cần ký</Label>
            <RadioGroup
              value={signType}
              onValueChange={setSignType}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label
                  htmlFor="text"
                  className="flex items-center gap-2 font-normal"
                >
                  <FileText className="w-4 h-4" />
                  Văn bản
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label
                  htmlFor="file"
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
            {signType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="text-content">Nội dung văn bản</Label>
                <Textarea
                  id="text-content"
                  placeholder="Nhập nội dung văn bản cần ký..."
                  value={textContent}
                  maxLength={MAX_TEXT_LENGTH}
                  onChange={(e) => {
                    setTextContent(e.target.value);
                    setTextLength(e.target.value.length);
                  }}
                  className="min-h-[150px]"
                />
                {textLength > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>
                      Độ dài: {textLength} ký tự / {MAX_TEXT_LENGTH} ký tự
                    </span>
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

          {/* Key Pair Input */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Public Key & Private Key
            </Label>

            <div className="space-y-4">
              {/* Public Key Selection */}
              <div className="space-y-3">
                <Label htmlFor="server-key-select">
                  Chọn Public Key (xứng đôi với Private Key nhập ở dưới)
                </Label>
                <PublicKeySelector
                  onKeySelect={handleKeySelect}
                  isAuthenticated={isAuth}
                  setHasKey={setHasKey}
                />

                {/* Selected Key Info */}
                {selectedKeyInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {selectedKeyInfo.keyAlias}
                        </span>
                        <Badge variant="secondary">
                          {selectedKeyInfo.keySize} bit
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Tạo: {formatDateTime(selectedKeyInfo.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {selectedKeyInfo.fingerprint}
                      </div>
                    </div>
                  </div>
                )}

                {/* Display selected public key */}
                {publicKey && (
                  <div className="space-y-2">
                    <Label htmlFor="display-public-key">
                      Public Key (PEM format)
                    </Label>
                    <Textarea
                      id="display-public-key"
                      value={publicKey}
                      className="font-mono text-xs h-48 resize-none bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Private Key Input */}
              <div className="space-y-2">
                <Label htmlFor="private-key">Private Key (PEM format)</Label>
                <Textarea
                  id="private-key"
                  placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  ref={privateKeyRef}
                  onChange={() => setKeyPairValid(null)}
                  className="font-mono text-xs h-32"
                />
              </div>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <p>
                  Private key của bạn sẽ được xử lý cục bộ và không được gửi đến
                  máy chủ.
                </p>
                <p>
                  Chữ ký sẽ được xác thực trên server với public key đã chọn.
                </p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Sign Button */}
          <Button
            onClick={handleSign}
            disabled={
              isSigning ||
              !privateKeyRef.current?.value.trim() ||
              !publicKey.trim() ||
              (signType === "text" && !textContent.trim()) ||
              (signType === "file" && !selectedFile)
            }
            className="w-full"
            size="lg"
          >
            {isSigning ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang ký...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Tạo chữ ký số
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Signature Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Kết quả
          </CardTitle>
          <CardDescription>Chữ ký số sẽ hiển thị ở đây</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSigned ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSignature className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Chữ ký sẽ xuất hiện sau khi ký</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Chữ ký đã được tạo thành công!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Chữ ký số (Base64)</Label>
                <Textarea
                  value={signatureValue}
                  placeholder="Chữ ký sẽ hiển thị ở đây..."
                  className="font-mono text-xs h-32"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Thông tin chữ ký</Label>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuật toán:</span>
                    <span className="font-medium">RSA with SHA-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Độ dài:</span>
                    <span className="font-medium">256 bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {new Date().toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {selectedKeyInfo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Key Alias:</span>
                      <span className="font-medium">
                        {selectedKeyInfo.keyAlias}
                      </span>
                    </div>
                  )}
                  {keyPairValid && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cặp khóa:</span>
                      <span className="font-medium text-green-600">
                        Đã xác thực
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium font-mono">{signatureId}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopySignature}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Sao chép chữ ký
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleDownloadSignature}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Tải xuống
                </Button>
              </div>

              {publicKey && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyPublicKey}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Sao chép Public Key
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />

      <NoKeyDialog
        isOpen={showNoKeyDialog}
        onClose={() => setShowNoKeyDialog(false)}
      />
    </div>
  );
}
