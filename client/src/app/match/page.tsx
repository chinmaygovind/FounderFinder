'use client'

import { Github, HomeIcon, Trash } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState, useEffect } from 'react'

import Chat from '@/components/Chat'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useMessages } from '@/lib/store'
import axios from 'axios'

const Home = () => {
  const { messages, setMessages, clearMessages } = useMessages()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationEnded, setConversationEnded] = useState(false)

  useEffect(() => {
    if (messages.length === 0) {
      setMessages('AI', "Hello! I'm Frankie, an AI chatbot here to assist you. Let's get started. Could you please tell me about your project? Is it a startup, a website, an app, or something else?")
    }
  }, [messages.length, setMessages])

  // Initialize an array to store parsed data
  const [databaseArray, setDatabaseArray] = useState<Array<Record<string, any>>>([])

  const parseDatabaseContent = (content: string) => {
    const dataFields: Record<string, any> = {}
  
    // Use a regular expression to split the content into key-value pairs
    const regex = /(\w+):\s*([^:]+)(?=\s+\w+:|$)/g
    let match
  
    while ((match = regex.exec(content)) !== null) {
      const key = match[1]
      const value = match[2].trim()
      dataFields[key] = value
    }
  
    // Convert specific fields to appropriate data types
    dataFields['Technical'] = dataFields['Technical'] === 'True'
    dataFields['LookingForTechnical'] = dataFields['LookingForTechnical'] === 'True'
    dataFields['Skills'] = dataFields['Skills']?.split(',').map((s: string) => s.trim())
    dataFields['LookingForSkills'] = dataFields['LookingForSkills']?.split(',').map((s: string) => s.trim())
  
    return dataFields
  }

  
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
  
      // Extract the content between {startDatabase} and {endDatabase}
      const match = data.completion.match(/\{startDatabase\}([\s\S]*?)\{endDatabase\}/)
  
      // Remove the content between {startDatabase} and {endDatabase} from the completion
      let assistantReply = data.completion
      if (match) {
        assistantReply = data.completion.replace(match[0], '').trim()
  
        const databaseContent = match[1].trim()
  
        // Parse the content into key-value pairs
        const dataFields = parseDatabaseContent(databaseContent)
  
        // Store the parsed data in the state array
        setDatabaseArray((prevArray) => [...prevArray, dataFields])
  
        console.log('Parsed data:', dataFields)
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/update_profile', 
            { profileData: [dataFields] },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          alert(response.data.message);
        } catch (error) {
          console.log(error)
          alert('An error occurred while updating the profile');
        }
      }
  
      // Update the messages with the AI's response (without the parsed content)
      setMessages('AI', assistantReply)
      if (assistantReply.includes('See you soon!')) {
        setConversationEnded(true)
      }
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
        <Link href="/" className="text-xl font-bold text-white-600 hover:text-white-700">FounderFinder</Link>
        <div className="flex items-center gap-3">
          <Link href="/" passHref={true}>
            <Button variant="outline">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Home
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
        conversationEnded={conversationEnded}
      />
      <div
        className="flex cursor-pointer items-center gap-2 text-xs text-red-500"
        onClick={clearMessages}
      >
        <Trash className="h-4 w-4" /> Start Over
      </div>
      <div className="mt-5">
      <h2 className="text-lg font-bold">Parsed Data:</h2>
      <pre>{JSON.stringify(databaseArray, null, 2)}</pre>
    </div>
    </div>
  )
}

export default Home
