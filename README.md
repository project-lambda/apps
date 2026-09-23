# Apps by Abdullah Emroze

The public website for every app: a page per app, its privacy policy,
support page, optional terms, and the account deletion page Google Play
requires for apps with sign-in. Built with Astro and hosted on GitHub Pages.

## Pages

For an app in `src/content/apps/framely/`:

| URL | Built from |
|---|---|
| `/` | Every app that isn't retired |
| `/framely/` | `app.md`: listing, screenshots, features, long description |
| `/framely/privacy/` | `privacy.md` (required; the build fails without it) |
| `/framely/terms/` | `terms.md`, only if present |
| `/framely/support/` | Contact, FAQ and app details from `app.md` |
| `/framely/delete-account/` | The `accounts` block in `app.md`, only if present |
| `/app-ads.txt` | `appAdsTxt` in `src/site.config.ts` |

Your name, contact email and location live in `src/site.config.ts`.

## Adding an app

Copy `src/content/apps/_template/`, rename the folder (it becomes the URL),
add an icon and screenshots, and fill in `app.md` and `privacy.md`. The
template's README has the details. When the app goes live, change `status`
to `live` in its `app.md` to show the store button.

## Working on it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321, reloads as you edit
npm run check    # catches frontmatter and type mistakes
npm run build    # writes the site to dist/
```

## Publishing

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open Settings, then Pages, and set Source to
   **GitHub Actions**.
3. Every push to `main` now builds and deploys the site. The first address
   is `https://<username>.github.io/<repo>/`.

### Custom domain

The site is served at <https://emroze.dev>. `public/CNAME` holds that domain
and ships with every deploy, which is how a Pages site deployed by Actions
keeps its custom domain. Change the domain in that file and in the
repository's Settings, Pages, Custom domain.

Store listings link to the privacy page, for example
<https://emroze.dev/framely/privacy/>.
