import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

// 房源数据类型定义
export interface House {
  id: number
  apiId: string
  pstructId: string
  fullName: string
  address: string
  orientation?: string
  rent?: number
  area?: string
  queueCount: number
  queuePosition: number
  propertyName: string
  typeName?: string
  areaInfo: {
    areaName: string
  }
  township: string
  region: string
  project?: {
    id: number
    apiId?: string
    pstructId?: string
    name: string
    regionName?: string
    townshipName?: string
    province?: string
    city?: string
    region?: string
    township?: string
  }
}

export interface HouseListResponse {
  data: {
    totalCount: number
    pageCount: number
    data: House[]
  }
  success: boolean
  message: string
}

// 筛选条件类型
export interface FilterState {
  keywords: string
  region: string | null
  township: string | null
  projectId: number | null
  typeNames: string[]
  rents: string[]
}

// 请求参数类型
export interface HouseListParams {
  where?: FilterState
  pageIndex: number
  pageSize: number
}

// 房间类型选项
export const ROOM_TYPE_OPTIONS = [
  { value: null, label: '不限' },
  { value: '1', label: '一室' },
  { value: '2', label: '一室一厅' },
  { value: '3', label: '二室' },
  { value: '4', label: '二室一厅' },
  { value: '5', label: '二室二厅' },
  { value: '6', label: '三室' },
  { value: '7', label: '三室一厅' },
  { value: '8', label: '三室二厅' },
  { value: '9', label: '四室' },
  { value: '10', label: '五室' },
]

// 租金范围选项
export const RENT_RANGE_OPTIONS = [
  { value: null, label: '不限' },
  { value: 'Below1000', label: '1000以下' },
  { value: 'Between1000And1999', label: '1000-1999' },
  { value: 'Between2000And2999', label: '2000-2999' },
  { value: 'Between3000And3999', label: '3000-3999' },
  { value: 'Between4000And4999', label: '4000-4999' },
  { value: 'Between5000And5999', label: '5000-5999' },
  { value: 'Between6000And6999', label: '6000-6999' },
  { value: 'Between7000And8000', label: '7000-8000' },
]

// 获取房间类型显示名称
export const getRoomTypeLabel = (typeName: string | number | null): string => {
  const option = ROOM_TYPE_OPTIONS.find(opt => String(opt.value) === String(typeName))
  return option ? option.label : '不限'
}

// 获取租金范围显示名称
export const getRentRangeLabel = (rent: string | null): string => {
  const option = RENT_RANGE_OPTIONS.find(opt => opt.value === rent)
  return option ? option.label : '不限'
}

// 前端筛选函数
export const filterHouses = (houses: House[], filters: FilterState): House[] => {
  return houses.filter(house => {
    // 关键词筛选（区域名、小区名、房源名称）
    if (filters.keywords) {
      const keyword = filters.keywords.toLowerCase()
      const searchText = [
        house.fullName,
        house.address,
        house.project?.name,
        house.project?.regionName,
        house.project?.townshipName,
        house.areaInfo?.areaName
      ].filter(Boolean).join(' ').toLowerCase()
      
      if (!searchText.includes(keyword)) {
        return false
      }
    }

    // 区域筛选（从townshipName字段匹配）
    if (filters.region) {
      if (!house.project?.townshipName || house.project.townshipName !== filters.region) {
        return false
      }
    }

    // 小区筛选（从project.name字段匹配）
    if (filters.township) {
      if (!house.project?.name || house.project.name !== filters.township) {
        return false
      }
    }

    // 房间类型筛选（多选）
    if (filters.typeNames.length > 0) {
      if (!house.typeName || !filters.typeNames.includes(String(house.typeName))) {
        return false
      }
    }

    // 租金范围筛选（多选）
    if (filters.rents.length > 0) {
      const rent = house.rent || 0
      const matchesAnyRange = filters.rents.some(rentRange => {
        switch (rentRange) {
          case 'Below1000':
            return rent < 1000
          case 'Between1000And1999':
            return rent >= 1000 && rent <= 1999
          case 'Between2000And2999':
            return rent >= 2000 && rent <= 2999
          case 'Between3000And3999':
            return rent >= 3000 && rent <= 3999
          case 'Between4000And4999':
            return rent >= 4000 && rent <= 4999
          case 'Between5000And5999':
            return rent >= 5000 && rent <= 5999
          case 'Between6000And6999':
            return rent >= 6000 && rent <= 6999
          case 'Between7000And8000':
            return rent >= 7000 && rent <= 8000
          default:
            return false
        }
      })
      
      if (!matchesAnyRange) {
        return false
      }
    }

    return true
  })
}

// 获取房源列表
const fetchHouseList = async (params: HouseListParams): Promise<HouseListResponse> => {
  const response = await fetch('/api/v1.0/app/gzf/house/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch house list: ${response.status} ${response.statusText}`)
  }

  return response.json()
}


// 普通查询Hook - 用于获取所有数据
export const useHouseList = (params: Omit<HouseListParams, 'pageIndex'>) => {
  return useQuery({
    queryKey: ['houseList', params],
    queryFn: () => fetchHouseList({
      ...params,
      pageIndex: 0,
      pageSize: 99999, // 获取所有数据
    }),
    staleTime: 5 * 60 * 1000, // 5分钟
  })
}

// 保留无限滚动Hook以备后用，但主要使用普通查询
export const useInfiniteHouseList = (params: Omit<HouseListParams, 'pageIndex'>) => {
  return useInfiniteQuery({
    queryKey: ['infiniteHouseList', params],
    queryFn: ({ pageParam = 0 }) => 
      fetchHouseList({
        ...params,
        pageIndex: pageParam,
        pageSize: 20, // 每页20条
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length - 1
      const totalPages = lastPage.data.pageCount
      
      // 如果还有下一页，返回下一页的索引
      if (currentPage < totalPages - 1) {
        return currentPage + 1
      }
      
      // 没有更多数据了
      return undefined
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5分钟
  })
}