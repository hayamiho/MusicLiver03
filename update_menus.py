import os
import re

# 最新のメニューブロック
NEW_MENU = """    <div class="hamburger-menu-content" id="hamburgerMenu">
      <a href="index.html">トップページ</a>
      <a href="schedule.html">全国のライブスケジュール一覧</a>
      <a href="live.html">現在演奏中のミュージシャン</a>
      <a href="artists.html">アーティスト一覧</a>
      <a href="admin_listener.html">マイページ</a>
    </div>"""

def update_html_files(directory):
    for root, dirs, files in os.walk(directory):
        # node_modulesなどは除外
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # hamburger-menu-contentのブロックを置換
                # <div class="hamburger-menu-content" id="hamburgerMenu"> ... </div> を探す
                pattern = re.compile(r'<div class="hamburger-menu-content" id="hamburgerMenu">.*?</div>', re.DOTALL)
                
                if pattern.search(content):
                    new_content = pattern.sub(NEW_MENU, content)
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {path}")

if __name__ == "__main__":
    target_dir = r"c:\Users\mackh\OneDrive\デスクトップ\files\Developer\MusicLiver05"
    update_html_files(target_dir)
