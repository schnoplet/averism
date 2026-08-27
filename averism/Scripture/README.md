# Averism Scripture

A digital Bible-style reader for the Averism scripture vault. Automatically adapts to any Obsidian markdown files and folders.

## Features

- **Auto-discovery**: Scans the vault for `.md` files and folders, builds navigation automatically
- **Bible-like reader**: Clean typography, sidebar navigation, keyboard shortcuts
- **Dark/light mode**: Follows system preference
- **Mobile responsive**: Collapsible sidebar with overlay
- **GitHub Pages ready**: Deploys automatically via GitHub Actions
- **Zero config**: Add any `.md` files to the vault, rebuild, and they appear

## Structure

```
Scripture/
├── 00 - Introduction.md
├── 01 - Foundations/
│   ├── 01 - What is Aver.md
│   ├── 02 - Evidence.md
│   └── ...
├── 02 - Reality/
│   ├── 01 - What Is Reality.md
│   └── ...
├── build.js           # Build script
├── package.json
├── docs/              # Generated site (gitignored)
│   ├── index.html
│   └── manifest.json
└── .github/workflows/deploy.yml
```

## Local Development

```bash
cd Scripture
npm install
npm run build
npm run dev
```

Then open http://localhost:3000

## Adding New Content

1. Add `.md` files anywhere in the vault (new folders work too)
2. Use numbered prefixes for ordering: `01 - Title.md`, `02 - Title.md`
3. Run `npm run build` to regenerate `manifest.json`
4. Commit and push — GitHub Actions deploys automatically

## Deployment

1. Push to `main` branch
2. GitHub Actions builds and deploys to GitHub Pages
3. Enable Pages in repo Settings → Pages → Source: "GitHub Actions"

## Keyboard Shortcuts

- `Escape` — Close mobile sidebar
- Click overlay — Close mobile sidebar

## Markdown Support

The renderer supports:
- Headers (`#`, `##`, `###`)
- Bold (`**text**`), Italic (`*text*`)
- Code blocks (```) and inline code (` `)
- Blockquotes (`> `)
- Lists (`- `, `1. `)
- Horizontal rules (`---`)

Frontmatter (YAML at top of file) is parsed but not displayed — use for future metadata.