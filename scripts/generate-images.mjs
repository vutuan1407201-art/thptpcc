// One-off asset generation: builds the illustrations used on the landing page.
// Run with: node scripts/generate-images.mjs
import { writeFile } from 'node:fs/promises'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

const STYLE =
  'Flat vector illustration, soft rounded shapes, thick friendly outlines, playful modern childrens-education style. ' +
  'Bright palette of indigo, violet, warm amber and mint on a clean light background. ' +
  'Absolutely no text, no letters, no numbers-as-words, no watermarks, no UI chrome. Centered composition, generous padding.'

const jobs = [
  {
    file: 'hero.png',
    prompt: `A cheerful scene of three diverse schoolchildren sitting on a big cushion playing a learning game on a large tablet, colorful floating shapes, stars and a paper rocket drifting around them. Wide banner composition. ${STYLE}`,
  },
  {
    file: 'game-math.png',
    prompt: `A playful illustration of colorful arithmetic symbols (plus, minus, multiply, divide) as chunky 3D blocks bouncing around a glowing stopwatch. ${STYLE}`,
  },
  {
    file: 'game-memory.png',
    prompt: `A playful illustration of a grid of face-down playing cards with two cards flipped up showing simple matching fruit icons, sparkles around the matched pair. ${STYLE}`,
  },
  {
    file: 'game-vocab.png',
    prompt: `A playful illustration of an open book with a small globe and a speech bubble floating above it, surrounded by little icons of a cat, an apple and a house. ${STYLE}`,
  },
  {
    file: 'game-create.png',
    prompt: `A playful illustration of a friendly teacher character holding a clipboard with checkmark boxes, next to a large glowing chain link symbol representing a shareable link. ${STYLE}`,
  },
]

for (const job of jobs) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: job.prompt,
    })
    const parts = response.candidates?.[0]?.content?.parts ?? []
    const image = parts.find((p) => p.inlineData)
    if (!image) {
      console.error(`no image returned for ${job.file}`)
      continue
    }
    await writeFile(`public/img/${job.file}`, Buffer.from(image.inlineData.data, 'base64'))
    console.log(`wrote public/img/${job.file}`)
  } catch (error) {
    console.error(`failed ${job.file}:`, error.message)
  }
}
