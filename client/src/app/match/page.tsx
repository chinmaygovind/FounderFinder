'use client'

import { Github, Trash } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

import Chat from '@/components/Chat'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useMessages } from '@/lib/store'

const Home = () => {
  const { messages, setMessages, clearMessages } = useMessages()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input) return

    // Add the user's message to the messages array
    setMessages('USER', input)

    // Prepare the payload with all messages
    const payload = {
      prompt: input,
      messages: messages.map((msg) => ({
        role: msg.creator === 'AI' ? 'assistant' : 'user',
        content: msg.text,
      })),
    }

    setIsLoading(true)

    try {
      // Send the request to the server
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error('Error:', response.statusText)
        return
      }

      const data = await response.json()

      // Update the messages with the AI's response
      setMessages('AI', data.completion)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setInput('')
    }
  }

  return (
    <div className="z-10 flex h-screen flex-col gap-5 p-5">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="flex items-center gap-3">
          <Link href="https://github.com/soutot/nextjs-rag-trulens" passHref={true}>
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </Link>
        </div>
      </header>
      <Chat messages={messages} />
      <Separator />
      <Chat.Input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onSubmit={onSubmit}
        disabled={isLoading}
      />
      <div
        className="flex cursor-pointer items-center gap-2 text-xs text-red-500"
        onClick={clearMessages}
      >
        <Trash className="h-4 w-4" /> Clear Chat
      </div>
    </div>
  )
}

export default Home
