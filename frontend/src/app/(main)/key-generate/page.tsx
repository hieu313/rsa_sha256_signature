"use client";

import { useState } from "react";
import KeyDisplay from "./_components/key-display";
import KeyGeneratorOptions from "./_components/key-generator-options";
import RsaInformative from "./_components/rsa-informative";

export default function KeyGeneratePage() {
  const [keySize, setKeySize] = useState("2048");
  const [keyFormat, setKeyFormat] = useState("pem");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);

    // Simulate key generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
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
          keySize={keySize}
          setKeySize={setKeySize}
          keyFormat={keyFormat}
          setKeyFormat={setKeyFormat}
          isGenerating={isGenerating}
          handleGenerateKey={handleGenerateKey}
        />
        <KeyDisplay isGenerated={isGenerated} />
      </div>
      <RsaInformative />
    </div>
  );
}
