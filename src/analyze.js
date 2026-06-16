import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function analyzePages(topic, pages) {
  const context = pages
    .filter(p => p.content)
    .map(p => `## Source: ${p.url}\n\n${p.content.slice(0, 4000)}`)
    .join('\n\n---\n\n')

  const chat = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `You are a research analyst. Given scraped web content, produce a
structured markdown research report. Always cite sources with URLs.
Flag any conflicting information between sources with a ⚠️ marker.`
      },
      {
        role: 'user',
        content: `Research topic: "${topic}"

Here is the scraped content from ${pages.length} sources:

${context}

Write a structured report with these sections:
# ${topic} — Research Report

## Key facts & data points
## Different perspectives & approaches
## Conflicts & gaps ⚠️
## Sources
## 3 questions worth investigating further`
      }
    ]
  })

  return chat.choices[0].message.content
}
