"use client";

import { RsaHelper } from "@/lib/rsa";
import { changeToSlug, checkAuthClient } from "@/lib/utils";
import { publicKeyService } from "@/services/public-key-service";
import { useState } from "react";
import { toast } from "sonner";
import GenerateGuestKey from "./_components/generate-guest-key";
import KeyDisplay from "./_components/key-display";
import KeyGeneratorOptions from "./_components/key-generator-options";
import RsaInformative from "./_components/rsa-informative";

export default function KeyGeneratePage() {
  const isAuthenticated = checkAuthClient();
  const [keySize, setKeySize] = useState("2048");
  const [keyFormat, setKeyFormat] = useState("pem");
  const [keyAlias, setKeyAlias] = useState("my-rsa-key");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const downloadPrivateKey = (privateKey: string) => {
    const blob = new Blob([privateKey], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${changeToSlug(keyAlias)}-rsa-private-key.pem`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateSuccess = () => {
    setIsGenerating(false);
    setIsGenerated(true);
    toast.success(
      "Khóa RSA đã được tạo thành công. Private key đã được tải xuống."
    );
  };

  const generateError = (message: string) => {
    setIsGenerating(false);
    setIsGenerated(false);
    toast.error(message);
  };

  const generateKeyPair = async () => {
    setIsGenerating(true);
    const keyPair = await RsaHelper.generateKeyPair(Number(keySize));
    setPublicKey(keyPair.publicKey);
    downloadPrivateKey(keyPair.privateKey);
    try {
      if (isAuthenticated) {
        const response = await publicKeyService.uploadPublicKey({
          publicKeyPem: keyPair.publicKey,
          keyAlias,
          keySize: Number(keySize),
        });
        if (!response.success) {
          generateError(response.message);
          return;
        }
      }
      generateSuccess();
    } catch (error) {
      console.log(error);
      generateError("Lỗi khi tạo khóa RSA");
    }
  };

  const handleGenerateKey = async () => {
    if (!isAuthenticated) {
      setShowGuestDialog(true);
      return;
    }
    await generateKeyPair();
  };

  const handleGuestGenerate = async () => {
    setShowGuestDialog(false);
    await generateKeyPair();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Tạo Cặp Khóa RSA</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tạo cặp khóa RSA an toàn để sử dụng cho chữ ký số và mã hóa dữ liệu
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <KeyGeneratorOptions
          keyAlias={keyAlias}
          setKeyAlias={setKeyAlias}
          keySize={keySize}
          setKeySize={setKeySize}
          keyFormat={keyFormat}
          setKeyFormat={setKeyFormat}
          isGenerating={isGenerating}
          handleGenerateKey={handleGenerateKey}
        />
        <KeyDisplay
          isGenerated={isGenerated}
          keyAlias={keyAlias}
          publicKey={publicKey}
        />
      </div>
      <GenerateGuestKey
        isOpen={showGuestDialog}
        onClose={() => setShowGuestDialog(false)}
        isGenerating={isGenerating}
        handleGenerateKey={handleGuestGenerate}
      />
      <RsaInformative />
    </div>
  );
}
