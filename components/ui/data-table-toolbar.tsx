"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { statuses } from "@/lib/constants"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onDeleteSelected?: (ids: number[]) => Promise<void>
}

export function DataTableToolbar<TData>({
    table,
    onDeleteSelected
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as any).id)

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
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
                {selectedRowIds.length > 0 && onDeleteSelected && (
                    <Button
                        variant="destructive"
                        onClick={() => onDeleteSelected(selectedRowIds)}
                        className="h-8 px-2 lg:px-3"
                    >
                        Delete {selectedRowIds.length} selected
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
} 