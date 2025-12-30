const { renderMarkdown } = require('./lib/render-markdown-test-shim');

const input = '![Image](/uploads/1767011440467_bc432e6a-3e5c-40b8-a207-9e641cb6877e_desktop_Success_in_the_digital_world_starts_with_the_right_.jpg.jpg)';
// Note: I can't require the lib file directly if it uses 'export function' (ESM) and I use 'require' (CJS).
// So I will just copy the function here to test the regex logic again on this specific string.

function testRender(text) {
    return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg col-span-full my-8 shadow-md" />');
}

const output = testRender(input);
console.log('Input:', input);
console.log('Output:', output);

if (output.startsWith('<img')) {
    console.log('✅ Regex works on long filename');
} else {
    console.log('❌ Regex failed');
}
