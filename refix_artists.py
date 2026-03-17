import csv
import io

def fix_artist_pages():
    profile_path = '../data/profile.txt'
    
    # Read the file with proper multiline support
    with open(profile_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t', quotechar='"')
        header = next(reader)
        # 0:名前, 1:ふりがな, 2:ID, 3:説明文, 4:X, 5:Insta, 6:TikTok, 7:Youtube
        
        artists = list(reader)

    template_head = r'''<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE_PLACEHOLDER | 日本橋 Music Liver</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .artist-hero { position: relative; width: 100%; height: 60vh; }
        .artist-hero img { width: 100%; height: 100%; object-fit: cover; }
        .artist-hero-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 60px 20px 20px; background: linear-gradient(to top, rgba(11, 12, 16, 1) 10%, transparent); }
        .artist-hero-name { font-size: 2.2rem; font-weight: 900; margin-bottom: 4px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8); color: #fff; }
        .biography-section { padding: 0 20px 20px; color: var(--text-secondary); font-size: 0.95rem; }
        .tipping-section { background: var(--bg-card); margin: 20px 20px 100px; padding: 24px; border-radius: var(--border-radius); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 102, 161, 0.2); }
        .tipping-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 16px; text-align: center; color: var(--accent-pink); }
        .tip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .tip-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px 8px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s; }
        .tip-btn:active { background: rgba(255, 102, 161, 0.1); border-color: var(--accent-pink); transform: translateY(-2px); }
        .tip-icon { font-size: 2rem; margin-bottom: 8px; }
        .tip-label { font-size: 0.8rem; color: var(--text-primary); }
        .point-info { text-align: center; font-size: 0.9rem; margin-bottom: 12px; color: var(--accent-cyan); }
        .small-link { display: block; text-align: center; font-size: 0.7rem; color: var(--text-secondary); text-decoration: underline; }
    </style>
</head>
<body>
    <div class="app-container">
        <header>
            <a href="index.html" class="logo-link"><img src="images/logo-mlss.png" alt="Music Liver" class="header-logo"></a>
            <div class="menu-icon" onclick="toggleMenu()">≡</div>
        </header>
        <div class="hamburger-menu-content" id="hamburgerMenu">
            <a href="index.html">トップページ</a>
            <a href="map.html">会場マップ</a>
            <a href="schedule.html">ライブスケジュール</a>
            <a href="artists.html">アーティスト一覧</a>
            <a href="admin_listener.html">マイページ</a>
        </div>
        <main>
            <div class="artist-hero">
                <img src="IMAGE_PATH_PLACEHOLDER" alt="NAME_PLACEHOLDER">
                <div class="artist-hero-overlay">
                    <h2 class="artist-hero-name">NAME_PLACEHOLDER</h2>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-bottom: 10px;">FURIGANA_PLACEHOLDER</div>
                </div>
            </div>
            <div class="biography-section">
                <br>
                BIO_TEXT_PLACEHOLDER
                <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                    SNS_ICONS_PLACEHOLDER
                </div>
            </div>
            <div class="tipping-section">
                <div class="tipping-title">CheerPointでアイテムを送ろう！</div>
                <div class="tip-grid">
                    <div class="tip-btn" onclick="handleTip('star')"><div class="tip-icon">⭐</div><div class="tip-label">スター</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">100pt</div></div>
                    <div class="tip-btn" onclick="handleTip('heart')"><div class="tip-icon">💖</div><div class="tip-label">ハート</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">100pt</div></div>
                    <div class="tip-btn" onclick="handleTip('firework')"><div class="tip-icon">🎇</div><div class="tip-label">花火</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">400pt</div></div>
                    <div class="tip-btn" onclick="handleTip('clap')"><div class="tip-icon">👏</div><div class="tip-label">拍手</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">10pt</div></div>
                    <div class="tip-btn" onclick="handleTip('cheer')"><div class="tip-icon">🔥</div><div class="tip-label">応援</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">300pt</div></div>
                    <div class="tip-btn" onclick="handleTip('message')"><div class="tip-icon">💬</div><div class="tip-label">メッセージ</div><div style="font-size: 0.7rem; color: var(--accent-pink); margin-top: 4px; font-weight: bold;">1000pt</div></div>
                </div>
                <div class="point-info">0 ポイント保有</div>
                <a href="law.html" class="small-link">特定商取引法に基づく表記</a>
            </div>
        </main>
        <nav class="bottom-nav">
            <a href="index.html" class="nav-item"><img src="images/icon_top.svg" alt="TOP" class="nav-icon"><span>TOP</span></a>
            <a href="schedule.html" class="nav-item"><img src="images/icon_schedule.svg" alt="SCHEDULE" class="nav-icon"><span>SCHEDULE</span></a>
            <a href="live.html" class="nav-item nav-live-highlight"><div class="nav-icon-wrapper"><img src="images/icon_live.svg" alt="LIVE" class="nav-icon"></div><span>LIVE</span></a>
            <a href="artists.html" class="nav-item active"><img src="images/icon_artist.svg" alt="ARTIST" class="nav-icon"><span>ARTIST</span></a>
            <a href="admin_listener.html" class="nav-item"><img src="images/icon_mypage.svg" alt="MY PAGE" class="nav-icon"><span>MY PAGE</span></a>
        </nav>
        <script>
            function toggleMenu() { document.getElementById('hamburgerMenu').classList.toggle('open'); }
            function handleTip(itemType) { window.location.href = 'tipping_confirm.html?artist=ID_PLACEHOLDER&item=' + itemType; }
        </script>
    </div>
</body>
</html>
'''

    for artist in artists:
        if not artist: continue
        name = artist[0]
        furi = artist[1]
        id_name = artist[2].strip()
        bio = artist[3].replace('\n', '<br>')
        x_url = artist[4] if len(artist) > 4 else ''
        insta_url = artist[5] if len(artist) > 5 else ''
        tiktok_url = artist[6] if len(artist) > 6 else ''
        yt_url = artist[7] if len(artist) > 7 else ''

        sns_icons = ''
        if x_url: sns_icons += f'<a href="{x_url}" target="_blank"><img src="images/icon_x.png" style="width: 32px; height: 32px;"></a>'
        if insta_url: sns_icons += f'<a href="{insta_url}" target="_blank"><img src="images/icon_instagram.png" style="width: 32px; height: 32px;"></a>'
        if tiktok_url: sns_icons += f'<a href="{tiktok_url}" target="_blank"><img src="images/icon_tiktok.png" style="width: 32px; height: 32px;"></a>'
        if yt_url: sns_icons += f'<a href="{yt_url}" target="_blank"><img src="images/icon_youtube.png" style="width: 32px; height: 32px;"></a>'

        content = template_head
        content = content.replace('TITLE_PLACEHOLDER', name)
        content = content.replace('NAME_PLACEHOLDER', name)
        content = content.replace('IMAGE_PATH_PLACEHOLDER', f'images/artist_{id_name}.jpg')
        content = content.replace('FURIGANA_PLACEHOLDER', furi)
        content = content.replace('BIO_TEXT_PLACEHOLDER', bio)
        content = content.replace('SNS_ICONS_PLACEHOLDER', sns_icons)
        content = content.replace('ID_PLACEHOLDER', id_name)

        filename = f'artist_{id_name}.html'
        with open(filename, 'w', encoding='utf-8', newline='') as f_out:
            f_out.write(content)
        print(f"Fixed {filename}")

if __name__ == "__main__":
    fix_artist_pages()
