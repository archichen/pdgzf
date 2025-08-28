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

// 请求参数类型
export interface HouseListParams {
  where?: {
    keywords?: string | null
    township?: string | null
    projectId?: number | null
    typeName?: string | null
    rent?: string | null
  }
  pageIndex: number
  pageSize: number
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