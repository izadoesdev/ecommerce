'use client'

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AdvancedDataTable } from "@/components/ui/data-table-advanced"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/client"
import { formatCurrency } from "@/lib/utils"
import { statuses } from "@/lib/constants"
import { deleteProduct, deleteProducts, getProducts } from "./actions"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

type Product = Awaited<ReturnType<typeof getProducts>>[number]

async function handleDelete(id: number) {
    const result = await deleteProduct(id)
    if (result.success) {
        toast.success(result.success)
    } else if (result.error) {
        toast.error(result.error)
    }
}

async function handleBulkDelete(ids: number[]) {
    const result = await deleteProducts(ids);
    if (result.success) {
        toast.success(result.success)
    } else if (result.error) {
        toast.error(result.error)
    }
}

export function ProductsTable({ products }: { products: Product[] }) {
    const { t } = useTranslation()

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "image",
                header: "Image",
                cell: ({ row }) => {
                    const product = row.original
                    return (
                        <Link href={`/admin/products/${product.slug}`}>
                            <Image
                                alt={product.name}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={product.variants[0]?.images[0] ?? "/placeholder.svg"}
                                width="64"
                            />
                        </Link>
                    )
                },
                enableSorting: false,
            },
            {
                accessorKey: "name",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.name")} />
                ),
                cell: ({ row }) => {
                    const product = row.original
                    return (
                        <Link href={`/admin/products/${product.slug}`} className="hover:underline">
                            {product.name}
                        </Link>
                    )
                }
            },
            {
                accessorKey: "status",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.status")} />
                ),
                cell: ({ row }) => {
                    const status = statuses.find(
                        (status) => status.value === row.getValue("status")
                    )

                    if (!status) {
                        return null
                    }

                    return <Badge variant="outline">{status.label}</Badge>
                },
                filterFn: (row, id, value) => {
                    return value.includes(row.getValue(id))
                },
            },
            {
                accessorKey: "price",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.price")} className="justify-end" />
                ),
                cell: ({ row }) => {
                    const variants = row.original.variants
                    const price = variants[0]?.price ?? 0
                    return <div className="text-right font-medium">{formatCurrency(price)}</div>
                },
            },
            {
                accessorKey: "stock",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.stock")} className="text-right" />
                ),
                cell: ({ row }) => {
                    const variants = row.original.variants
                    const stock = variants.reduce((acc, v) => acc + v.stock, 0)
                    return <div className="text-right">{stock}</div>
                },
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.createdAt")} />
                ),
                cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    const product = row.original
                    return (
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.slug}`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
        ],
        [t]
    )

    return (
        <AdvancedDataTable
            columns={columns}
            data={products}
            onDeleteSelected={handleBulkDelete}
        />
    )
} 