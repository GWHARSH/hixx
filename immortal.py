from pathlib import Path

replacements = [
    ('YAMATO', 'IMMORTAL'),
    ('Yamato', 'Immortal'),
    ('yamato', 'immortal'),
]

files = [
    'index.html',
    'public/troll.html',
    'src/components/DevToolsBlocker.jsx',
    'src/hooks/useAntiBot.js',
    'src/hooks/useTracking.js',
    'vite.config.js',
    'system_generation_prompt.md',
]

for file in files:
    path = Path(file)
    if not path.exists():
        print(f"Missing: {file}")
        continue
    text = path.read_text(encoding='utf-8')
    for old, new in replacements:
        text = text.replace(old, new)
    path.write_text(text, encoding='utf-8')
    print(f"Updated: {file}")

app_path = Path('src/App.jsx')
if app_path.exists():
    text = app_path.read_text(encoding='utf-8')
    text = text.replace("import DevToolsBlocker from './components/DevToolsBlocker';\n", '')
    text = text.replace("import { useAntiBot } from './hooks/useAntiBot';\n", '')
    text = text.replace('  useTracking();\n  useAntiBot();\n  useGlobalScrollReveal();\n', '  useTracking();\n  useGlobalScrollReveal();\n')
    text = text.replace('          <DevToolsBlocker />\n', '')
    app_path.write_text(text, encoding='utf-8')
    print('Updated: src/App.jsx')
else:
    print('Missing: src/App.jsx')
