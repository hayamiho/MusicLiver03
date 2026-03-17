const fs = require('fs');
const path = require('path');

const NEW_MENU = `    <div class="hamburger-menu-content" id="hamburgerMenu">
      <a href="index.html">トップページ</a>
      <a href="schedule.html">全国のライブスケジュール一覧</a>
      <a href="live.html">現在演奏中のミュージシャン</a>
      <a href="artists.html">アーティスト一覧</a>
      <a href="admin_listener.html">マイページ</a>
    </div>`;

function updateHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.vercel') {
                updateHtmlFiles(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const pattern = /<div class="hamburger-menu-content" id="hamburgerMenu">[\s\S]*?<\/div>/;
            
            if (pattern.test(content)) {
                const newContent = content.replace(pattern, NEW_MENU);
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

updateHtmlFiles(__dirname);
