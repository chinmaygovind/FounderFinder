'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Dashboard = () => {
  const [parsedData, setParsedData] = useState<any>(null)
  const [isDataReady, setIsDataReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Retrieve the parsed data from localStorage
    const data = localStorage.getItem('parsedData')
    if (data) {
      const parsed = JSON.parse(data)
      setParsedData(parsed)

      // Check if the 'ResultsReady' field indicates that the data is ready
      // Currently simulating that data is not ready
      if (parsed.ResultsReady) {
        setIsDataReady(true)
      } else {
        setIsDataReady(false)
      }
    }
  }, [])

  const handleReload = () => {
    // Reload the page to check if data has arrived
    router.refresh()
  }

  const handleLogout = () => {
    // Currently does nothing
    console.log('Logout button clicked')
  }

  return (
    <div className="z-10 flex h-screen flex-col gap-5 p-5">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-scroll bg-zinc-50 p-5 dark:bg-zinc-950">
        {!parsedData || !isDataReady ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg">
              The results are not out yet, but please check back soon.
            </p>
            <Button onClick={handleReload} className="mt-4">
              Reload
            </Button>
          </div>
        ) : (
          // Future implementation when data is ready
          <div>
            <h2 className="text-lg font-bold">Your Data:</h2>
            <pre>{JSON.stringify(parsedData, null, 2)}</pre>
          </div>
        )}
      </main>
      <Separator />
    </div>
  )
}

export default Dashboard

