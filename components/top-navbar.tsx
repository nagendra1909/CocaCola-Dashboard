"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Download,
  BoxIcon as Bottle,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Bell,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useInventoryStore } from "@/lib/inventory-store"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Incoming Stock",
    href: "/incoming-stock",
    icon: TrendingUp,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Export",
    href: "/export",
    icon: Download,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 hover:bg-red-50 dark:hover:bg-red-950/20"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function TopNavbar() {
  const pathname = usePathname()
  const { getLowStockVariants, getCriticalStockVariants } = useInventoryStore()

  const lowStockCount = getLowStockVariants().length
  const criticalStockCount = getCriticalStockVariants().length
  const totalAlerts = lowStockCount + criticalStockCount

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Clean Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <Bottle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Coca-Cola
            </h1>
            <p className="text-xs text-muted-foreground">Distributor Portal</p>
          </div>
        </div>

        {/* Clean Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : "hover:bg-red-50 dark:hover:bg-red-950/20"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
                {item.href === "/alerts" && totalAlerts > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1 py-0 ml-1 animate-pulse">{totalAlerts}</Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>

        {/* Clean Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-red-50 dark:hover:bg-red-950/20">
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
                {totalAlerts}
              </Badge>
            )}
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-red-50 dark:hover:bg-red-950/20">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                </Link>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
