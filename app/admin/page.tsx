import { Activity, ArrowUpRight, CreditCard, Users, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n"

// Mock data - in production, this would come from your API
const stats = {
    totalRevenue: 45231.89,
    revenueChange: 20.1,
    subscriptions: 2350,
    subscriptionChange: 180.1,
    sales: 12234,
    salesChange: 19,
    activeUsers: 573,
    activeChange: 201,
}

const recentTransactions = [
    {
        id: 1,
        customer: "Liam Johnson",
        email: "liam@example.com",
        type: "Sale",
        status: "Approved",
        date: "2023-06-23",
        amount: 250.00,
    },
    {
        id: 2,
        customer: "Olivia Smith",
        email: "olivia@example.com",
        type: "Refund",
        status: "Declined",
        date: "2023-06-24",
        amount: 150.00,
    },
    {
        id: 3,
        customer: "Emma Davis",
        email: "emma@example.com",
        type: "Sale",
        status: "Approved",
        date: "2023-06-25",
        amount: 350.00,
    },
    {
        id: 4,
        customer: "Noah Wilson",
        email: "noah@example.com",
        type: "Sale",
        status: "Pending",
        date: "2023-06-26",
        amount: 125.00,
    },
]

function StatCard({
    title,
    value,
    change,
    icon: Icon,
    trend = "up",
    isCurrency = false
}: {
    title: string
    value: string | number
    change: number
    icon: any
    trend?: "up" | "down"
    isCurrency?: boolean
}) {
    const isPositive = change >= 0
    const TrendIcon = trend === "up" ? TrendingUp : TrendingDown

    const displayValue = isCurrency && typeof value === 'string' && value.startsWith('$')
        ? `₪${value.replace('$', '')}`
        : value

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <TrendIcon className={`mr-1 h-3 w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                    {isPositive ? '+' : ''}{change}% from last month
                </div>
            </CardContent>
        </Card>
    )
}

export default async function AdminPage() {
    const { t } = await useTranslation()

    return (
        <>
            {/* Stats Cards - Mobile Responsive Grid */}
            <div className="grid gap-4 px-4 sm:px-0 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatCard
                    title={t("admin.dashboard.totalRevenue")}
                    value={`₪${stats.totalRevenue.toLocaleString()}`}
                    change={stats.revenueChange}
                    icon={CreditCard}
                    isCurrency={true}
                />
                <StatCard
                    title={t("admin.dashboard.subscriptions")}
                    value={stats.subscriptions.toLocaleString()}
                    change={stats.subscriptionChange}
                    icon={Users}
                />
                <StatCard
                    title={t("admin.dashboard.sales")}
                    value={stats.sales.toLocaleString()}
                    change={stats.salesChange}
                    icon={CreditCard}
                />
                <StatCard
                    title={t("admin.dashboard.activeNow")}
                    value={stats.activeUsers.toLocaleString()}
                    change={stats.activeChange}
                    icon={Activity}
                />
            </div>

            {/* Transactions Section - Mobile Responsive */}
            <div className="grid gap-4 px-4 sm:px-0 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="lg:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle>{t("admin.dashboard.transactions")}</CardTitle>
                        <CardDescription>
                            {t("admin.dashboard.transactionsDesc")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("admin.dashboard.customer")}</TableHead>
                                        <TableHead className="hidden lg:table-column">
                                            {t("admin.dashboard.type")}
                                        </TableHead>
                                        <TableHead className="hidden xl:table-column">
                                            {t("admin.dashboard.status")}
                                        </TableHead>
                                        <TableHead className="hidden md:table-column">
                                            {t("admin.dashboard.date")}
                                        </TableHead>
                                        <TableHead className="text-right">{t("admin.dashboard.amount")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                <div className="font-medium">{transaction.customer}</div>
                                                <div className="hidden text-sm text-muted-foreground sm:inline">
                                                    {transaction.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-column">
                                                {transaction.type}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                <Badge
                                                    className="text-xs"
                                                    variant={transaction.status === 'Approved' ? 'default' :
                                                        transaction.status === 'Declined' ? 'destructive' : 'outline'}
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-column">
                                                {transaction.date}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ₪{transaction.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-center space-x-2 pt-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/orders">
                                    {t("admin.dashboard.viewAll")}
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}