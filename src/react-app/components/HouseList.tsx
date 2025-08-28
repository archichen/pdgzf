import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHouseList, type House } from "@/services/house"
import ViewToggle from "@/components/ViewToggle"
import HouseCard from "@/components/HouseCard"
import CardSortControls from "@/components/CardSortControls"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table"
import { useState, useRef } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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
      <div className="font-medium">{row.getValue("fullName")}</div>
    ),
    enableSorting: true,
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
      const address = row.getValue("address") as string
      const areaName = row.original.areaInfo?.areaName
      return (
        <div>
          <div className="font-medium">{address || "未知地址"}</div>
          {areaName && (
            <div className="text-sm text-muted-foreground">{areaName}</div>
          )}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "orientation",
    header: ({ column }) => (
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded -m-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        朝向
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
      const orientation = row.getValue("orientation") as string | undefined
      return <div>{orientation || "未知"}</div>
    },
    enableSorting: true,
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
      return <div>{area ? `${area}㎡` : "未知"}</div>
    },
    enableSorting: true,
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
      return <div>{rent ? `¥${rent}` : "面议"}</div>
    },
    enableSorting: true,
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
      <div className="text-center">
        {row.getValue("queueCount")}
      </div>
    ),
    enableSorting: true,
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
      <div className="text-center font-medium text-blue-600">
        {row.getValue("queuePosition")}
      </div>
    ),
    enableSorting: true,
  },
]

export default function HouseList() {
  const { data, isLoading, error } = useHouseList({
    where: {
      keywords: "",
      township: null,
      projectId: null,
      typeName: null,
      rent: null,
    },
    pageSize: 99999, // 获取所有数据
  })

  // 视图模式状态管理 - 移动端默认使用卡片视图
  const [viewMode, setViewMode] = useState<"list" | "card">(() => {
    // 检查是否为移动设备
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? "card" : "list"
    }
    return "list"
  })

  // 卡片视图排序状态管理
  const [cardSortBy, setCardSortBy] = useState<string>("area")
  const [cardSortOrder, setCardSortOrder] = useState<"asc" | "desc">("asc")

  // 排序数据函数
  const sortHouses = (houses: House[], sortBy: string, sortOrder: "asc" | "desc"): House[] => {
    return [...houses].sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "area":
          aValue = a.area ? parseFloat(a.area) : 0
          bValue = b.area ? parseFloat(b.area) : 0
          break
        case "rent":
          aValue = a.rent || 0
          bValue = b.rent || 0
          break
        case "queueCount":
          aValue = a.queueCount || 0
          bValue = b.queueCount || 0
          break
        case "queuePosition":
          aValue = a.queuePosition || Infinity
          bValue = b.queuePosition || Infinity
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  // 获取排序后的数据
  const getSortedHouses = () => {
    const houses = data?.data.data || []
    return viewMode === "card" ? sortHouses(houses, cardSortBy, cardSortOrder) : houses
  }

  // 排序状态管理 - 必须在顶层调用
  const [sorting, setSorting] = useState<SortingState>([])
  
  // 虚拟化容器引用 - 必须在顶层调用
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // 创建表格实例 - 必须在顶层调用
  const table = useReactTable({
    data: data?.data.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  // 卡片视图排序处理函数
  const handleCardSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setCardSortBy(sortBy)
    setCardSortOrder(sortOrder)
  }

  // 创建虚拟化实例 - 必须在顶层调用
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 72, // 增加每行高度到72px
    overscan: 10, // 增加预渲染行数
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  // 处理加载和错误状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">加载失败: {error.message}</div>
      </div>
    )
  }

  const houseData = table.getRowModel().rows
  const sortedCardData = getSortedHouses()

  return (
    <div className="container mx-auto p-6 flex flex-col h-full overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">房源列表</h1>
            <p className="text-muted-foreground mt-2">
              共 {data?.data.totalCount || 0} 套可租房源
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {viewMode === "card" && (
              <CardSortControls
                sortBy={cardSortBy}
                sortOrder={cardSortOrder}
                onSortChange={handleCardSortChange}
              />
            )}
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-md border flex flex-col overflow-hidden">
        {viewMode === "list" ? (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
            
            {/* 虚拟化的表格体 */}
            <div 
              ref={tableContainerRef}
              className="relative flex-1 overflow-auto"
            >
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
                        <div className="flex w-full">
                          {row.getVisibleCells().map((cell) => (
                            <div
                              key={cell.id}
                              className="flex-1 px-4 py-3 text-sm"
                              style={{ minWidth: cell.column.getSize() }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          ))}
                        </div>
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
          </>
        ) : (
          /* 卡片视图 */
          <div className="flex-1 overflow-auto p-4">
            {houseData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedCardData.map((house, index) => (
                  <HouseCard key={`${house.id}-${index}`} house={house} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                暂无数据
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}