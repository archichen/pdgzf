import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type FilterState, getRoomTypeLabel, getRentRangeLabel } from "@/services/house"
import { X } from "lucide-react"

interface FilterBadgesProps {
  filters: FilterState
  onRemoveFilter: (filterType: keyof FilterState, value?: any) => void
  onClearAllFilters: () => void
}

export default function FilterBadges({ filters, onRemoveFilter, onClearAllFilters }: FilterBadgesProps) {
  const hasActiveFilters = 
    filters.keywords ||
    filters.region ||
    filters.township ||
    filters.projectId ||
    filters.typeNames.length > 0 ||
    filters.rents.length > 0

  if (!hasActiveFilters) {
    return null
  }

  
  const renderFilterBadges = () => {
    const badges = []

    if (filters.keywords) {
      badges.push(
        <Badge key="keywords" variant="secondary" className="flex items-center space-x-1">
          <span>关键词: {filters.keywords}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1 hover:bg-transparent"
            onClick={() => onRemoveFilter('keywords')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )
    }

    if (filters.region) {
      badges.push(
        <Badge key="region" variant="secondary" className="flex items-center space-x-1">
          <span>区域: {filters.region}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1 hover:bg-transparent"
            onClick={() => onRemoveFilter('region')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )
    }

    if (filters.township) {
      badges.push(
        <Badge key="township" variant="secondary" className="flex items-center space-x-1">
          <span>小区: {filters.township}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1 hover:bg-transparent"
            onClick={() => onRemoveFilter('township')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )
    }

    if (filters.typeNames.length > 0) {
      filters.typeNames.forEach(typeName => {
        badges.push(
          <Badge key={`typeName-${typeName}`} variant="secondary" className="flex items-center space-x-1">
            <span>房型: {getRoomTypeLabel(typeName)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter('typeNames', typeName)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )
      })
    }

    if (filters.rents.length > 0) {
      filters.rents.forEach(rent => {
        badges.push(
          <Badge key={`rent-${rent}`} variant="secondary" className="flex items-center space-x-1">
            <span>租金: {getRentRangeLabel(rent)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter('rents', rent)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )
      })
    }

    return badges
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {renderFilterBadges()}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAllFilters}
        className="text-muted-foreground hover:text-foreground"
      >
        清除全部
      </Button>
    </div>
  )
}