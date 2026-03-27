const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

function addTailwindLink(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // すでに output.css がある場合は何もしない
    if (content.includes('href="dist/output.css"')) {
        return;
    }
    
    // <link rel="stylesheet" href="style.css"> のすぐ下に追記する
    const styleCssLink = '<link rel="stylesheet" href="style.css">';
    const targetLink = '<link rel="stylesheet" href="dist/output.css">';
    
    if (content.includes(styleCssLink)) {
        let newContent = content.replace(styleCssLink, styleCssLink + '\n    ' + targetLink);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log('Added link to:', path.basename(filePath));
        }
    }
}

function main() {
    const files = fs.readdirSync(targetDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            addTailwindLink(path.join(targetDir, file));
        }
    }
}

main();
