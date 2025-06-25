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
import { ROUTES } from "@/constants/routes";
import { Home, Key } from "lucide-react";
import Link from "next/link";

interface NoKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoKeyDialog({ isOpen, onClose }: NoKeyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Không có khóa công khai đang hoạt động</DialogTitle>
          <DialogDescription>
            Vui lòng tạo khóa công khai để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" asChild>
            <Link href={ROUTES.HOME}>
              <Home className="w-4 h-4 mr-2" />
              Quay về trang chủ
            </Link>
          </Button>
          <Button type="button" variant="default" asChild>
            <Link href={ROUTES.KEY_GENERATE}>
              <Key className="w-4 h-4 mr-2" />
              Tạo khóa
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
