'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

import axios from 'axios';
export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    console.log('Email:', email)
    console.log('Password:', password)


    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      router.push("/match")

      localStorage.setItem('token', response.data.token);
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="z-10 flex h-screen flex-col gap-5 p-5">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <Link href="/" className="text-xl font-bold text-black-600 hover:text-black-700">FounderFinder</Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-scroll bg-zinc-50 p-5 dark:bg-zinc-950">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="text-gray-600 mt-4 text-center">
            New user?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
      <Separator />
    </div>
  )
}