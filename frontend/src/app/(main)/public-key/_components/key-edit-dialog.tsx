"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PublicKey } from "@/types/key.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Edit, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface KeyEditDialogProps {
  publicKey: PublicKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeyUpdate: (updatedKey: PublicKey) => void;
}

export function KeyEditDialog({
  publicKey,
  open,
  onOpenChange,
  onKeyUpdate,
}: KeyEditDialogProps) {
  const [keyAlias, setKeyAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setKeyAlias(publicKey.keyAlias);
      setExpiresAt(publicKey.expiresAt);
      setIsDefault(publicKey.default);
    }
  }, [publicKey]);

  if (!publicKey) return null;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setExpiresAt(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (expiresAt) {
      const newDate = new Date(expiresAt);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setExpiresAt(newDate);
    }
  };
  const handleSave = async () => {
    if (!keyAlias.trim() || !expiresAt) return;

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const updatedKey: PublicKey = {
        ...publicKey,
        keyAlias: keyAlias.trim(),
        expiresAt,
        default: isDefault,
      };

      onKeyUpdate(updatedKey);
      setIsSaving(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (publicKey) {
      setKeyAlias(publicKey.keyAlias);
      setExpiresAt(publicKey.expiresAt);
      setIsDefault(publicKey.default);
    }
    onOpenChange(false);
  };

  const isExpired = (date: Date) => {
    return new Date() > date;
  };

  const isFormValid = keyAlias.trim() && expiresAt && !isExpired(expiresAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Chỉnh sửa khóa
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin khóa công khai
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key ID (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="key-id">ID khóa</Label>
            <Input
              id="key-id"
              value={publicKey.id}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* Key Alias */}
          <div className="space-y-2">
            <Label htmlFor="key-alias">
              Tên khóa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="key-alias"
              value={keyAlias}
              onChange={(e) => setKeyAlias(e.target.value)}
              placeholder="Nhập tên khóa..."
              maxLength={100}
            />
            <div className="text-xs text-gray-500">
              {keyAlias.length}/100 ký tự
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>
              Ngày hết hạn <span className="text-red-500">*</span>
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt
                    ? format(expiresAt, "HH:mm PPP", { locale: vi })
                    : "Chọn ngày hết hạn"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={expiresAt ?? undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                  />
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {hours.reverse().map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              expiresAt && expiresAt.getHours() === hour
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() =>
                              handleTimeChange("hour", hour.toString())
                            }
                          >
                            {hour}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                          (minute) => (
                            <Button
                              key={minute}
                              size="icon"
                              variant={
                                expiresAt && expiresAt.getMinutes() === minute
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() =>
                                handleTimeChange("minute", minute.toString())
                              }
                            >
                              {minute.toString().padStart(2, "0")}
                            </Button>
                          )
                        )}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {expiresAt && isExpired(expiresAt) && (
              <Alert variant="destructive">
                <AlertDescription>
                  Ngày hết hạn không thể là ngày trong quá khứ
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Default Key Switch */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="default-key">Khóa mặc định</Label>
              <div className="text-sm text-gray-500">
                Sử dụng khóa này làm khóa mặc định cho việc ký
              </div>
            </div>
            <Switch
              id="default-key"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>

          {/* Fingerprint (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="fingerprint">Fingerprint</Label>
            <Textarea
              id="fingerprint"
              value={publicKey.fingerprint}
              readOnly
              className="bg-gray-50 font-mono text-xs h-16 resize-none"
            />
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Chỉ có thể chỉnh sửa tên khóa, ngày hết hạn và trạng thái mặc
              định. Nội dung khóa và fingerprint không thể thay đổi.
            </AlertDescription>
          </Alert>

          {/* Revoked Key Warning */}
          {publicKey.revoked && (
            <Alert variant="destructive">
              <AlertDescription>
                Khóa này đã bị thu hồi. Bạn vẫn có thể chỉnh sửa thông tin nhưng
                khóa sẽ không thể được sử dụng để tạo chữ ký mới.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid || isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
