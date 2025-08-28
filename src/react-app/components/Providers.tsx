import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import React from 'react'

// 创建QueryClient实例，配置更长的缓存时间
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000, // 60分钟内数据视为新鲜
      gcTime: 24 * 60 * 60 * 1000, // 24小时后垃圾回收
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避重试
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
      refetchOnMount: false, // 组件挂载时不重新获取（如果已有缓存）
      refetchOnReconnect: false, // 重新连接时不重新获取
    },
  },
})

// 创建localStorage持久化器
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'pdgzf-query-cache',
  throttleTime: 1000, // 1秒节流
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // 在客户端执行持久化
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24小时
        buster: '', // 缓存破坏键，可以在需要时更新来清空缓存
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // 只缓存成功的查询
            return query.state.status === 'success'
          },
          shouldDehydrateMutation: () => false, // 不缓存mutation
        },
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}