import { Send } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

type Props = {
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void
  value: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  conversationEnded?: boolean
}

const ChatInput = ({ onChange, value, onSubmit, disabled, conversationEnded }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleButtonClick = () => {
    if (conversationEnded) {
      // Navigate to the dashboard page
      router.push('/dashboard')
    } else {
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <div className="flex flex-row items-center gap-10">
        <div className="flex flex-1 items-center gap-3">
          {!conversationEnded && (
            <Textarea
              className="flex max-h-[14rem] min-h-[2.5rem] flex-1"
              placeholder="Type your message"
              value={value}
              autoFocus
              rows={value.split(`\n`)?.length || 1}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()

                  if (e.shiftKey) onChange({ target: { value: `${value}\n` } } as any)
                  else formRef.current?.requestSubmit()

                  return
                }
              }}
            />
          )}
        </div>
        <Button
          className={cn(
            'gap-2',
            conversationEnded ? 'bg-green-500 hover:bg-green-600' : disabled && 'bg-neutral-300'
          )}
          type="button"
          onClick={handleButtonClick}
          disabled={disabled && !conversationEnded}
        >
          {conversationEnded ? 'Go to dashboard' : 'Send'}{' '}
          {!conversationEnded && <Send className="h-3 w-3" />}
        </Button>
      </div>
    </form>
  )
}

export default ChatInput
