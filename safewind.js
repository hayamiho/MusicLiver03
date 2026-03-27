const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

const rules = [
    {
        // 検索アイテムリスト (重複回避のため丸ごとマッチさせる)
        search: /<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">/g,
        replace: '<div class="flex justify-between items-center px-5 py-4 border-b border-[#f0f0f0]">'
    },
    {
        // 検索アイテムテキスト
        search: /<div style="color: var\(--accent-blue\); font-weight: bold; font-size: 1\.1rem;">/g,
        replace: '<div class="text-[var(--accent-blue)] font-bold text-[1.1rem]">'
    },
    {
        // 検索アイテム削除
        search: /<div style="color: var\(--accent-blue\); cursor: pointer;">/g,
        replace: '<div class="text-[var(--accent-blue)] cursor-pointer">'
    },
    {
        // 検索モーダルヘッダ（class重複を確実に回避）
        search: /<div class="modal-header" style="justify-content: flex-start; gap: 12px; padding: 12px 20px;">/g,
        replace: '<div class="modal-header justify-start gap-3 px-5 py-3">'
    },
    {
        // 閉じるボタン（class重複を確実に回避）
        search: /<button class="modal-close" onclick="document\.getElementById\('searchOverlay'\)\.classList\.remove\('active'\)" style="background: none; border: none; padding: 0;">/g,
        replace: '<button class="modal-close bg-none border-none p-0" onclick="document.getElementById(\'searchOverlay\').classList.remove(\'active\')">'
    },
    {
        // 戻るアイコン
        search: /<img src="images\/icon_arrow2\.svg" alt="戻る" style="width: 24px; height: 24px; pointer-events: none;">/g,
        replace: '<img src="images/icon_arrow2.svg" alt="戻る" class="w-6 h-6 pointer-events-none">'
    },
    {
        // 入力欄ラッパー
        search: /<div style="flex: 1; position: relative;">/g,
        replace: '<div class="flex-1 relative">'
    },
    {
        // 入力欄 (Arbitrary value 使用でピクセルパーフェクト)
        search: /<input type="text" placeholder="MLSSを検索" style="width: 100%; padding: 10px 40px 10px 16px; border-radius: 20px; border: none; background: #f0f0f0; font-size: 1rem; outline: none;">/g,
        replace: '<input type="text" placeholder="MLSSを検索" class="w-full py-[10px] pr-[40px] pl-[16px] rounded-[20px] border-none bg-[#f0f0f0] text-[1rem] outline-none">'
    },
    {
        // 検索アイコン (絶対位置)
        search: /<img src="images\/icon_search\.svg" style="position: absolute; right: 12px; top: 50%; transform: translateY\(-50%\); width: 20px; height: 20px; opacity: 0\.6;">/g,
        replace: '<img src="images/icon_search.svg" class="absolute right-[12px] top-1/2 -translate-y-1/2 w-5 h-5 opacity-60">'
    },
    {
        // searchOverlay 自身
        search: /<div id="searchOverlay" class="full-modal" style="z-index: 4000;">/g,
        replace: '<div id="searchOverlay" class="full-modal z-[4000]">'
    },
    {
        // modal-body の padding 0
        search: /<div class="modal-body" style="padding: 0;">/g,
        replace: '<div class="modal-body p-0">'
    },
    {
        // header の検索アイコン (class重複回避)
        search: /<img src="images\/icon_search\.svg" class="menu-icon" onclick="toggleSearch\(\)" alt="検索" style="width: 24px; height: 24px; cursor: pointer;">/g,
        replace: '<img src="images/icon_search.svg" class="menu-icon w-6 h-6 cursor-pointer" onclick="toggleSearch()" alt="検索">'
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
        console.log('Restructured:', path.basename(filePath));
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
