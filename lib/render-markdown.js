export function renderMarkdown(text) {
    if (!text) return ''

    let html = text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 font-heading">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 font-heading tracking-tight">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 font-heading tracking-tight">$1</h1>')

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

    // Split by double newline to identify paragraphs
    const paragraphs = html.split(/\n\n+/)

    html = paragraphs.map(p => {
        // Skip empty paragraphs
        if (!p.trim()) return ''

        // If content already starts with a block tag (h1-h6, blockquote, ul, ol, pre, div), don't wrap in p
        if (p.trim().match(/^<(h[1-6]|blockquote|ul|ol|pre|div)/i)) {
            return p.replace(/\n/g, '<br />')
        }

        // Otherwise wrap in p
        return `<p class="mb-4 text-slate-200 leading-relaxed">${p.replace(/\n/g, '<br />')}</p>`
    }).join('')

    return html

    return html
}
