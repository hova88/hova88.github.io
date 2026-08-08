# hova88.github.io

Personal blog. Design language inspired by [Thinking Machines — Connectionism](https://thinkingmachines.ai/blog/).

## Structure

```
├── index.html           # Blog index (empty until posts are added)
├── blog/
│   └── template.html    # Article layout reference (noindex)
├── css/
│   ├── base.css         # Shell, header, footer
│   ├── index.css        # Blog list page
│   ├── post.css         # Article layout, TOC, sidenotes
│   └── typography.css   # Prose styles
└── js/main.js           # Mobile menu, TOC spy, back-to-top
```

## Preview locally

```bash
python3 -m http.server 8080
# http://localhost:8080
# Article template: http://localhost:8080/blog/template.html
```

## Publish a post

1. Copy `blog/template.html` → `blog/your-slug.html`
2. Replace title, metadata, and body content
3. Add a list item to `index.html`:

```html
<li>
  <a class="post-item-link" href="blog/your-slug.html">
    <time class="desktop-time" datetime="2026-08-08">Aug 8, 2026</time>
    <div class="post-info">
      <div class="post-title">Your Title</div>
      <div class="author-date">Yan haixu</div>
      <time class="mobile-time">Aug 8, 2026</time>
    </div>
  </a>
</li>
```

4. Remove `post-group--empty` class and the empty-state paragraph from the index.

## Design notes

| Element | Choice |
|---------|--------|
| Logo | Chakra Petch, letter-spaced (TM-style) |
| Body | Source Serif 4, 17px / 1.6 |
| UI | DM Sans, 15px |
| Column | 660px prose, 950px post shell |
| Color | White bg, `#282828` text, muted grays for meta |
