const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

const rules = [
    {
        // 入力ウィンドウの高さとプレースホルダー左の余白を増やす
        // 既存: class="w-full py-2.5 pr-10 pl-4 rounded-full border-none bg-[#f0f0f0] text-base outline-none"
        search: /class="w-full py-2\.5 pr-10 pl-4 rounded-full border-none bg-\[#f0f0f0\] text-base outline-none"/g,
        replace: 'class="w-full py-3.5 pr-10 pl-6 rounded-full border-none bg-[#f0f0f0] text-base outline-none"'
    },
    {
        // 検索アイテムリストの左右余白を増やす (px-5 -> px-8)
        search: /class="flex justify-between items-center px-5 py-4 border-b border-\[#f0f0f0\]"/g,
        replace: 'class="flex justify-between items-center px-8 py-4 border-b border-[#f0f0f0]"'
    }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;

    for (const rule of rules) {
        newContent = newContent.replace(rule.search, rule.replace);
    }

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Fixed UI:', path.basename(filePath));
    }
}

function main() {
    // 1. 各HTMLファイルのクラス調整
    const files = fs.readdirSync(targetDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            processFile(path.join(targetDir, file));
        }
    }
    
    // 2. input.css に @source ディレクティブを追加して確実にビルド対象にする
    const inputCssPath = path.join(targetDir, 'src', 'input.css');
    if (fs.existsSync(inputCssPath)) {
        let cssContent = fs.readFileSync(inputCssPath, 'utf-8');
        if (!cssContent.includes('@source')) {
            // 先頭の @import "tailwindcss"; の直後に追加
            cssContent = cssContent.replace('@import "tailwindcss";', '@import "tailwindcss";\n@source "../*.html";');
            fs.writeFileSync(inputCssPath, cssContent, 'utf-8');
            console.log('Updated input.css with @source fallback');
        }
    }
}

main();
