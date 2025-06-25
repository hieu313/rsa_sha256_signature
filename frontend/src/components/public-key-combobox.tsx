"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { Calendar, Check, ChevronsUpDown, Key } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateTime } from "@/lib/utils";
import { PublicKey } from "@/types/key.type";

interface PublicKeyComboboxProps {
  keys: PublicKey[];
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (search: string) => void;
  onOpen?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function PublicKeyCombobox({
  keys,
  value,
  onValueChange,
  onSearch,
  onOpen,
  placeholder = "Chọn public key...",
  isLoading = false,
  className,
}: PublicKeyComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  React.useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  const selectedKey = keys.find((key) => key.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedKey ? (
              <>
                <Key className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{selectedKey.keyAlias}</span>
                <Badge variant="outline" className="ml-auto flex-shrink-0">
                  {selectedKey.keySize} bit
                </Badge>
              </>
            ) : (
              <span className="text-muted-foreground">
                {isLoading ? "Đang tải..." : placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Tìm kiếm public key..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy public key.</CommandEmpty>
            <CommandGroup>
              {keys.map((key) => (
                <CommandItem
                  key={key.id}
                  value={`${key.keyAlias} ${key.keyUsage} ${key.fingerprint}`}
                  onSelect={() => {
                    onValueChange(key.id === value ? "" : key.id);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Key className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium flex-1 truncate">
                      {key.keyAlias}
                    </span>
                    <Badge variant="outline" className="flex-shrink-0">
                      {key.keySize} bit
                    </Badge>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 flex-shrink-0",
                        value === key.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                    <Calendar className="w-3 h-3" />
                    <span>Tạo: {formatDateTime(key.createdAt)}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
