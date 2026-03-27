import os
import re

target_dir = r"c:\Users\mackh\OneDrive\デスクトップ\files\Developer\MusicLiver05"

# 抽出・削除したいクラス定義のリストアップ（正規表現パターン）
patterns_to_remove = [
    r"\.form-container\s*\{[^}]*\}",
    r"\.input-field\s*\{[^}]*\}",
    r"\.input-field::placeholder\s*\{[^}]*\}",
    r"\.input-field:focus\s*\{[^}]*\}",
    r"\.hint-text\s*\{[^}]*\}",
    r"/\*\s*Full Screen Modal\s*\*/",
    r"\.full-modal\s*\{[^}]*\}",
    r"\.full-modal\.active\s*\{[^}]*\}",
    r"\.modal-header\s*\{[^}]*\}",
    r"\.modal-close\s*\{[^}]*\}",
    r"\.modal-title\s*\{[^}]*\}",
    r"\.modal-save\s*\{[^}]*\}",
    r"\.modal-body\s*\{[^}]*\}"
]

common_css_to_add = """
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
"""

def clean_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # <style>タグ内の該当クラスを削除
    style_blocks = re.findall(r"<style>(.*?)</style>", content, re.DOTALL)
    new_content = content
    modified = False
    
    for block in style_blocks:
        new_block = block
        for pattern in patterns_to_remove:
            new_block = re.sub(pattern, "", new_block, flags=re.DOTALL)
        
        # 不要な空行を削除
        new_block = re.sub(r'\n\s*\n', '\n', new_block)
        
        if new_block != block:
            modified = True
            # もしstyleブロック内が完全に空になったら<style></style>ごと消す、そうでなければ差し替え
            if new_block.strip() == "":
                new_content = new_content.replace(f"<style>{block}</style>", "")
            else:
                new_content = new_content.replace(block, new_block)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    # HTMLファイルの書き換え
    for filename in os.listdir(target_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(target_dir, filename)
            clean_html_file(filepath)

    # style.css への追記（既に記述がなければ）
    style_css_path = os.path.join(target_dir, "style.css")
    if os.path.exists(style_css_path):
        with open(style_css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        if ".form-container" not in css_content and ".full-modal" not in css_content:
            with open(style_css_path, 'a', encoding='utf-8') as f:
                f.write("\n" + common_css_to_add)
            print("style.css updated.")

if __name__ == "__main__":
    main()
