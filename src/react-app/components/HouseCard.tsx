import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type House } from "@/services/house"
import { Home, MapPin, DollarSign, TrendingUp } from "lucide-react"

interface HouseCardProps {
  house: House
}

export default function HouseCard({ house }: HouseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-semibold">{house.fullName || "未知房源"}</span>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {house.rent && (
              <Badge variant="secondary" className="text-sm">
                <DollarSign className="h-3 w-3 mr-1" />
                ¥{house.rent}
              </Badge>
            )}
            {house.area && (
              <Badge variant="outline" className="text-xs">
                {house.area}㎡
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">{house.address || "未知地址"}</div>
            {house.areaInfo?.areaName && (
              <div className="text-xs text-muted-foreground">{house.areaInfo.areaName}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {house.orientation && (
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">朝向:</span>
              <span className="font-medium">{house.orientation}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground">排队:</span>
            <span className="font-medium">{house.queueCount || 0}人</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">预估排名</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {house.queuePosition || "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}