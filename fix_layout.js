const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* Search Full Screen Modal Styles (Global) */
.full-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 3000;
    display: none;
    flex-direction: column;
    overflow-y: auto;
}
.full-modal.active {
    display: flex;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    z-index: 10;
}
.modal-close {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
}
.modal-title {
    font-weight: bold;
    font-size: 1.1rem;
}
.modal-body {
    padding: 0 0 40px 0;
}
`;

function fixFiles(directory, isRoot = true) {
    if (isRoot) {
        // 1. Update style.css
        const stylePath = path.join(directory, 'style.css');
        if (fs.existsSync(stylePath)) {
            let styleContent = fs.readFileSync(stylePath, 'utf8');
            if (!styleContent.includes('.full-modal {') && !styleContent.includes('Search Full Screen Modal')) {
                fs.appendFileSync(stylePath, cssToAdd, 'utf8');
                console.log("Updated: style.css");
            }
        }
    }

    // 2. Loop through HTML files
    const items = fs.readdirSync(directory);
    for (const item of items) {
        if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.vercel') continue;
        
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            fixFiles(fullPath, false);
        } else if (stat.isFile() && item.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            const favPatternSafe = /<div\s+class="fav-artists">[\s\S]*?<\/div>[\s]*<\/div>/g;
            if (favPatternSafe.test(content)) {
                content = content.replace(favPatternSafe, '');
            }
            
            // Fix arrow icons in search modal
            content = content.replace(
                /<button\s+class="modal-close"([^>]*)>[^<]*←[^<]*<\/button>/g,
                '<button class="modal-close"$1 style="background: none; border: none; padding: 0;"><img src="images/icon_arrow2.svg" alt="戻る" style="width: 24px; height: 24px; pointer-events: none;"></button>'
            );
            // pointer-events: none to parent's click doesn't get messed up if they click img. Wait, it's fine without it.
            // Also fix the case if formatting separated attributes
            if (content.includes('>←</button>')) {
                content = content.replace(
                    /<button\s+class="modal-close"([^>]*)>\s*←\s*<\/button>/g,
                    '<button class="modal-close"$1 style="background: none; border: none; padding: 0;"><img src="images/icon_arrow2.svg" alt="戻る" style="width: 24px; height: 24px;"></button>'
                );
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated HTML: ${fullPath}`);
            }
        }
    }
}

const targetDir = "C:\\Users\\mackh\\OneDrive\\デスクトップ\\files\\Developer\\MusicLiver05";
fixFiles(targetDir);
