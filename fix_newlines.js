const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // <style>\n の \n という文字リテラルを探して実際の改行に直す
    let newContent = content.replace(/<style>\\n/g, '<style>\n');
    newContent = newContent.replace(/\\n<\/style>/g, '\n</style>');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Fixed:', path.basename(filePath));
    }
}

function main() {
    const files = fs.readdirSync(targetDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            fixFile(path.join(targetDir, file));
        }
    }
}

main();
