# Web Researcher Agent

One command. Full research report. Type a topic and get a clean, structured markdown report — sources scraped, content extracted, findings organized by Groq's LLaMA 3.

## What it does

- Scrapes any URLs you provide using the Firecrawl API
- Sends the content to Groq (LLaMA 3.3 70B) for analysis
- Outputs a structured markdown report with key facts, perspectives, conflicts, sources, and follow-up questions
- If you don't provide URLs, it asks Groq to suggest 5 relevant sources automatically

## Stack

- [Groq](https://console.groq.com) — LLaMA 3.3 70B for fast, free LLM analysis
- [Firecrawl](https://firecrawl.dev) — web scraping to clean markdown
- Node.js — no framework, just a CLI script

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/web-researcher.git
cd web-researcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API keys

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```
GROQ_API_KEY=your_groq_key_here
FIRECRAWL_API_KEY=your_firecrawl_key_here
```

- Groq key: [console.groq.com](https://console.groq.com) → API Keys → Create (free)
- Firecrawl key: [firecrawl.dev](https://firecrawl.dev) → Dashboard → API Keys (free tier: 500 scrapes/month)

## Usage

### With your own URLs

```bash
node research.js "topic" url1 url2 url3
```

```bash
node research.js "AI coding tools" https://cursor.com https://windsurf.com
```

### Let Groq suggest URLs automatically

```bash
node research.js "agentic workflows"
```

Reports are saved to `research/[topic].md`.

## Output format

Every report follows the same structure:

```
# Topic — Research Report

## Key facts & data points
## Different perspectives & approaches
## Conflicts & gaps ⚠️
## Sources
## 3 questions worth investigating further
```

Conflicting information across sources is flagged with ⚠️.

## Project structure

```
web-researcher/
├── src/
│   ├── scrape.js      ← Firecrawl API wrapper
│   └── analyze.js     ← Groq LLaMA 3 analysis
├── research/          ← saved reports (gitignored)
├── research.js        ← main CLI entrypoint
├── .env.example       ← API key template
└── package.json
```

## Example

```bash
$ node research.js "AI coding tools" https://cursor.com https://windsurf.com

🔍 Researching: AI coding tools
   Scraping 2 URLs...

   → https://cursor.com ✓ (15776 chars)
   → https://windsurf.com ✓ (20412 chars)

   2/2 pages scraped. Analyzing with Groq...

✓ Report saved to research/ai-coding-tools.md
```

## Ideas for extending this

- Add a `--search` flag to query a search API first, then scrape the top results
- Schedule weekly research runs with a cron job
- Add a `--format html` flag to output a styled HTML report
- Pipe the report into a second Groq call to generate a product brief or executive summary
