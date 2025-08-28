import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown } from "lucide-react"

interface CardSortControlsProps {
  sortBy: string
  sortOrder: "asc" | "desc"
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
}

const sortOptions = [
  { value: "area", label: "面积" },
  { value: "rent", label: "租金" },
  { value: "queueCount", label: "排队人数" },
  { value: "queuePosition", label: "预估排名" },
]


export default function CardSortControls({ sortBy, sortOrder, onSortChange }: CardSortControlsProps) {
  const handleSortOptionChange = (value: string) => {
    onSortChange(value, sortOrder)
  }

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">排序:</span>
      <Select value={sortBy} onValueChange={handleSortOptionChange}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue placeholder="选择排序字段" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSortOrder}
        className="h-8 w-8 p-0"
        title={sortOrder === "asc" ? "升序" : "降序"}
      >
        {sortOrder === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}