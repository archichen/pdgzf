import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { fetchHouseList, type HouseListParams } from './houseApi'

// 普通查询Hook - 用于获取所有数据
export const useHouseList = (params: Omit<HouseListParams, 'pageIndex'>) => {
  return useQuery({
    queryKey: ['houseList', params],
    queryFn: () => fetchHouseList({
      ...params,
      pageIndex: 0,
      pageSize: 99999, // 获取所有数据
    }),
    staleTime: 60 * 60 * 1000, // 60分钟内数据视为新鲜
    gcTime: 24 * 60 * 60 * 1000, // 24小时后垃圾回收
    retry: 2, // 失败重试2次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避重试
    refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
    refetchOnMount: false, // 组件挂载时不重新获取（如果已有缓存）
    refetchOnReconnect: false, // 重新连接时不重新获取
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
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 60分钟
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

// 缓存管理工具
export const useCacheManager = () => {
  const queryClient = useQueryClient()
  
  // 清空房源缓存
  const clearHouseCache = () => {
    queryClient.removeQueries({ queryKey: ['houseList'] })
    // 清空localStorage中的缓存
    localStorage.removeItem('pdgzf-query-cache')
  }
  
  // 预加载房源数据
  const prefetchHouseData = async (params: Omit<HouseListParams, 'pageIndex'>) => {
    await queryClient.prefetchQuery({
      queryKey: ['houseList', params],
      queryFn: () => fetchHouseList({
        ...params,
        pageIndex: 0,
        pageSize: 99999,
      }),
      staleTime: 60 * 60 * 1000,
    })
  }
  
  // 强制重新获取数据
  const refetchHouseData = async (params: Omit<HouseListParams, 'pageIndex'>) => {
    await queryClient.refetchQueries({ 
      queryKey: ['houseList', params],
      type: 'active'
    })
  }
  
  // 获取缓存信息
  const getCacheInfo = () => {
    const queries = queryClient.getQueryCache().getAll()
    const houseQueries = queries.filter(query => 
      query.queryKey[0] === 'houseList'
    )
    
    return {
      totalQueries: queries.length,
      houseQueries: houseQueries.length,
      cacheSize: new Blob([JSON.stringify(queries)]).size,
      queries: houseQueries.map(q => ({
        key: q.queryKey,
        status: q.state.status,
        isStale: q.isStale(),
        dataCount: (q.state.data as any)?.data?.data?.length || 0,
        lastUpdated: q.state.dataUpdatedAt,
      }))
    }
  }
  
  return {
    clearHouseCache,
    prefetchHouseData,
    refetchHouseData,
    getCacheInfo,
  }
}