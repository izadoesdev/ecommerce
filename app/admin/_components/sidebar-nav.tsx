'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    LineChart,
    Package,
    ShoppingCart,
    Users,
    Settings,
    BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/client"

const navLinks = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders", badge: "6", disabled: true },
    { href: "/admin/customers", icon: Users, label: "Customers", disabled: true },
    { href: "/admin/analytics", icon: LineChart, label: "Analytics", disabled: true },
    { href: "/admin/reports", icon: BarChart3, label: "Reports", disabled: true },
    { href: "/admin/settings", icon: Settings, label: "Settings", disabled: true },
]

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname()
    const { t } = useTranslation()

    return (
        <TooltipProvider>
            <nav className={cn(
                "grid items-start gap-1 px-2 text-sm font-medium lg:px-4",
                isMobile && "gap-2 text-base font-medium px-4"
            )}>
                {navLinks.map(({ href, icon: Icon, label, badge, disabled }) => {
                    const isActive = pathname === href
                    const linkClasses = cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                        isActive && "bg-muted text-primary font-medium",
                        disabled && "cursor-not-allowed opacity-50",
                        isMobile && "mx-[-0.5rem] gap-4 rounded-xl py-3 hover:bg-muted/75"
                    )

                    const linkContent = (
                        <>
                            <Icon className={cn("h-4 w-4 shrink-0", isMobile && "h-5 w-5")} />
                            <span className="flex-1 truncate">{label}</span>
                            {badge && (
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs">
                                    {badge}
                                </Badge>
                            )}
                        </>
                    )

                    if (disabled) {
                        return (
                            <Tooltip key={href} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className={linkClasses}>
                                        {linkContent}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                    <p>Coming Soon</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        This feature is under development
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    }

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={linkClasses}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {linkContent}
                        </Link>
                    )
                })}
            </nav>
        </TooltipProvider>
    )
} 