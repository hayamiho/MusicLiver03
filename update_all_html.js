const fs = require('fs');
const path = require('path');

const cssBubble = `
.coming-soon-bubble {
    position: absolute;
    background: #555;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    pointer-events: none;
    z-index: 10000;
    white-space: nowrap;
    animation: bubbleFade 1.5s forwards;
}
.coming-soon-bubble::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}
@keyframes bubbleFade {
    0% { opacity: 0; transform: translateY(5px); }
    10% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
}
`;

function processFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processFiles(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // 1. admin_listener.html -> mypage.html
            content = content.replace(/admin_listener\.html/g, 'mypage.html');
            
            // 2. Hamburger menu toggle
            content = content.replace(
                /<a\s+href="schedule\.html".*?>全国のライブスケジュール一覧<\/a>/g,
                '<a href="#" onclick="event.preventDefault();const b=document.createElement(\'div\');b.className=\'coming-soon-bubble\';b.textContent=\'近日公開予定\';b.style.left=(event.pageX-40)+\'px\';b.style.top=(event.pageY-40)+\'px\';document.body.appendChild(b);setTimeout(()=>b.remove(),1500);" style="color: #999;">全国のライブスケジュール一覧</a>'
            );
            
            // 3. Footer nav
            const footerRegex = /<a\s+href="schedule\.html"\s+class="nav-item(?: active)?">\s*<img\s+src="images\/icon_schedule\.svg"\s+alt="SCHEDULE"\s+class="nav-icon">\s*<span>SCHEDULE<\/span>\s*<\/a>/gi;
            const replacement = `<a href="#" onclick="event.preventDefault();const b=document.createElement('div');b.className='coming-soon-bubble';b.textContent='近日公開予定';b.style.left=(event.pageX-30)+'px';b.style.top=(event.pageY-40)+'px';document.body.appendChild(b);setTimeout(()=>b.remove(),1500);" class="nav-item" style="filter: grayscale(100%); opacity: 0.5;">\n                <img src="images/icon_schedule.svg" alt="SCHEDULE" class="nav-icon">\n                <span>SCHEDULE</span>\n            </a>`;
            content = content.replace(footerRegex, replacement);
            
            // 4. pt -> cp (like "100pt", "1,000pt") - matching digit + optional comma + digit + pt
            const ptRegex = /([0-9]{1,3}(?:,[0-9]{3})*)\s*pt/g;
            content = content.replace(ptRegex, '$1cp');
            
            if (original !== content) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        } else if (file === 'style.css') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('.coming-soon-bubble')) {
                fs.appendFileSync(fullPath, cssBubble, 'utf8');
                console.log(`Updated style.css`);
            }
        }
    }
}

processFiles(__dirname);
