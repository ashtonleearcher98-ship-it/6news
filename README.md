# 6NEWS Greenwick

Ten full-length articles for the Commonwealth of Greenwick, each with a separately generated editorial reconstruction. The site uses an original 6NEWS mark and the editor-supplied Greenwick flag (no third-party news branding).

## Deployment

GitHub Pages: publish from the repository root of the `main` branch (or another existing deployment source). No build tools or external services are required. Open `index.html` for the site; article permalinks use `?story=<slug>` so they work on static hosting.

## Adding an article

Append a new object to `articles-data.js` (and optionally `articles.json`) with `slug`, `title`, `category`, `date`, `deck`, `location`, `image`, `caption`, `author`, `readingMinutes`, and `sections` where each section is `[heading, [paragraphs]]`. Add its corresponding image to `assets/` and the article will appear automatically on the homepage.

## Editorial practice

The news universe is Greenwick. Articles treat user-supplied Greenwick events as established. Do not invent witnesses, quotes, arrests, motives, election results or dates not set by the editor. Generated images are illustrative recreations and are labelled as such.
