"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, ChevronUp, Globe } from "lucide-react";
import { useLanguageStore } from "@/stores/language-store";
import { useDictionary } from "@/hooks/use-dictionary";

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLanguageStore();
  const { dictionary, locale: currentLocale } = useDictionary();

  if (!session?.user) return null;

  useEffect(() => {
    if (locale !== currentLocale) {
      setLocale(currentLocale);
    }
  }, [currentLocale, locale, setLocale]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = `/${currentLocale}/login`;
  };

  const handleLanguageChange = (nextLang: string) => {
    if (nextLang !== "ru" && nextLang !== "en" && nextLang !== "zh") return;
    setLocale(nextLang);

    if (typeof window === "undefined") return;

    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = nextLang;
    } else {
      segments.push(nextLang);
    }

    const nextPath = segments.join("/") || `/${nextLang}`;
    router.replace(nextPath);
  };

  const fallbackInitial =
    dictionary.userMenu.fallbackName?.[0]?.toUpperCase() ?? "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[active=true]:bg-sidebar-accent data-[state=open]:bg-sidebar-accent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                {session.user.login?.[0]?.toUpperCase() || fallbackInitial}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session.user.login || dictionary.userMenu.fallbackName}
                </span>
                <span className="truncate text-xs">
                  {session.user.email || session.user.login}
                </span>
              </div>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            side="top"
          >
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{dictionary.userMenu.profile}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{dictionary.userMenu.settings}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="mr-2 h-4 w-4" />
                <span>{dictionary.userMenu.language.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>
                  {dictionary.userMenu.language.description}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={locale}
                  onValueChange={handleLanguageChange}
                >
                  <DropdownMenuRadioItem value="ru">
                    {dictionary.userMenu.language.ru}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="en">
                    {dictionary.userMenu.language.en}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="zh">
                    {dictionary.userMenu.language.zh}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{dictionary.userMenu.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
