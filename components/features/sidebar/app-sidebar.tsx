import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Briefcase,
  Newspaper,
  Landmark,
  Orbit,
  Moon,
  Sun,
  PanelLeftClose,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useDictionary } from "@/hooks/use-dictionary";
import { UserMenu } from "./user-menu";

const navigationItems = [
  { key: "home", url: "", icon: Home },
  { key: "catarium", url: "/catarium", icon: Orbit },
  { key: "news", url: "/news", icon: Newspaper },
  { key: "work", url: "/labor-market", icon: Briefcase },
  { key: "politics", url: "/politics", icon: Landmark },
] as const;

function BrandMenuItem({ label, href }: { label: string; href: string }) {
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={label}>
        <Link href={href}>
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-base font-bold">
            C
          </div>
          {state === "expanded" && (
            <span className="text-base font-semibold">{label}</span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function CollapseMenuItem({
  collapseLabel,
  expandLabel,
}: {
  collapseLabel: string;
  expandLabel: string;
}) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggleSidebar}
        tooltip={isCollapsed ? expandLabel : collapseLabel}
      >
        <PanelLeftClose
          className={isCollapsed ? "rotate-180 transition-transform" : ""}
        />
        <span>{isCollapsed ? expandLabel : collapseLabel}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ThemeMenuItem({
  label,
  options,
}: {
  label: string;
  options: { light: string; dark: string; system: string };
}) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={label} className="justify-start">
          <Icon />
          <span>{label}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-40">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) =>
            setTheme(
              value === "light" || value === "dark" ? value : "system",
            )
          }
        >
          <DropdownMenuRadioItem value="light">
            {options.light}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            {options.dark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            {options.system}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { dictionary, locale } = useDictionary();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarMenu className="px-2 py-2">
          <BrandMenuItem label={dictionary.app.brand} href={`/${locale}`} />
          <CollapseMenuItem
            collapseLabel={dictionary.sidebar.collapse}
            expandLabel={dictionary.sidebar.expand}
          />
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>{dictionary.sidebar.menuLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const href = `/${locale}${item.url}`;
                const title = dictionary.navigation[item.key];
                const isRoot = href === `/${locale}`;
                const isActive = isRoot
                  ? pathname === href
                  : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={title}
                    >
                      <Link href={href}>
                      <item.icon />
                        <span>{title}</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeMenuItem
              label={dictionary.sidebar.theme.label}
              options={dictionary.sidebar.theme.options}
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
