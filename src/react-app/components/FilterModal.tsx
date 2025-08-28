import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FilterControls from "./FilterControls"
import { type FilterState, type House } from "@/services/house"
import { Filter } from "lucide-react"

interface FilterModalProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  houses: House[]
  children: React.ReactNode
}

export default function FilterModal({
  filters,
  onFiltersChange,
  onClearFilters,
  houses,
  children,
}: FilterModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>房源筛选</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FilterControls
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
            houses={houses}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}