import { NextResponse } from "next/server";

const locales = ["ru", "en", "zh"];
const defaultLocale = "ru";

// Определяем язык браузера
function getLocale(request: Request) {
  const acceptLanguage = request.headers.get("accept-language") || "";

  if (acceptLanguage.includes("ru")) return "ru";
  if (acceptLanguage.includes("zh")) return "zh";
  if (acceptLanguage.includes("en")) return "en";

  return defaultLocale;
}

export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // ============ 1. ЛОКАЛИ ============
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Если локаль отсутствует → редиректим и выходим (важно!)
  if (!pathnameHasLocale) {
    const locale = getLocale(request);

    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // ============ 2. ОПРЕДЕЛЯЕМ ТЕКУЩУЮ ЛОКАЛЬ ============
  const lang = pathname.split("/")[1];

  // ============ 3. ПРОВЕРКА АВТОРИЗАЦИИ ============
  const token =
    request.headers.get("cookie")?.includes("next-auth.session-token") ||
    request.headers.get("cookie")?.includes("__Secure-next-auth.session-token");

  const isAuthPage =
    pathname.startsWith(`/${lang}/login`) ||
    pathname.startsWith(`/${lang}/register`) ||
    pathname.startsWith(`/${lang}/forgot-password`) ||
    pathname.startsWith(`/${lang}/reset-password`);

  // Если пользователь НЕ авторизован и НЕ на auth-странице → отправляем на /login
  if (!token && !isAuthPage) {
    url.pathname = `/${lang}/login`;
    return NextResponse.redirect(url);
  }

  // Если пользователь авторизован и пытается зайти на login/register → на главную
  if (token && isAuthPage) {
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
