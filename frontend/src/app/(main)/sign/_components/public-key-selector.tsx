"use client";

import { PublicKeyCombobox } from "@/components/public-key-combobox";
import { useDebounce } from "@/hooks/use-debounce";
import { publicKeyService } from "@/services/public-key-service";
import { PublicKey } from "@/types/key.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface PublicKeySelectorProps {
  onKeySelect: (key: PublicKey | null) => void;
  isAuthenticated: boolean;
  setHasKey: (hasKey: boolean) => void;
}

export function PublicKeySelector({
  onKeySelect,
  isAuthenticated,
  setHasKey,
}: PublicKeySelectorProps) {
  const [selectedServerKey, setSelectedServerKey] = useState("");
  const [serverKeys, setServerKeys] = useState<PublicKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [searchKeyAlias, setSearchKeyAlias] = useState("");
  const debouncedSearch = useDebounce(searchKeyAlias, 300);

  const loadServerKeys = useCallback(async (keyAlias?: string) => {
    if (!isAuthenticated) {
      return;
    }
    setIsLoadingKeys(true);
    try {
      const response = await publicKeyService.getActivePublicKeys(keyAlias);
      setServerKeys(response.data);
      setHasKey(response.data.length > 0);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải public key. Vui lòng thử lại sau");
    } finally {
      setIsLoadingKeys(false);
    }
  }, []);

  useEffect(() => {
    loadServerKeys(debouncedSearch);
  }, [debouncedSearch, loadServerKeys]);

  const handleServerKeySelect = useCallback(
    (keyId: string) => {
      setSelectedServerKey(keyId);
      const selectedKey = serverKeys.find((key) => key.id === keyId);
      onKeySelect(selectedKey || null);
    },
    [serverKeys, onKeySelect]
  );

  const handleSearchKeys = useCallback((search: string) => {
    setSearchKeyAlias(search);
  }, []);

  const handleOpenCombobox = useCallback(() => {
    if (serverKeys.length === 0) {
      loadServerKeys(searchKeyAlias);
    }
  }, [loadServerKeys, searchKeyAlias, serverKeys.length]);

  return (
    <PublicKeyCombobox
      keys={serverKeys}
      value={selectedServerKey}
      onValueChange={handleServerKeySelect}
      onSearch={handleSearchKeys}
      onOpen={handleOpenCombobox}
      placeholder="Chọn public key đang hoạt động..."
      isLoading={isLoadingKeys}
    />
  );
}
