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

    let recipeData: any = null;

    // Try to find JSON-LD
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        const findRecipe = (obj: any): any => {
          if (obj['@type'] === 'Recipe') return obj;
          if (obj['@graph']) return obj['@graph'].find((item: any) => item['@type'] === 'Recipe');
          return null;
        };
        const found = Array.isArray(data) ? data.find(findRecipe) : findRecipe(data);
        if (found) recipeData = found;
      } catch (e) {}
    });

    let title = '';
    let markdown = '';
    const turndownService = new TurndownService();

    if (recipeData) {
      title = recipeData.name;
      const ingredients = Array.isArray(recipeData.recipeIngredient) 
        ? recipeData.recipeIngredient.map((i: string) => `- ${i}`).join('\n')
        : '';
      
      let instructions = '';
      if (Array.isArray(recipeData.recipeInstructions)) {
        instructions = recipeData.recipeInstructions.map((step: any) => {
          if (typeof step === 'string') return step;
          return step.text || step.name || '';
        }).join('\n\n');
      }

      markdown = `# ${title}\n\n## Ingredients\n${ingredients}\n\n## Instructions\n${instructions}`;
    } else {
      // Fallback to heuristic
      title = doc.querySelector('h1')?.textContent?.trim() || 'Recipe';
      const body = doc.body;
      const selectorsToRemove = [
        'header', 'footer', 'nav', 'aside', 'script', 'style', 'iframe', 'ads', '.ads', '#ads',
        '.sidebar', '.comment', '.footer', '.header', '.menu', '.social-share'
      ];
      selectorsToRemove.forEach(s => body.querySelectorAll(s).forEach(el => el.remove()));
      markdown = turndownService.turndown(body.innerHTML);
    }

    return NextResponse.json({ title, markdown });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract recipe' }, { status: 500 });
  }
}
