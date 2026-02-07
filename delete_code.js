const fs = require('fs');
const path = 'c:/Users/Rully/Desktop/Instagram Observ/mobile-obeservation/src/App.js';

try {
    const content = fs.readFileSync(path, 'utf8');
    // Handle both Windows and Unix line endings
    const lines = content.split(/\r?\n/);

    const startLine = 1376;
    const endLine = 1501;
    const startIdx = startLine - 1;
    const endIdx = endLine - 1;

    // Verification
    if (!lines[startIdx] || !lines[startIdx].includes('{/* MODAL FORM */}')) {
        console.error(`Validation Failed: Line ${startLine} is "${lines[startIdx]}" not "{/* MODAL FORM */}"`);
        process.exit(1);
    }

    // Remove the block
    lines.splice(startIdx, endIdx - startIdx + 1);

    // Write back
    const joinChar = content.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(path, lines.join(joinChar));

    console.log('Successfully removed duplicate modal block.');
} catch (e) {
    console.error(e);
    process.exit(1);
}
