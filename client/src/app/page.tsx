'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LogIn } from 'lucide-react' // Ensure lucide-react is installed

export default function Home() {
  const router = useRouter()

  const handleLoginSignup = () => {
    router.push('/login')
  }

  const handleFindCoFounder = () => {
    router.push('/match')
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        {/* Logo/Title */}
        <Link href="/" className="text-2xl font-bold text-orange-400 hover:text-orange-500">
          FounderFinder 🚀
        </Link>

        {/* Login Button */}
        <Button
          variant="ghost"
          onClick={handleLoginSignup}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-500"
        >
          <LogIn className="w-4 h-4" />
          Login
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-6">
          Connecting Founders with Co-Founders
        </h1>
        <Button
          onClick={handleFindCoFounder}
          className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 hover:from-orange-600 hover:via-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full text-lg flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🤝 Find a Co-Founder
        </Button>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-700">
        <Separator />
        {/* Optional Footer Content */}
      </footer>
    </div>
  )
}
