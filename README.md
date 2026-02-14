# CookMark

**Clean Recipes, Zero Bloat.**

Convert recipe websites to clean Markdown instantly. No ads, no life stories, just ingredients and instructions.

## Problem

Modern recipe websites are bloated with:
- Endless scroll of ads
- "My grandmother's story about this dish..."
- Auto-playing videos
- Newsletter popups
- Cookie consent banners

People just want the recipe.

## Solution

CookMark extracts recipe content from any URL and converts it to clean, readable Markdown that you can:
- Save to your notes app (Obsidian, Notion, Logseq)
- Print without wasting ink
- Read without distractions
- Store offline forever

## Features

- 🍳 **One-click extraction** - Paste any recipe URL
- 📝 **Clean Markdown output** - No ads, no stories
- 💾 **Download as .md file** - Keep recipes forever
- 📋 **Copy to clipboard** - Quick paste into your notes
- 🔒 **Privacy-focused** - No tracking, no analytics
- 🚀 **Fast** - Built with Next.js and deployed on serverless

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + Typography plugin
- jsdom + Turndown (for extraction)
- React Markdown

## Deployment

This app is designed to deploy seamlessly to Vercel:

1. Fork/clone this repo
2. Connect to Vercel
3. Deploy

## Local Development

```bash
npm install
npm run dev
```

## API

```
POST /api/extract
Content-Type: application/json

{
  "url": "https://example.com/recipe"
}
```

Response:
```json
{
  "title": "Recipe Title",
  "markdown": "# Recipe Title\n\nIngredients..."
}
```

## Monetization Strategy

1. **Freemium Model**
   - Free: 10 extractions/day
   - Pro ($5/month): Unlimited extractions, Chrome extension, meal planning

2. **Chrome Extension** (future)
   - One-click extraction from any recipe site

3. **Meal Planning Integration** (future)
   - Export to grocery lists
   - Weekly meal planner

## Market

Based on Reddit research:
- 640+ posts asking for offline-first/local-only tools
- High frustration with "subscription fatigue"
- Recipe sites rated among the worst ad experiences
- Strong interest in markdown-based workflows

## License

MIT
