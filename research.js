#!/usr/bin/env node
import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'fs'
import { scrapeUrl } from './src/scrape.js'
import { analyzePages } from './src/analyze.js'

const [,, topic, ...rawUrls] = process.argv

if (!topic) {
  console.error('Usage: node research.js "topic" url1 url2 url3')
  process.exit(1)
}

const urls = rawUrls.length > 0 ? rawUrls : await suggestUrls(topic)

console.log(`\n🔍 Researching: ${topic}`)
console.log(`   Scraping ${urls.length} URLs...\n`)

const pages = []
for (const url of urls) {
  process.stdout.write(`   → ${url} `)
  const result = await scrapeUrl(url)
  pages.push(result)
  if (result.error) {
    console.log(`✗ (${result.error})`)
  } else {
    console.log(`✓ (${result.content.length} chars)`)
  }
}

const scraped = pages.filter(p => p.content && p.content.length > 0)
console.log(`\n   ${scraped.length}/${urls.length} pages scraped. Analyzing with Groq...\n`)

const report = await analyzePages(topic, pages)

mkdirSync('research', { recursive: true })
const filename = `research/${topic.toLowerCase().replace(/\s+/g, '-')}.md`
writeFileSync(filename, report)

console.log(`✓ Report saved to ${filename}\n`)
console.log('--- Preview (first 500 chars) ---')
console.log(report.slice(0, 500) + '...')

async function suggestUrls(topic) {
  console.log('   No URLs provided — asking Groq to suggest 5 sources...\n')
  const { default: Groq } = await import('groq-sdk')
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const res = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: `Give me 5 real, working URLs to research the topic: "${topic}".
Return only a JSON array of URL strings, nothing else. Example: ["https://...","https://..."]`
    }]
  })
  try {
    return JSON.parse(res.choices[0].message.content)
  } catch {
    console.error('Could not parse suggested URLs. Please pass URLs manually.')
    process.exit(1)
  }
}
