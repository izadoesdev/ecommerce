"use client"

import { X } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { useTranslation } from "@/lib/i18n/client"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onDeleteSelected?: (ids: number[]) => Promise<void>
}

export function DataTableToolbar<TData>({
    table,
    onDeleteSelected,
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation()
    const isFiltered = table.getState().columnFilters.length > 0
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDeleteSelected = async () => {
        if (!onDeleteSelected || selectedRows.length === 0) return

        const ids = selectedRows.map((row) => (row.original as any).id).filter(Boolean)
        if (ids.length > 0) {
            await onDeleteSelected(ids)
            table.toggleAllPageRowsSelected(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search and Filters - Mobile Stacked */}
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <div className="relative flex-1 sm:max-w-sm">
                    <Input
                        placeholder="Search products..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-full sm:w-[300px]"
                    />
                </div>

                {/* Status Filter */}
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={[
                            {
                                label: "Draft",
                                value: "DRAFT",
                            },
                            {
                                label: "Published",
                                value: "PUBLISHED",
                            },
                            {
                                label: "Archived",
                                value: "ARCHIVED",
                            },
                        ]}
                    />
                )}
            </div>

            {/* Actions - Mobile Stacked */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                {/* Delete Selected */}
                {onDeleteSelected && selectedRows.length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="h-8 w-full sm:w-auto"
                    >
                        Delete {selectedRows.length} selected
                    </Button>
                )}

                {/* Clear Filters */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {/* View Options */}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
} 