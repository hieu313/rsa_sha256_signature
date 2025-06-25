"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RevokeKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRevoke: () => void;
}

export default function RevokeKeyDialog({
  isOpen,
  onClose,
  onRevoke,
}: RevokeKeyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thu hồi khóa công khai</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn thu hồi khóa công khai này không?
            <br />
            <span className="text-red-500">
              Lưu ý: Khóa công khai sẽ không còn sử dụng cho việc ký sau khi thu
              hồi. Bạn không thể hoàn tác thao tác này.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={onRevoke}>
            Thu hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
