import { Providers } from "@/components/Providers"
import HomePage from "@/components/HomePage"

function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <HomePage />
      </div>
    </Providers>
  )
}

export default App