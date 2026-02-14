'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Utensils, Loader2, Clipboard, Github } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Extracting...');
  const [recipe, setRecipe] = useState<{ title: string; markdown: string } | null>(null);
  const [error, setError] = useState('');

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Fetching page...');
    setError('');
    
    // Simulate progressive loading messages
    const messages = ['Analyzing structure...', 'Extracting ingredients...', 'Cleaning up bloat...', 'Generating Markdown...'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLoadingMessage(messages[i]);
        i++;
      }
    }, 800);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');

      setRecipe(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!recipe) return;
    const blob = new Blob([recipe.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
            <Utensils className="w-6 h-6" />
            <span>CookMark</span>
          </div>
          <a href="https://github.com" className="text-slate-500 hover:text-slate-900 transition-colors">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">
            Clean Recipes, Zero Bloat.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste a recipe URL and get a clean, Markdown version instantly. 
            No ads, no life stories, just the ingredients and instructions.
          </p>
        </div>

        <form onSubmit={handleExtract} className="flex flex-col sm:flex-row gap-2 mb-12">
          <input
            type="url"
            required
            placeholder="https://example.com/best-pasta-recipe"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white transition-all shadow-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{loadingMessage}</span>
              </>
            ) : 'Extract Recipe'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-8">
            {error}
          </div>
        )}

        {recipe && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b p-6 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{recipe.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(recipe.markdown);
                    alert('Markdown copied to clipboard!');
                  }}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                  title="Copy to Clipboard"
                >
                  <Clipboard className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Save .md
                </button>
              </div>
            </div>
            <div className="p-8 prose prose-slate max-w-none prose-img:rounded-xl prose-headings:text-slate-900 prose-a:text-orange-600 overflow-y-auto max-h-[600px]">
              <ReactMarkdown>{recipe.markdown}</ReactMarkdown>
            </div>
          </div>
        )}

        {!recipe && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Offline First</h3>
              <p className="text-sm text-slate-500">Download recipes as Markdown to keep in your personal vault (Obsidian, Notion, Logseq).</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">AI Extraction</h3>
              <p className="text-sm text-slate-500">Intelligently strips away ads, tracking scripts, and redundant "blog" content.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Open Source</h3>
              <p className="text-sm text-slate-500">Simple, transparent, and built for the community. No sneaky subscriptions.</p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-24 border-t py-12 text-center text-slate-400 text-sm">
        <p>&copy; 2026 CookMark. Built in one night by Software Factory.</p>
      </footer>
    </main>
  );
}
