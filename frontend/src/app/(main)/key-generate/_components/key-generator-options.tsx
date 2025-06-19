import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key } from "lucide-react";

interface KeyGeneratorOptionsProps {
  keyAlias: string;
  setKeyAlias: (alias: string) => void;
  keySize: string;
  setKeySize: (size: string) => void;
  keyFormat: string;
  setKeyFormat: (format: string) => void;
  isGenerating: boolean;
  handleGenerateKey: () => void;
}

export default function KeyGeneratorOptions({
  keyAlias,
  setKeyAlias,
  keySize,
  setKeySize,
  keyFormat,
  setKeyFormat,
  isGenerating,
  handleGenerateKey,
}: KeyGeneratorOptionsProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Tùy chọn
        </CardTitle>
        <CardDescription>Cấu hình cặp khóa RSA của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="key-size">Độ dài khóa</Label>
          <RadioGroup
            id="key-size"
            value={keySize}
            onValueChange={setKeySize}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2048" id="r-2048" />
              <Label htmlFor="r-2048" className="font-normal">
                2048 bits (Khuyến nghị)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3072" id="r-3072" />
              <Label htmlFor="r-3072" className="font-normal">
                3072 bits
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4096" id="r-4096" />
              <Label htmlFor="r-4096" className="font-normal">
                4096 bits (Mạnh nhất)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="key-format">Định dạng khóa</Label>
          <Select value={keyFormat} onValueChange={setKeyFormat}>
            <SelectTrigger id="key-format" className="w-full">
              <SelectValue placeholder="Chọn định dạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pem">PEM (Base64)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="key-name">Tên khóa (tùy chọn)</Label>
          <Input
            id="key-name"
            placeholder="my-rsa-key"
            value={keyAlias}
            onChange={(e) => setKeyAlias(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateKey}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Đang tạo khóa...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              Tạo cặp khóa RSA
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
