import { type House } from "@/services/house"
import HouseCard from "@/components/HouseCard"

interface HouseGridProps {
  data: House[]
}

export default function HouseGrid({ data }: HouseGridProps) {
  return (
    <div className="h-full overflow-auto p-4">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((house, index) => (
            <HouseCard key={`${house.id}-${index}`} house={house} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          暂无数据
        </div>
      )}
    </div>
  )
}