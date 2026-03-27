const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

const cdnTag = '    <script src="https://cdn.tailwindcss.com"></script>\n';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // すでにCDNがある場合はスキップ
    if (content.includes('cdn.tailwindcss.com')) {
        return;
    }

    // dist/output.css の直下、または </head> の直前に入れる
    if (content.includes('<link rel="stylesheet" href="dist/output.css">')) {
        content = content.replace(
            /<link rel="stylesheet" href="dist\/output\.css">/g,
            '<link rel="stylesheet" href="dist/output.css">\n' + cdnTag
        );
    } else {
        content = content.replace(
            /<\/head>/g,
            cdnTag + '</head>'
        );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Added Tailwind CDN to:', path.basename(filePath));
}

function main() {
    const files = fs.readdirSync(targetDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            processFile(path.join(targetDir, file));
        }
    }
}

main();
