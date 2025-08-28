import { Providers } from "@/components/Providers"
import HomePage from "@/components/HomePage"

function App() {
  return (
    <Providers>
      <div className="h-svh bg-background flex flex-col overflow-hidden">
        <HomePage />
      </div>
    </Providers>
  )
}

export default App