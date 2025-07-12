'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Eye, Copy } from "lucide-react"
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
    try {
        await deleteProduct(id)
        toast.success("Product deleted successfully")
        // Refresh the page to update the data
        window.location.reload()
    } catch (error) {
        toast.error("Failed to delete product")
        console.error("Delete error:", error)
    }
}

async function handleBulkDelete(ids: number[]) {
    try {
        await deleteProducts(ids)
        toast.success("Products deleted successfully")
        // Refresh the page to update the data
        window.location.reload()
    } catch (error) {
        toast.error("Failed to delete products")
        console.error("Bulk delete error:", error)
    }
}

export function ProductsTable({ products }: { products: Product[] }) {
    const { t } = useTranslation()
    const [isDeleting, setIsDeleting] = useState<number | null>(null)

    const handleDeleteWithLoading = async (id: number) => {
        setIsDeleting(id)
        try {
            await handleDelete(id)
        } finally {
            setIsDeleting(null)
        }
    }

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
                    const imageUrl = product.variants[0]?.images[0] ?? "/placeholder.svg"
                    return (
                        <Link href={`/admin/products/${product.slug}`} className="block">
                            <div className="relative aspect-square w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden">
                                <Image
                                    alt={product.name}
                                    className="object-cover transition-transform hover:scale-105"
                                    fill
                                    sizes="(max-width: 640px) 48px, 64px"
                                    src={imageUrl}
                                />
                            </div>
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
                        <div className="flex flex-col gap-1 min-w-0">
                            <Link
                                href={`/admin/products/${product.slug}`}
                                className="hover:underline font-medium truncate text-sm sm:text-base"
                            >
                                {product.name}
                            </Link>
                            <div className="text-xs text-muted-foreground sm:hidden">
                                ₪{formatCurrency(product.variants[0]?.price ?? 0).replace('$', '')}
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                                Stock: {product.variants.reduce((acc, v) => acc + v.stock, 0)}
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                                {product.category?.name}
                            </div>
                        </div>
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

                    return (
                        <Badge
                            variant="outline"
                            className="text-xs hidden sm:inline-flex whitespace-nowrap"
                        >
                            {status.label}
                        </Badge>
                    )
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
                    return (
                        <div className="text-right font-medium hidden sm:block">
                            ₪{formatCurrency(price).replace('$', '')}
                        </div>
                    )
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
                    return (
                        <div className="text-right hidden lg:block">
                            {stock}
                        </div>
                    )
                },
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("admin.products.table.createdAt")} />
                ),
                cell: ({ row }) => (
                    <div className="hidden xl:block text-sm text-muted-foreground">
                        {new Date(row.getValue("createdAt")).toLocaleDateString()}
                    </div>
                ),
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    const product = row.original
                    const isDeletingThis = isDeleting === product.id

                    return (
                        <div className="flex items-center gap-1">
                            {/* Mobile: Direct action buttons */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 sm:hidden"
                                asChild
                            >
                                <Link href={`/admin/products/${product.slug}`}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 sm:hidden"
                                onClick={() => handleDeleteWithLoading(product.id)}
                                disabled={isDeletingThis}
                            >
                                {isDeletingThis ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Delete</span>
                            </Button>

                            {/* Desktop: Dropdown menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 hidden sm:flex">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/product/${product.slug}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Product
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.slug}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/product/${product.slug}`)
                                            toast.success("Product URL copied to clipboard")
                                        }}
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy URL
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500"
                                        onClick={() => handleDeleteWithLoading(product.id)}
                                        disabled={isDeletingThis}
                                    >
                                        {isDeletingThis ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
        ],
        [t, isDeleting]
    )

    return (
        <AdvancedDataTable
            columns={columns}
            data={products}
            onDeleteSelected={handleBulkDelete}
        />
    )
} 