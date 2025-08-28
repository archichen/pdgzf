import { useState } from "react"
import { useHouseList, type House } from "@/services/house"
import HouseList from "@/components/HouseList"
import {
  SortingState,
  Updater,
} from "@tanstack/react-table"

export default function HomePage() {
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

  // 获取排序后的数据
  const getSortedHouses = () => {
    const houses = data?.data.data || []
    return viewMode === "card" ? sortHouses(houses, cardSortBy, cardSortOrder) : houses
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

  // 视图模式切换处理函数
  const handleViewModeChange = (mode: "list" | "card") => {
    setViewMode(mode)
  }

  return (
    <HouseList
      data={data?.data.data || []}
      totalCount={data?.data.totalCount || 0}
      isLoading={isLoading}
      error={error}
      viewMode={viewMode}
      sorting={sorting}
      cardSortBy={cardSortBy}
      cardSortOrder={cardSortOrder}
      sortedCardData={getSortedHouses()}
      onViewModeChange={handleViewModeChange}
      onListSortChange={handleListSortChange}
      onCardSortChange={handleCardSortChange}
    />
  )
}