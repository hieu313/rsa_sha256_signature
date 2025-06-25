"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/utils";
import type { PublicKey } from "@/types/key.type";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Key,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface KeyDetailDialogProps {
  publicKey: PublicKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyDetailDialog({
  publicKey,
  open,
  onOpenChange,
}: KeyDetailDialogProps) {
  if (!publicKey) return null;

  const isExpired = (expiresAt: string | Date | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const getDaysUntilExpiry = (expiresAt: string | Date | null) => {
    if (!expiresAt) return 0;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã sao chép vào clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getStatusIcon = () => {
    if (publicKey.revoked) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    if (isExpired(publicKey.expiresAt)) {
      return <Clock className="w-5 h-5 text-orange-600" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusText = () => {
    if (publicKey.revoked) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="cursor-help border-b border-dotted border-red-400">
              Khóa đã bị thu hồi.
            </span>
            <TooltipContent>
              <p>
                Khóa đã bị thu hồi. Không thể sử dụng cho việc ký số. Nhưng vẫn
                có thể dùng để xác thực.
              </p>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
      );
    }
    if (isExpired(publicKey.expiresAt)) {
      return "Khóa đã hết hạn";
    }
    return "Khóa đang hoạt động";
  };

  const getStatusColor = () => {
    if (publicKey.revoked) {
      return "text-red-600";
    }
    if (isExpired(publicKey.expiresAt)) {
      return "text-orange-600";
    }
    return "text-green-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Chi tiết khóa công khai
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết và nội dung của khóa công khai
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Trạng thái khóa</Label>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusIcon()}
                  <span className={`font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">ID khóa</Label>
                <div className="font-mono text-sm bg-gray-50 p-2 rounded border mt-1">
                  {publicKey.id}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Tên khóa</Label>
                <div className="font-medium mt-1">{publicKey.keyAlias}</div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Badges</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {publicKey.default && (
                    <Badge variant="default" className="bg-blue-600">
                      Khóa mặc định
                    </Badge>
                  )}
                  {publicKey.revoked && (
                    <Badge variant="destructive">Đã thu hồi</Badge>
                  )}
                  {isExpired(publicKey.expiresAt) && (
                    <Badge variant="destructive">Hết hạn</Badge>
                  )}
                  {!publicKey.revoked && !isExpired(publicKey.expiresAt) && (
                    <Badge variant="default" className="bg-green-600">
                      Hoạt động
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Fingerprint</Label>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border mt-1 break-all">
                  {publicKey.fingerprint}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Thời gian tạo
                  </Label>
                  <div className="text-sm mt-1">
                    {formatDateTime(publicKey.createdAt)}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Thời gian hết hạn
                  </Label>
                  <div className="text-sm mt-1">
                    <span
                      className={
                        isExpired(publicKey.expiresAt)
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {formatDateTime(publicKey.expiresAt)}
                    </span>
                    {!isExpired(publicKey.expiresAt) && (
                      <div className="text-xs text-gray-500 mt-1">
                        Còn {getDaysUntilExpiry(publicKey.expiresAt)} ngày
                      </div>
                    )}
                  </div>
                </div>

                {publicKey.revoked && publicKey.revokedAt && (
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Ngày thu hồi
                    </Label>
                    <div className="text-sm mt-1 text-red-600">
                      {formatDateTime(publicKey.revokedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Public Key Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Nội dung Public Key (PEM)
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(publicKey.publicKeyPem)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Sao chép
              </Button>
            </div>

            <Textarea
              className="font-mono text-xs h-48 resize-none bg-gray-100 cursor-not-allowed w-[700px] mx-auto"
              readOnly
              value={publicKey.publicKeyPem}
            />

            <div className="text-xs text-gray-500">
              Khóa công khai này có thể được sử dụng để xác thực chữ ký số được
              tạo bởi khóa riêng tư tương ứng.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
