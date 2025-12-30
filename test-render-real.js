const { renderMarkdown } = require('./lib/render-markdown');

const input = '![Image](/uploads/1767011440467_bc432e6a-3e5c-40b8-a207-9e641cb6877e_desktop_Success_in_the_digital_world_starts_with_the_right_.jpg.jpg)';
console.log('Testing renderMarkdown with specific input...');
try {
    const output = renderMarkdown(input);
    console.log('Output:', output);
    if (output.includes('<img src="/uploads/1767011440467')) {
        console.log('✅ Conversion successful');
    } else {
        console.log('❌ Conversion failed');
    }
} catch (e) {
    console.error('Error:', e);
}
