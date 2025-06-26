"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkIsExpired, formatDateTime } from "@/lib/utils";
import { publicKeyService } from "@/services/public-key-service";
import { PublicKey, PublicKeyMeta } from "@/types/key.type";
import { Ban, Edit, Eye, Key, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyDetailDialog } from "./key-detail-dialog";
import { KeyEditDialog } from "./key-edit-dialog";
import RevokeKeyDialog from "./revoke-key-dialog";

export const KeyList = () => {
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [meta, setMeta] = useState<PublicKeyMeta | null>(null);
  const [selectedKey, setSelectedKey] = useState<PublicKey | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<PublicKey | null>(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const { data } = await publicKeyService.getMyPublicKeys();
        setKeys(data.keys);
        setMeta(data.meta);
      } catch {
        toast.error("Không thể tải danh sách khóa");
      }
    };

    fetchKeys();
  }, []);

  const getStatusBadges = (key: PublicKey) => {
    const badges = [];

    if (key.revoked) {
      badges.push(
        <Badge key="revoked" variant="destructive">
          Đã thu hồi
        </Badge>
      );
    }

    if (checkIsExpired(key.expiresAt)) {
      badges.push(
        <Badge key="expired" variant="destructive">
          Hết hạn
        </Badge>
      );
    }

    if (!key.revoked && !checkIsExpired(key.expiresAt)) {
      badges.push(
        <Badge key="active" variant="success">
          Hoạt động
        </Badge>
      );
    }

    return badges;
  };

  const handleViewDetail = (key: PublicKey) => {
    setSelectedKey(key);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (key: PublicKey) => {
    setSelectedKey(key);
    setIsEditDialogOpen(true);
  };
  const handleRevokeClick = (key: PublicKey) => {
    setKeyToRevoke(key);
    setIsRevokeDialogOpen(true);
  };

  const handleRevoke = async () => {
    if (!keyToRevoke) return;
    try {
      await publicKeyService.revokeKey(keyToRevoke.id);
      setIsRevokeDialogOpen(false);
      setKeys((prevKeys) =>
        prevKeys.map((key) =>
          key.id === keyToRevoke.id ? { ...key, revoked: true } : key
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Không thể thu hồi khóa");
    }
  };

  const handleKeyUpdate = (updatedKey: PublicKey) => {
    setKeys((prevKeys) =>
      prevKeys.map((key) => (key.id === updatedKey.id ? updatedKey : key))
    );
  };
  if (!keys) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Danh sách khóa ({keys.length})
          </CardTitle>
          <CardDescription>
            Quản lý và xem chi tiết các khóa công khai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên khóa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead>Thời gian hết hạn</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Chưa có khóa nào
                    </TableCell>
                  </TableRow>
                ) : (
                  keys.map((key) => (
                    <TableRow key={key.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">
                        {key.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {key.keyAlias}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getStatusBadges(key)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDateTime(key.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <span
                          className={
                            checkIsExpired(key.expiresAt)
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {formatDateTime(key.expiresAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(key)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!key.revoked && (
                                <DropdownMenuItem
                                  onClick={() => handleEdit(key)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleRevokeClick(key)}
                                disabled={key.revoked}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Ban className="w-4 h-4 mr-2 text-red-600" />
                                {key.revoked ? "Đã thu hồi" : "Thu hồi khóa"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {meta?.total}
            </div>
            <div className="text-sm text-gray-600">Tổng số khóa</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {meta?.active}
            </div>
            <div className="text-sm text-gray-600">Hoạt động</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {meta?.revoked}
            </div>
            <div className="text-sm text-gray-600">Đã thu hồi</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {meta?.expired}
            </div>
            <div className="text-sm text-gray-600">Hết hạn</div>
          </CardContent>
        </Card>
      </div>

      {/* Key Detail Dialog */}
      <KeyDetailDialog
        key={selectedKey?.id}
        publicKey={selectedKey}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <KeyEditDialog
        publicKey={selectedKey}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onKeyUpdate={handleKeyUpdate}
      />

      <RevokeKeyDialog
        isOpen={isRevokeDialogOpen}
        onClose={() => setIsRevokeDialogOpen(false)}
        onRevoke={handleRevoke}
      />
    </>
  );
};
