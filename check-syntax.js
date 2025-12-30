const fs = require('fs');
const content = fs.readFileSync('app/page.js', 'utf8');
try {
    // We can't easily parse JSX with standard node, 
    // but we can check basic bracket matching.
    let stack = [];
    let line = 1;
    let char = 1;
    for (let i = 0; i < content.length; i++) {
        let c = content[i];
        if (c === '\n') { line++; char = 1; }
        else char++;

        if (c === '{') stack.push({ line, char, c });
        if (c === '[') stack.push({ line, char, c });
        if (c === '(') stack.push({ line, char, c });

        if (c === '}') {
            let last = stack.pop();
            if (!last || last.c !== '{') { console.error(`Mismatch } at ${line}:${char}`); process.exit(1); }
        }
        if (c === ']') {
            let last = stack.pop();
            if (!last || last.c !== '[') { console.error(`Mismatch ] at ${line}:${char}`); process.exit(1); }
        }
        if (c === ')') {
            let last = stack.pop();
            if (!last || last.c !== '(') { console.error(`Mismatch ) at ${line}:${char}`); process.exit(1); }
        }
    }
    if (stack.length > 0) {
        stack.forEach(s => console.error(`Unclosed ${s.c} at ${s.line}:${s.char}`));
        process.exit(1);
    }
    console.log("Basic bracket matching looks OK.");
} catch (e) {
    console.error(e);
}
