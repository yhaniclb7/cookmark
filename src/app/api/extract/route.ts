import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the URL');
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Basic heuristic for recipe extraction
    // Look for common recipe schema or structures
    const title = doc.querySelector('h1')?.textContent?.trim() || 'Recipe';
    
    // Attempt to find the main content area
    const body = doc.body;
    
    // Remove unwanted elements
    const selectorsToRemove = [
      'header', 'footer', 'nav', 'aside', 'script', 'style', 'iframe', 'ads', '.ads', '#ads',
      '.sidebar', '.comment', '.footer', '.header', '.menu', '.social-share'
    ];
    selectorsToRemove.forEach(s => {
      body.querySelectorAll(s).forEach(el => el.remove());
    });

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(body.innerHTML);

    return NextResponse.json({ title, markdown });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract recipe' }, { status: 500 });
  }
}
