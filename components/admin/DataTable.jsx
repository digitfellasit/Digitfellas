'use client'

import { useState } from 'react'
import {
    ChevronDown,
    ChevronUp,
    Search,
    Trash2,
    Edit,
    Eye,
    MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function DataTable({
    data = [],
    columns = [],
    onEdit,
    onDelete,
    onView,
    searchable = true,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data found'
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    // Filter data based on search
    const filteredData = searchable
        ? data.filter((row) =>
            columns.some((col) => {
                const value = col.accessor ? col.accessor(row) : row[col.key]
                return String(value).toLowerCase().includes(searchTerm.toLowerCase())
            })
        )
        : data

    // Sort data
    const sortedData = sortColumn
        ? [...filteredData].sort((a, b) => {
            const aVal = sortColumn.accessor ? sortColumn.accessor(a) : a[sortColumn.key]
            const bVal = sortColumn.accessor ? sortColumn.accessor(b) : b[sortColumn.key]

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
        : filteredData

    const handleSort = (column) => {
        if (sortColumn?.key === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-4 py-3 text-left text-sm font-medium"
                                    >
                                        {column.sortable ? (
                                            <button
                                                onClick={() => handleSort(column)}
                                                className="flex items-center gap-2 hover:text-foreground transition-colors"
                                            >
                                                {column.header}
                                                {sortColumn?.key === column.key && (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )
                                                )}
                                            </button>
                                        ) : (
                                            column.header
                                        )}
                                    </th>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((row, rowIndex) => (
                                    <tr
                                        key={row.id || rowIndex}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-4 py-3 text-sm">
                                                {column.render
                                                    ? column.render(row)
                                                    : column.accessor
                                                        ? column.accessor(row)
                                                        : row[column.key]}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete || onView) && (
                                            <td className="px-4 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {onView && (
                                                            <DropdownMenuItem onClick={() => onView(row)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onEdit && (
                                                            <DropdownMenuItem onClick={() => onEdit(row)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onDelete && (
                                                            <DropdownMenuItem
                                                                onClick={() => onDelete(row)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            {sortedData.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Showing {sortedData.length} of {data.length} items
                    </div>
                </div>
            )}
        </div>
    )
}

// Status badge component
export function StatusBadge({ status }) {
    const variants = {
        published: 'default',
        draft: 'secondary',
        archived: 'outline',
    }

    return (
        <Badge variant={variants[status] || 'secondary'}>
            {status}
        </Badge>
    )
}
