# hova88 — Personal Notes

A minimal static blog inspired by [Thinking Machines Lab](https://thinkingmachines.ai/blog/).

## Structure

```
hova88-blog/
├── index.html          # Blog index (post list)
├── css/style.css       # Shared styles
└── blog/
    └── *.html          # Individual posts
```

## Local preview

```bash
cd hova88-blog
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a repo named `hova88.github.io` (or enable Pages on any repo).
2. Push this folder's contents to the repo root.
3. In repo Settings → Pages, set source to `main` branch, `/ (root)`.
4. Site will be live at `https://hova88.github.io`.

## Adding a post

1. Copy `blog/lora-notes.html` as a template.
2. Update title, date, and prose content.
3. Add an entry to the list in `index.html`.

## Design notes

- **Typography**: Newsreader (serif body) + Inter (UI/meta) — restrained, readable.
- **Layout**: Narrow measure (~42rem) for articles; wider index for post list.
- **Math**: KaTeX via CDN on article pages that need it.
- **Theme**: Light by default; respects `prefers-color-scheme: dark`.
