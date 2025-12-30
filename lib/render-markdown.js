export function renderMarkdown(text) {
    if (!text) return ''

    let html = text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6">$1</h1>')

        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg col-span-full my-8 shadow-md" />')

        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:opacity-80 transition-opacity">$1</a>')

        // Code blocks
        .replace(/```([^`]+)```/g, '<pre class="bg-muted p-4 rounded-lg my-6 overflow-x-auto font-mono text-sm"><code>$1</code></pre>')

        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

        // Unordered Lists
        .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        // Wrap consecutive li elements in ul (naive approach, strict regex is hard)
        // Better: just style the li to have bullet.

        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-6">$1</blockquote>')

        // Line breaks (only double newlines to paragraph, naive single newline to br)
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br />')

    // Wrap in initial paragraph if not starting with tag
    if (!html.trim().startsWith('<')) {
        html = `<p class="mb-4">${html}</p>`
    }

    return html
}
