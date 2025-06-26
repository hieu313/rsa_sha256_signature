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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { checkIsExpired, cn } from "@/lib/utils";
import { publicKeyUpdateSchema } from "@/schemas/public-key.schema";
import { publicKeyService } from "@/services/public-key-service";
import type { PublicKey, PublicKeyUpdateBody } from "@/types/key.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import { CalendarIcon, Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const form = useForm<PublicKeyUpdateBody>({
    resolver: zodResolver(publicKeyUpdateSchema),
    defaultValues: {
      keyAlias: "",
      expiresAt: null,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (publicKey) {
      form.reset({
        keyAlias: publicKey.keyAlias,
        expiresAt: publicKey.expiresAt
          ? toZonedTime(new Date(publicKey.expiresAt), "Asia/Ho_Chi_Minh")
          : null,
        isDefault: publicKey.default,
      });
    }
  }, [publicKey, form]);

  if (!publicKey) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const onSubmit = async (values: PublicKeyUpdateBody) => {
    try {
      const response = await publicKeyService.updatePublicKey(publicKey.id, {
        keyAlias: values.keyAlias,
        expiresAt: values.expiresAt
          ? fromZonedTime(values.expiresAt, "Asia/Ho_Chi_Minh")
          : null,
        isDefault: values.isDefault,
      });
      onKeyUpdate(response.data);
      toast.success("Cập nhật khóa thành công!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating key:", error);

      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật khóa"
        );
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật khóa");
      }
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Key ID (Read-only) */}
            <FormItem>
              <FormLabel>ID khóa</FormLabel>
              <Input value={publicKey.id} readOnly className="bg-gray-50" />
            </FormItem>

            {/* Key Alias */}
            <FormField
              control={form.control}
              name="keyAlias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên khóa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên khóa..."
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/100 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày hết hạn</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "HH:mm PPP", { locale: vi })
                            : "Chọn ngày hết hạn (tùy chọn)"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={(date) => {
                              if (date) {
                                const currentValue = field.value || new Date();
                                date.setHours(currentValue.getHours());
                                date.setMinutes(currentValue.getMinutes());
                                field.onChange(date);
                              } else {
                                field.onChange(null);
                              }
                            }}
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
                                      field.value &&
                                      field.value.getHours() === hour
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => {
                                      const date = field.value || new Date();
                                      date.setHours(hour);
                                      field.onChange(new Date(date));
                                    }}
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
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i * 5
                                ).map((minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => {
                                      const date = field.value || new Date();
                                      date.setMinutes(minute);
                                      field.onChange(new Date(date));
                                    }}
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                ))}
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
                  </FormControl>
                  {field.value && checkIsExpired(field.value) && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Ngày hết hạn không thể là ngày trong quá khứ
                      </AlertDescription>
                    </Alert>
                  )}
                  <FormDescription>
                    Nếu không chọn ngày hết hạn, khóa sẽ không bao giờ hết hạn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default Key Switch */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Khóa mặc định</FormLabel>
                    <FormDescription>
                      Sử dụng khóa này làm khóa mặc định cho việc ký
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={form.formState.isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
