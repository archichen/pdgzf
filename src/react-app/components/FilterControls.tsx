import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Search } from "lucide-react"
import { FilterState, ROOM_TYPE_OPTIONS, RENT_RANGE_OPTIONS } from "@/services/house"

interface FilterControlsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

export default function FilterControls({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: FilterControlsProps) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'keywords') return value !== ''
    return value !== null
  })

  const updateFilter = (key: keyof FilterState, value: string | number | null) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilter = (key: keyof FilterState) => {
    if (key === 'keywords') {
      updateFilter(key, '')
    } else {
      updateFilter(key, null)
    }
  }

  
  return (
    <div className="space-y-4">
      {/* 搜索输入框 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索区域名、小区名..."
            value={filters.keywords}
            onChange={(e) => updateFilter('keywords', e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>清空筛选</span>
          </Button>
        )}
      </div>

      {/* 筛选条件行 */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* 房间类型筛选 */}
        <Select
          value={filters.typeName || 'all'}
          onValueChange={(value) => updateFilter('typeName', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="房间类型" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 租金范围筛选 */}
        <Select
          value={filters.rent || 'all'}
          onValueChange={(value) => updateFilter('rent', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="租金范围" />
          </SelectTrigger>
          <SelectContent>
            {RENT_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 活跃筛选条件显示 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">当前筛选:</span>
          {filters.keywords && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>搜索: {filters.keywords}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('keywords')
                }}
              />
            </Badge>
          )}
          {filters.typeName && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>房型: {ROOM_TYPE_OPTIONS.find(opt => opt.value === filters.typeName)?.label}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('typeName')
                }}
              />
            </Badge>
          )}
          {filters.rent && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>租金: {RENT_RANGE_OPTIONS.find(opt => opt.value === filters.rent)?.label}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('rent')
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}