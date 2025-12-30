function renderMarkdown(text) {
    let html = text
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
    return html;
}

const input = '![Test Image](/uploads/test.jpg)';
const output = renderMarkdown(input);
console.log('Input:', input);
console.log('Output:', output);

if (output === '<img src="/uploads/test.jpg" alt="Test Image" class="max-w-full h-auto rounded-lg my-4" />') {
    console.log('✅ Regex works');
} else {
    console.log('❌ Regex failed');
}
