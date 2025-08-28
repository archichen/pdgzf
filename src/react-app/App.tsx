import { Providers } from "@/components/Providers"
import HouseList from "@/components/HouseList"

function App() {
  return (
    <Providers>
      <div className="h-svh bg-background flex flex-col overflow-hidden">
        <HouseList />
      </div>
    </Providers>
  )
}

export default App