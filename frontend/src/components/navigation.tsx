"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  FileSignature,
  Home,
  Key,
  LogIn,
  Menu,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  {
    name: "Trang chủ",
    href: ROUTES.HOME,
    icon: Home,
  },
  {
    name: "Tạo khóa",
    href: ROUTES.KEY_GENERATE,
    icon: Key,
  },
  {
    name: "Ký thông điệp",
    href: ROUTES.SIGN,
    icon: FileSignature,
  },
  {
    name: "Xác thực chữ ký",
    href: ROUTES.VERIFY,
    icon: Shield,
  },
  {
    name: "Đăng nhập",
    href: ROUTES.LOGIN,
    icon: LogIn,
  },
  {
    name: "Đăng ký",
    href: ROUTES.REGISTER,
    icon: UserPlus,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              RSA Signature
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center justify-center space-x-2 px-3 py-2",
                      isActive && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <Icon className="w-4 h-4 m-0" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
