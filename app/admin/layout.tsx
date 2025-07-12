"use client";

import { authClient } from "@/auth-client";
import { redirect } from "next/navigation";
import Link from "next/link"
import {
    Bell,
    CircleUser,
    Menu,
    Package2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "./_components/sidebar-nav";
import { useTranslation } from "@/lib/i18n/client";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = authClient.useSession();
    const { t } = useTranslation();

    if (session.isPending) {
        return <div>Loading...</div>;
    }
    if (session.data?.user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-muted/40 lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="hidden xl:inline">Your Shop</span>
                            <span className="xl:hidden">Shop</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">{t("admin.notifications")}</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <SidebarNav />
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Layout */}
            <div className="flex flex-col overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-background z-10">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">{t("admin.toggleNavigation")}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col w-[280px] p-0">
                            <SheetTitle className="sr-only">{t("admin.navigation")}</SheetTitle>
                            <div className="flex h-14 items-center border-b px-4">
                                <Link href="/" className="flex items-center gap-2 font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span>Your Shop</span>
                                </Link>
                            </div>
                            <div className="flex-1">
                                <SidebarNav isMobile />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 font-semibold lg:hidden">
                            <Package2 className="h-5 w-5" />
                            <span className="text-sm">Shop</span>
                        </Link>
                    </div>

                    <div className="w-full flex-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">{t("admin.toggleUserMenu")}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("admin.myAccount")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{t("admin.settings")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("admin.support")}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{t("admin.logout")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-0 sm:gap-6 sm:p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}