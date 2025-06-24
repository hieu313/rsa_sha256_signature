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
import { Home, LogIn } from "lucide-react";
import Link from "next/link";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          <DialogDescription>
            Bạn cần đăng nhập để sử dụng tính năng ký số. Vui lòng đăng nhập để
            tiếp tục.
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
            <Link href={ROUTES.LOGIN}>
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
