import os
import re

print("Starting sync...")
logo_old = 'logo_blue.png'
logo_new = 'logo-mlss.png'

nav_regex = r'(?s)<nav class="bottom-nav">.*?</nav>'
nav_new = r'''    <nav class="bottom-nav">
      <a href="index.html" class="nav-item">
        <img src="images/icon_top.svg" alt="TOP" class="nav-icon">
        <span>TOP</span>
      </a>
      <a href="schedule.html" class="nav-item">
        <img src="images/icon_schedule.svg" alt="SCHEDULE" class="nav-icon">
        <span>SCHEDULE</span>
      </a>
      <a href="live.html" class="nav-item nav-live-highlight">
        <div class="nav-icon-wrapper">
          <img src="images/icon_live.svg" alt="LIVE" class="nav-icon">
        </div>
        <span>LIVE</span>
      </a>
      <a href="artists.html" class="nav-item">
        <img src="images/icon_artist.svg" alt="ARTIST" class="nav-icon">
        <span>ARTIST</span>
      </a>
      <a href="admin_listener.html" class="nav-item">
        <img src="images/icon_mypage.svg" alt="MY PAGE" class="nav-icon">
        <span>MY PAGE</span>
      </a>
    </nav>'''

exclude_footer = ["index.html", "schedule.html", "live.html", "stream.html"]

files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    try:
        # まず Shift-JIS (cp932) で試して、ダメなら UTF-8 で読む (文字化け対策のバックアップ)
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
        except UnicodeDecodeError:
            with open(f, 'r', encoding='cp932') as file:
                content = file.read()

        new_content = content.replace(logo_old, logo_new)
        
        if f not in exclude_footer:
            new_content = re.sub(nav_regex, nav_new, new_content)
        
        if new_content != content:
            with open(f, 'w', encoding='utf-8', newline='') as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"No changes for {f}")
            
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("Sync finished.")
