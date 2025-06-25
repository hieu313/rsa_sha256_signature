"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { UserProfile } from "@/types/auth.type";
import Cookies from "js-cookie";
import {
  FileSignature,
  Key,
  LogIn,
  LogOut,
  Settings,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  guestOnly: boolean;
  isAuthOnly?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    name: "Tạo khóa",
    href: ROUTES.KEY_GENERATE,
    icon: Key,
    guestOnly: false,
  },
  {
    name: "Ký thông điệp",
    href: ROUTES.SIGN,
    icon: FileSignature,
    guestOnly: false,
  },
  {
    name: "Xác thực chữ ký",
    href: ROUTES.VERIFY,
    icon: Shield,
    guestOnly: false,
  },
  {
    name: "Đăng nhập",
    href: ROUTES.LOGIN,
    icon: LogIn,
    guestOnly: true,
  },
  {
    name: "Đăng ký",
    href: ROUTES.REGISTER,
    icon: UserPlus,
    guestOnly: true,
  },
  {
    name: "Quản lý khóa",
    href: ROUTES.PUBLIC_KEY,
    icon: Key,
    guestOnly: false,
    isAuthOnly: true,
  },
  {
    name: "Quản lý chữ ký",
    href: ROUTES.SIGNATURE,
    icon: FileSignature,
    guestOnly: false,
    isAuthOnly: true,
  },
];

export function Navigation({ isAuth }: { isAuth: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              RSA Signature
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.href}
                item={item}
                isAuth={isAuth}
                pathname={pathname}
              />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <UserDropdownMenu isAuth={isAuth} />
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavigationItem = ({
  item,
  isAuth,
  pathname,
}: {
  item: NavigationItem;
  isAuth: boolean;
  pathname: string;
}) => {
  const Icon = item.icon;
  const isActive = pathname === item.href;

  if (item.guestOnly && isAuth) return null;
  if (item.isAuthOnly && !isAuth) return null;

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start space-x-2",
          isActive && "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <Icon className="w-4 h-4" />
        <span>{item.name}</span>
      </Button>
    </Link>
  );
};

const UserDropdownMenu = ({ isAuth }: { isAuth: boolean }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isAuth) {
      authService.profile().then((res) => setCurrentUser(res.data));
    }
  }, [isAuth]);

  if (!isAuth) return null;

  const handleLogout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    startTransition(() => {
      router.push(ROUTES.HOME);
      router.refresh();
      toast.success("Đăng xuất thành công");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 rounded-lg"
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium max-w-32 truncate">
            {currentUser?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PUBLIC_KEY} className="flex items-center">
            <Key className="mr-2 h-4 w-4" />
            <span>Quản lý khóa</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.SIGNATURE} className="flex items-center">
            <FileSignature className="mr-2 h-4 w-4" />
            <span>Quản lý chữ ký</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE} className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt tài khoản</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
