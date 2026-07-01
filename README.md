# INet Lab — Intelligent Computer Networks Research Group

Official website for the Intelligent Computer Networks Research Group (INet Lab), built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Structure

```
/
├── index.html          Home
├── about.html          Mission, vision, research areas
├── members.html        Team (leadership, researchers, candidates, alumni)
├── projects.html        Research tracks / projects
├── publications.html   Searchable publication list
├── news.html           Lab announcements timeline
├── contact.html        Contact form + info
├── assets/
│   ├── images/         Logo, team photos
│   └── icons/
├── css/
│   ├── style.css        Design tokens, layout, components
│   ├── animations.css   Keyframes, micro-interactions
│   └── responsive.css   Breakpoints
└── js/
    ├── components/layout.js   Shared header/footer + nav behavior
    ├── animations.js          Network canvas, scroll reveal, counters
    └── main.js                Loading screen, smooth-scroll glue
```

## Running locally

No build step needed. Either:

- Open `index.html` directly in a browser, or
- Serve it locally, e.g. `python3 -m http.server 8000` from this folder, then visit `http://localhost:8000`

## Updating content

- **Publications**: edit the `PUBLICATIONS` array at the bottom of `publications.html`.
- **Members**: edit the member cards in `members.html`.
- **Projects**: edit `projects.html`.
- **News**: add a new `.news-item` block at the top of the timeline in `news.html`.

## Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — the site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## Credits

Content sourced from the group's WordPress site and internal research proposals. Logo courtesy of INet Lab.
