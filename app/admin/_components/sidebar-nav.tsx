'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    LineChart,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders", badge: "6", disabled: true },
    { href: "/admin/customers", icon: Users, label: "Customers", disabled: true },
    { href: "/admin/analytics", icon: LineChart, label: "Analytics", disabled: true },
]

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname()

    return (
        <TooltipProvider>
            <nav className={cn(
                "grid items-start gap-1 px-2 text-sm font-medium lg:px-4",
                isMobile && "gap-2 text-base font-medium px-4"
            )}>
                {navLinks.map(({ href, icon: Icon, label, badge, disabled }) => {
                    const isActive = pathname === href
                    const linkClasses = cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        isActive && "bg-muted text-primary",
                        disabled && "cursor-not-allowed opacity-50",
                        isMobile && "mx-[-0.5rem] gap-4 rounded-xl py-3"
                    )

                    const linkContent = (
                        <>
                            <Icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
                            <span className="flex-1">{label}</span>
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
                                <TooltipContent side="right">
                                    <p>Coming Soon</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    }

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={linkClasses}
                        >
                            {linkContent}
                        </Link>
                    )
                })}
            </nav>
        </TooltipProvider>
    )
} 