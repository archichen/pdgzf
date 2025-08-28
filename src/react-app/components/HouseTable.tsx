import { type House, getRoomTypeLabel } from "@/services/house"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  Updater,
} from "@tanstack/react-table"
import { useRef } from "react"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  useVirtualizer,
} from "@tanstack/react-virtual"

// 使用tanstack table原生排序的列定义
const columns: ColumnDef<House>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        房源名称
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium flex items-center">{row.getValue("fullName")}</div>
    ),
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        地点
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const townshipName = row.original.project?.townshipName
      return (
        <div className="flex items-center">
          <div className="font-medium">{townshipName || "未知地点"}</div>
        </div>
      )
    },
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "typeName",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        房型
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const typeName = row.original.typeName
      return (
        <div className="flex items-center">
          {typeName ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {getRoomTypeLabel(typeName)}
            </span>
          ) : (
            <span className="text-muted-foreground">不限</span>
          )}
        </div>
      )
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        面积
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const area = row.getValue("area") as string | undefined
      return <div className="flex items-center">{area ? `${area}㎡` : "未知"}</div>
    },
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "rent",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        租金
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const rent = row.getValue("rent") as number | undefined
      return <div className="flex items-center">{rent ? `¥${rent}` : "面议"}</div>
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "queueCount",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2 justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        排队人数
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center flex items-center justify-center">
        {row.getValue("queueCount")}
      </div>
    ),
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "queuePosition",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2 justify-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        预估排名
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-blue-600 flex items-center justify-center">
        {row.getValue("queuePosition")}
      </div>
    ),
    enableSorting: true,
    size: 120,
  },
]

interface HouseTableProps {
  data: House[]
  sorting: SortingState
  onSortingChange: (sorting: Updater<SortingState>) => void
}

export default function HouseTable({ data, sorting, onSortingChange }: HouseTableProps) {
  // 虚拟化容器引用 - 必须在顶层调用
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // 创建表格实例 - 必须在顶层调用
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange,
    state: {
      sorting,
    },
    defaultColumn: {
      minSize: 100,
      size: 150,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  })

  // 创建虚拟化实例 - 必须在顶层调用
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const houseData = table.getRowModel().rows

  return (
    <div className="h-full rounded-md border flex flex-col overflow-hidden">
      <div 
        ref={tableContainerRef}
        className="relative flex-1 overflow-auto max-h-[calc(100vh-300px)]"
      >
        <div className="w-full">
          {/* 固定表头 */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
                      <th 
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap"
                        style={{ 
                          width: header.getSize(),
                          minWidth: header.column.columnDef.minSize || 100
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
          </div>
          
          {/* 虚拟化的表格体 */}
          {houseData.length > 0 ? (
            <div
              style={{
                height: `${totalSize}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualRows.map((virtualRow) => {
                const row = houseData[virtualRow.index]
                return (
                  <div
                    key={row.id}
                    className="absolute top-0 left-0 w-full flex items-center border-b bg-background hover:bg-muted/50"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <table className="w-full">
                      <tbody>
                        <tr>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-2 text-sm align-middle"
                              style={{ 
                                width: cell.column.getSize(),
                                minWidth: cell.column.columnDef.minSize || 100
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  )
}