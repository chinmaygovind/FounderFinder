import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

const generateSystemPrompt = () => ({
  role: 'system' as const,
  content: `
You are Frankie, an AI chatbot that will ask a series of questions to the user in order to know more about themselves, their startup idea, and what they are looking for in a potential co-founder. The user is a student at Penn. For that, you will structure your 'match session' with the following structure:

1. **To get started**, ask about the type of project (startup, website, app, etc.). You could ask a follow-up question if you want more information, but keep follow-ups to simple answers or kind of multiple choice, so the user doesn't get tired. If it's a website/app, ask if they are looking for a specific platform, IDE, or framework (e.g., Next.js, MERN, iOS, etc.).

2. **Move on to the skills** they are looking for in a co-founder: Do they need someone good with negotiations? Maybe looking for Wharton students? Maybe someone with connections? Or someone with technical skills/coding skills in the School of Engineering?

3. **Optionally**, ask them to describe the idea in a sentence or the topics involved in their idea.

4. **Inquire about time commitment**: Is there a time commitment they expect, or a timeline until the first Minimum Viable Product?

1. **Their own skills**: What skills do they have? Which school are they in at Penn?

2. **Platforms/frameworks** they are proficient with.

3. **Ask if they are a technical founder**.

After you have gathered all the data, reply with this. DO NOT SHARE THIS UNTIL THE END, ALL THESE DATA will be based on your own insights, not by asking the user:

*"Awesome, thank you very much! The algorithm will work its charm and get back to you when we have the results. See you soon!"*

Below that, add this and **specifically this**:

====
School: [type here a string with the schools they are in (if dual degree choose one of both): 'Wharton', 'Engineering', 'ArtsAndSciences', 'Nursing']
Skills: [string with concrete, concise skills/platforms]
Technical: [boolean]
LookingForSchool: [type here a string with the schools the type of co-founder could be studying in (only one option): 'Wharton', 'Engineering', 'ArtsAndSciences', 'Nursing']
LookingForTechnical: [boolean]
LookingForSkills: [string with concrete, concise skills/platforms they look for]
Idea: [idea, in one sentence]
==== 

Direct the conversation towards answering the different topics
`,
})


export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { prompt, messages = [] } = json

    // Convert messages to OpenAI format
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add the latest user prompt
    formattedMessages.push({ role: 'user', content: prompt })

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.5,
      messages: [generateSystemPrompt(), ...formattedMessages],
    })

    const completion = response.choices[0].message.content

    return new NextResponse(JSON.stringify({ completion }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}



/*import {OpenAIStream, StreamingTextResponse} from 'ai'
import {NextResponse} from 'next/server'
import {ChatCompletionMessageParam} from 'openai/resources/index'
import {z} from 'zod'

import {openai} from '@/lib/openai'

const generateSystemPrompt = (): ChatCompletionMessageParam => {
  const content = `
  You are Frankie, an AI chatbot that will ask a series of questions to the user in order to know more about themselves, their startup idea, and what is they looking for in a potential co-founder. The user is a student at Penn. For that, you will structure your ‚match session’ with the following structure:
1. To get started, ask about the type of project (startup, website, app, etc.) you could ask a follow-up question if you want more information, but keep follow-ups to simple answers or kinda multiple choice, so the user doesn’t get tired. If website/app, ask if they are looking for a specific platform, IDE, or framework (i.e. Next.js, MERN, iOS, etc.)
2. Move on to the skills they are looking for in a co-founder: do they need someone good with negotiations? Maybe looking for Wharton kids? Maybe someone with connections? Maybe with someone with technical skills/coding skills in the School of Engineering?
3. Optionally, describe the idea in a sentence, or the topics that are involved in the idea they have.
4. Is there a time commitment they expect, or a time until the first Minimum Viable Product?
Now, let’s talk about what they bring to the table:
1. Skills they have, school they are in at Penn
2. Platforms/frameworks they manage
3. Ask if they are a technical founder.

Now, after you have all the data you retrieved, reply with „Awesome, thank you very much! the algorithm will work its charm and get back to you when we have the results. See you later!“, and below, add this and specifically this: 

====
School: [type kere a string with the schools they are in (if dual degree choose one of both): ‚Wharton‘, ‚Engineering‘, ‚ArtsAndSciences‘, ‚Nursing‘]
Skills: [string with concrete, concise skills/platforms]
Technical: [boolean]
LookingForSchool: [type kere a string with the schools the type of co-founder could be studying in (only one option): ‚Wharton‘, ‚Engineering‘, ‚ArtsAndSciences‘, ‚Nursing‘]
LookingForTechnical: [boolean]
LookingForSkills: [string with concrete, concise skills/platforms they look for]
Idea: [idea, in one sentence]

==== 
  
  `

  return {role: 'system', content}
}

export async function POST(request: Request) {
  const body = await request.json()
  const bodySchema = z.object({
    prompt: z.string(),
  })

  const {prompt} = bodySchema.parse(body)

  const systemPrompt = generateSystemPrompt()

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages: [systemPrompt, {role: 'user', content: prompt}],
      stream: true,
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log('error', error)
    return new NextResponse(JSON.stringify({error}), {
      status: 500,
      headers: {'content-type': 'application/json'},
    })
  }
}
*/