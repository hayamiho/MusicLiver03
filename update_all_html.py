import os
import re

CSS_BUBBLE = """
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
"""

def process_html_files(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.git' in dirs: dirs.remove('.git')
        
        for file in files:
            if not file.endswith('.html'):
                continue
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # 1. admin_listener.html -> mypage.html
            content = content.replace('admin_listener.html', 'mypage.html')
            
            # 2. Hamburger menu schedule
            content = content.replace(
                '<a href="schedule.html">全国のライブスケジュール一覧</a>',
                '<a href="#" onclick="event.preventDefault();const b=document.createElement(\'div\');b.className=\'coming-soon-bubble\';b.textContent=\'近日公開予定\';b.style.left=(event.pageX-40)+\'px\';b.style.top=(event.pageY-40)+\'px\';document.body.appendChild(b);setTimeout(()=>b.remove(),1500);" style="color: #999;">全国のライブスケジュール一覧</a>'
            )
            
            # 3. Footer nav schedule
            # active and non-active
            pattern_footer = re.compile(
                r'<a href="schedule\.html"\s+class="nav-item(?: active)?">\s*<img\s+src="images/icon_schedule\.svg"\s+alt="SCHEDULE"\s+class="nav-icon">\s*<span>SCHEDULE</span>\s*</a>',
                re.IGNORECASE | re.DOTALL
            )
            replacement_footer = '''<a href="#" onclick="event.preventDefault();const b=document.createElement('div');b.className='coming-soon-bubble';b.textContent='近日公開予定';b.style.left=(event.pageX-30)+'px';b.style.top=(event.pageY-40)+'px';document.body.appendChild(b);setTimeout(()=>b.remove(),1500);" class="nav-item" style="filter: grayscale(100%); opacity: 0.5;">
                <img src="images/icon_schedule.svg" alt="SCHEDULE" class="nav-icon">
                <span>SCHEDULE</span>
            </a>'''
            content = pattern_footer.sub(replacement_footer, content)
            
            # 4. Points: 100pt -> 100cp, etc. (Match number + pt, e.g. "1,000pt" or "100pt")
            # Only match if it's not part of an HTML attribute or something weird
            content = re.sub(r'(\d{1,3}(?:,\d{3})*)\s*pt', r'\1cp', content)
            
            if original != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {path}")

def update_css(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if '.coming-soon-bubble' not in content:
        with open(path, 'a', encoding='utf-8') as f:
            f.write(CSS_BUBBLE)
        print("Updated style.css")

if __name__ == "__main__":
    target_dir = r"c:\Users\mackh\OneDrive\デスクトップ\files\Developer\MusicLiver05"
    process_html_files(target_dir)
    update_css(os.path.join(target_dir, "style.css"))
