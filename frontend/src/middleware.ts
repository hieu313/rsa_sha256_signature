import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import { ROUTES } from "@/constants/routes";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];

export default function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME);
  const isAuthRoute = AUTH_ROUTES.includes(req.nextUrl.pathname);
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
  }
  return NextResponse.next();
}
