# Adding an app

1. Copy this folder and rename it. The folder name becomes the URL:
   `src/content/apps/my-app/` is served at `/my-app/`. Use lowercase and
   dashes, and don't start it with `_`.
2. Add a 512px `icon.png` and any screenshots.
3. Fill in `app.md` and `privacy.md`. Add `terms.md` if the app needs terms.
4. Run `npm run dev` and check the pages.

The build fails if an app has no `privacy.md`, because both stores reject a
listing without one. `npm run check` catches frontmatter typos.
