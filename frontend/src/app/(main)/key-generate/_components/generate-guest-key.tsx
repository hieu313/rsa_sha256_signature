import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { Key, LogIn } from "lucide-react";
import Link from "next/link";

interface GenerateGuestKeyProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  handleGenerateKey: () => void;
}

export default function GenerateGuestKey({
  isOpen,
  onClose,
  isGenerating,
  handleGenerateKey,
}: GenerateGuestKeyProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khóa RSA mà không cần đăng nhập</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn tạo khóa RSA mà không cần đăng nhập không? Bạn
            sẽ không thể dùng cặp khóa này trong việc ký ở trang web chúng tôi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleGenerateKey} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang tạo khóa...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Tạo khóa
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={ROUTES.LOGIN}>
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
