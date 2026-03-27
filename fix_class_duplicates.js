const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

const rules = [
    {
        // 検索アイコンのclass重複修正
        search: /class="menu-icon"\s+onclick="toggleSearch\(\)"\s+alt="検索"\s+class="w-6 h-6 cursor-pointer"/g,
        replace: 'class="menu-icon w-6 h-6 cursor-pointer" onclick="toggleSearch()" alt="検索"'
    },
    {
        // 閉じるボタンのclass重複修正
        search: /class="modal-close"\s+onclick="document\.getElementById\('searchOverlay'\)\.classList\.remove\('active'\)"\s+class="modal-close bg-none border-none p-0"/g,
        replace: 'class="modal-close bg-none border-none p-0" onclick="document.getElementById(\'searchOverlay\').classList.remove(\'active\')"'
    },
    {
        search: /class="modal-close"\s+onclick="document\.getElementById\('searchOverlay'\)\.classList\.remove\('active'\)"\s+class="modal-close text-\[1\.8rem\] leading-none bg-none border-none p-0"/g,
        replace: 'class="modal-close text-[1.8rem] leading-none bg-none border-none p-0" onclick="document.getElementById(\'searchOverlay\').classList.remove(\'active\')"'
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
        console.log('Fixed classes:', path.basename(filePath));
    }
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
