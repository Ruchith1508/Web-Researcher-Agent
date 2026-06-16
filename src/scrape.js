export async function scrapeUrl(url) {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ url, formats: ['markdown'] })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Scrape failed')
    const content = data.data?.markdown || ''
    if (!content) throw new Error('Empty markdown returned')
    return { url, content, error: null }
  } catch (err) {
    return { url, content: '', error: err.message }
  }
}