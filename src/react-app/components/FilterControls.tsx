import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Search } from "lucide-react"
import { FilterState, type House, ROOM_TYPE_OPTIONS, RENT_RANGE_OPTIONS } from "@/services/house"

interface FilterControlsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  houses: House[] // 添加房源数据用于提取区域和小区名
}

export default function FilterControls({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  houses
}: FilterControlsProps) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'keywords') return value !== ''
    return Array.isArray(value) ? value.length > 0 : value !== null
  })

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilter = (key: keyof FilterState) => {
    if (key === 'keywords') {
      updateFilter(key, '')
    } else if (key === 'typeNames' || key === 'rents') {
      updateFilter(key, [])
    } else {
      updateFilter(key, null)
    }
  }

  // 多选框处理函数
  const handleCheckboxChange = (key: keyof FilterState, checkedValue: string, checked: boolean) => {
    const currentValues = filters[key] as string[] || []
    let newValues: string[]
    
    if (checked) {
      newValues = [...currentValues, checkedValue]
    } else {
      newValues = currentValues.filter(v => v !== checkedValue)
    }
    
    updateFilter(key, newValues)
  }

  // 从房源数据中提取唯一的区域名（townshipName）
  const uniqueRegions = [...new Set(
    houses
      .map(house => house.project?.townshipName)
      .filter(Boolean)
  )].sort()

  // 从房源数据中提取唯一的小区名（project.name）
  const uniqueCommunities = [...new Set(
    houses
      .map(house => house.project?.name)
      .filter(Boolean)
  )].sort()

  
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 区域筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">区域：</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {uniqueRegions.length > 0 ? (
              uniqueRegions.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={filters.region === region}
                    onCheckedChange={(checked) => 
                      updateFilter('region', checked ? region : null)
                    }
                  />
                  <label htmlFor={`region-${region}`} className="text-sm">
                    {region}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">暂无区域数据</div>
            )}
          </div>
        </div>

        {/* 小区筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">小区：</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {uniqueCommunities.length > 0 ? (
              uniqueCommunities.map((community) => (
                <div key={community} className="flex items-center space-x-2">
                  <Checkbox
                    id={`community-${community}`}
                    checked={filters.township === community}
                    onCheckedChange={(checked) => 
                      updateFilter('township', checked ? community : null)
                    }
                  />
                  <label htmlFor={`community-${community}`} className="text-sm">
                    {community}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">暂无小区数据</div>
            )}
          </div>
        </div>

        {/* 房间类型筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">户型：</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {ROOM_TYPE_OPTIONS.map((option) => (
              <div key={option.value || 'all'} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${option.value || 'all'}`}
                  checked={filters.typeNames?.includes(String(option.value)) || false}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('typeNames', String(option.value), checked as boolean)
                  }
                />
                <label htmlFor={`type-${option.value || 'all'}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 租金范围筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">租金范围：</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {RENT_RANGE_OPTIONS.map((option) => (
              <div key={option.value || 'all'} className="flex items-center space-x-2">
                <Checkbox
                  id={`rent-${option.value || 'all'}`}
                  checked={filters.rents?.includes(String(option.value)) || false}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('rents', String(option.value), checked as boolean)
                  }
                />
                <label htmlFor={`rent-${option.value || 'all'}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
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
          {filters.region && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>区域: {filters.region}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('region')
                }}
              />
            </Badge>
          )}
          {filters.township && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>小区: {filters.township}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('township')
                }}
              />
            </Badge>
          )}
          {filters.typeNames && filters.typeNames.length > 0 && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>户型: {filters.typeNames.map(t => ROOM_TYPE_OPTIONS.find(opt => opt.value === t)?.label).join(', ')}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('typeNames')
                }}
              />
            </Badge>
          )}
          {filters.rents && filters.rents.length > 0 && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>租金: {filters.rents.map(r => RENT_RANGE_OPTIONS.find(opt => opt.value === r)?.label).join(', ')}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={(e) => {
                  e.preventDefault()
                  clearFilter('rents')
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}