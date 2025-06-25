"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { KeyList } from "./_components/key-list";

export default function PublicKeyPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khóa</h1>
          <p className="text-gray-600 mt-1">
            Danh sách các khóa công khai trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.KEY_GENERATE}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo khóa mới
          </Link>
        </Button>
      </div>
      <KeyList />
    </div>
  );
}
