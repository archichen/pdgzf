import { useState } from "react"
import { useHouseList, type House, FilterState, filterHouses } from "@/services/house"
import HouseTable from "@/components/HouseTable"
import HouseGrid from "@/components/HouseGrid"
import ViewToggle from "@/components/ViewToggle"
import CardSortControls from "@/components/CardSortControls"
import FilterControls from "@/components/FilterControls"
import {
  SortingState,
  Updater,
} from "@tanstack/react-table"

export default function HomePage() {
  // 筛选条件状态管理
  const [filters, setFilters] = useState<FilterState>({
    keywords: "",
    township: null,
    projectId: null,
    typeName: null,
    rent: null,
  })

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

  // 列表视图排序状态管理
  const [sorting, setSorting] = useState<SortingState>([])

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

  // 获取筛选和排序后的数据
  const getFilteredAndSortedHouses = () => {
    const allHouses = data?.data.data || []
    
    // 先筛选
    const filteredHouses = filterHouses(allHouses, filters)
    
    // 再排序
    if (viewMode === "card") {
      return sortHouses(filteredHouses, cardSortBy, cardSortOrder)
    }
    
    return filteredHouses
  }

  // 列表视图排序处理函数
  const handleListSortChange = (updaterOrValue: Updater<SortingState>) => {
    setSorting(updaterOrValue)
  }

  // 卡片视图排序处理函数
  const handleCardSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setCardSortBy(sortBy)
    setCardSortOrder(sortOrder)
  }

  // 筛选条件处理函数
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // 清空筛选条件
  const handleClearFilters = () => {
    setFilters({
      keywords: "",
      township: null,
      projectId: null,
      typeName: null,
      rent: null,
    })
  }

  // 视图模式切换处理函数
  const handleViewModeChange = (mode: "list" | "card") => {
    setViewMode(mode)
  }

  // 处理加载和错误状态
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">加载失败: {error.message}</div>
        </div>
      </div>
    )
  }

  const totalCount = data?.data.totalCount || 0
  const filteredAndSortedHouses = getFilteredAndSortedHouses()
  const filteredCount = filteredAndSortedHouses.length

  return (
    <div className="container mx-auto p-6">
      {/* 标题和统计信息 */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">房源列表</h1>
            <p className="text-muted-foreground mt-2">
              共 {totalCount} 套可租房源{filteredCount !== totalCount && `，筛选后 ${filteredCount} 套`}
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
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
          </div>
        </div>
      </div>

      {/* 筛选控件 */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
        <FilterControls
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* 房源列表 */}
      <div className="min-h-[calc(100vh-200px)]">
        {viewMode === "list" ? (
          <HouseTable
            data={filteredAndSortedHouses}
            sorting={sorting}
            onSortingChange={handleListSortChange}
          />
        ) : (
          <HouseGrid
            data={filteredAndSortedHouses}
          />
        )}
      </div>
    </div>
  )
}