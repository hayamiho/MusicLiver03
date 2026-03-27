const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'mackh', 'OneDrive', 'デスクトップ', 'files', 'Developer', 'MusicLiver05');
const styleCssPath = path.join(targetDir, 'style.css');

const patternsToRemove = [
    /\.form-container\s*\{[^}]*\}/gs,
    /\.input-field\s*\{[^}]*\}/gs,
    /\.input-field::placeholder\s*\{[^}]*\}/gs,
    /\.input-field:focus\s*\{[^}]*\}/gs,
    /\.hint-text\s*\{[^}]*\}/gs,
    /\/\*\s*Full Screen Modal\s*\*\//g,
    /\.full-modal\s*\{[^}]*\}/gs,
    /\.full-modal\.active\s*\{[^}]*\}/gs,
    /\.modal-header\s*\{[^}]*\}/gs,
    /\.modal-close\s*\{[^}]*\}/gs,
    /\.modal-title\s*\{[^}]*\}/gs,
    /\.modal-save\s*\{[^}]*\}/gs,
    /\.modal-body\s*\{[^}]*\}/gs,
    /\.point-box\s*\{[^}]*\}/gs,
];

const commonCssToAdd = `
/* --- 共通フォーム用 --- */
.form-container {
    padding: 20px;
    text-align: center;
}

.input-field {
    width: 100%;
    height: 60px;
    padding: 0 16px;
    font-size: 1.2rem;
    text-align: center;
    background: #fff;
    border: 2px solid #ccc;
    border-radius: var(--border-radius);
    color: var(--text-primary);
    margin: 12px 0;
    box-sizing: border-box;
}

.input-field::placeholder {
    color: #999;
}

.input-field:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(102, 252, 241, 0.5);
}

.hint-text {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 30px;
}

/* --- Full Screen Modal --- */
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
    font-size: 1.4rem;
    color: #333;
    cursor: pointer;
}

.modal-title {
    font-weight: bold;
    font-size: 1.1rem;
}

.modal-save {
    background: #333;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 6px 16px;
    font-weight: bold;
    cursor: pointer;
}

.modal-body {
    padding: 0 0 40px 0;
}

.point-box {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    padding: 24px;
    margin: 0 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;
    const styleRegex = /<style>([\s\S]*?)<\/style>/g;
    
    let match;
    let modified = false;
    let occurrences = [];
    
    while ((match = styleRegex.exec(content)) !== null) {
        occurrences.push({
            full: match[0],
            inner: match[1]
        });
    }
    
    for (const occ of occurrences) {
        let newStyleContent = occ.inner;
        for (const pattern of patternsToRemove) {
            newStyleContent = newStyleContent.replace(pattern, '');
        }
        
        newStyleContent = newStyleContent.replace(/^\\s*[\\r\\n]/gm, '');
        
        if (occ.inner.trim() !== newStyleContent.trim()) {
            modified = true;
            if (newStyleContent.trim() === '') {
                newContent = newContent.replace(occ.full, '');
            } else {
                newContent = newContent.replace(occ.full, '<style>\\n' + newStyleContent + '\\n</style>');
            }
        }
    }
    
    if (modified) {
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
    
    if (fs.existsSync(styleCssPath)) {
        const cssContent = fs.readFileSync(styleCssPath, 'utf-8');
        if (!cssContent.includes('.full-modal') && !cssContent.includes('.form-container')) {
            fs.appendFileSync(styleCssPath, '\\n' + commonCssToAdd, 'utf-8');
            console.log('style.css updated.');
        }
    }
}

main();
