const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');

// 置換ルールの定義
// style="xxx" を class="yyy" に変換、または既存の class に yyy を追加する
const rules = [
    {
        // 検索モーダル・アイテム行
        search: /style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;"/g,
        replace: 'class="flex justify-between items-center px-5 py-4 border-b border-[#f0f0f0]"'
    },
    {
        // 検索モーダル・テキスト
        search: /style="color: var\(--accent-blue\); font-weight: bold; font-size: 1\.1rem;"/g,
        replace: 'class="text-[var(--accent-blue)] font-bold text-[1.1rem]"'
    },
    {
        // 検索モーダル・削除ボタン
        search: /style="color: var\(--accent-blue\); cursor: pointer;"/g,
        replace: 'class="text-[var(--accent-blue)] cursor-pointer"'
    },
    {
        // 検索モーダル・ヘッダ
        search: /style="justify-content: flex-start; gap: 12px; padding: 12px 20px;"/g,
        replace: 'class="modal-header flex justify-start gap-3 px-5 py-3"' // 既存classがすでにある場合どうするかが課題
    },
    {
        // 検索モーダル・入力欄
        search: /style="width: 100%; padding: 10px 40px 10px 16px; border-radius: 20px; border: none; background: #f0f0f0; font-size: 1rem; outline: none;"/g,
        replace: 'class="w-full py-2.5 pr-10 pl-4 rounded-full border-none bg-[#f0f0f0] text-base outline-none"'
    },
    {
        // 検索モーダル・虫眼鏡アイコン(絶対配置)
        search: /style="position: absolute; right: 12px; top: 50%; transform: translateY\(-50%\); width: 20px; height: 20px; opacity: 0\.6;"/g,
        replace: 'class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"'
    },
    {
        // 検索モーダルの閉じるボタン
        search: /style="font-size: 1\.8rem; line-height: 1;" style="background: none; border: none; padding: 0;"/g,
        replace: 'class="modal-close text-[1.8rem] leading-none bg-none border-none p-0"'
    },
    {
        // 検索モーダルの閉じるボタン(一部違うパターンの場合)
        search: /style="background: none; border: none; padding: 0;"/g,
        replace: 'class="modal-close bg-none border-none p-0"'
    },
    {
        // ヘッダのアイコン
        search: /style="width: 24px; height: 24px; cursor: pointer;"/g,
        replace: 'class="w-6 h-6 cursor-pointer"'
    },
    {
        // 検索モーダル・戻るアイコン
        search: /style="width: 24px; height: 24px; pointer-events: none;"/g,
        replace: 'class="w-6 h-6 pointer-events-none"'
    },
    {
        // 検索モーダル・フレックスラッパー
        search: /style="flex: 1; position: relative;"/g,
        replace: 'class="flex-1 relative"'
    },
    {
        // z-index: 4000
        search: /class="full-modal" style="z-index: 4000;"/g,
        replace: 'class="full-modal z-[4000]"'
    },
    {
        // padding:0
        search: /class="modal-body" style="padding: 0;"/g,
        replace: 'class="modal-body p-0"'
    }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;
    
    // クラスの結合問題を避けるため、既存の class="..." があるタグに style="..." がある場合は単純置換で行けるか確認
    // modal-headerなどの場合：<div class="modal-header" style="..."> -> <div class="modal-header flex ..."> 
    newContent = newContent.replace(/class="modal-header" style="justify-content: flex-start; gap: 12px; padding: 12px 20px;"/g, 'class="modal-header flex justify-start gap-3 px-5 py-3"');
    
    // 他の単純置換
    for (const rule of rules) {
        newContent = newContent.replace(rule.search, rule.replace);
    }
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Updated:', path.basename(filePath));
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
