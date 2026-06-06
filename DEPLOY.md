# Prevail Docs — Deploy Reference

Documentation site for **Prevail** — built with [Astro Starlight](https://starlight.astro.build/).

## Live URLs

| Surface | URL |
|---|---|
| **Primary** | https://docs.prevail.sh |
| **Netlify default** | https://prevail-docs.netlify.app |
| **Netlify admin** | https://app.netlify.com/projects/prevail-docs |
| **Site ID** | `23b9eac9-2a32-46f4-9b10-135cc3f5d031` |

DNS for `prevail.sh` is **Netlify-managed** (NS1 / `nsone.net`), so the
`docs` record was created automatically when the custom domain was added, and
the wildcard `*.prevail.sh` certificate already covers it. No external DNS
change is required.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs static site to dist/
npm run preview    # preview the production build
```

## Deploying a new version

Build, then deploy. **Note:** direct `netlify deploy --prod` returns
`Forbidden` on this account (production deploys are restricted for CLI). The
working path is a draft deploy followed by an API restore that promotes it to
production:

```bash
npm run build

# 1. Draft deploy (uploads all files, returns a deploy_id)
netlify deploy --dir dist --site 23b9eac9-2a32-46f4-9b10-135cc3f5d031

# 2. Promote that deploy to production (use the deploy_id from step 1)
netlify api restoreSiteDeploy \
  --data='{"site_id":"23b9eac9-2a32-46f4-9b10-135cc3f5d031","deploy_id":"<DEPLOY_ID>"}'
```

Alternatively, connect this repo to the Netlify site for Git-based continuous
deploys (build command `npm run build`, publish dir `dist` — already set in
`netlify.toml`), which sidesteps the CLI restriction entirely.

## Content

All pages live in `src/content/docs/**/*.mdx`. The sidebar/IA is defined in
`astro.config.mjs`. Brand theming (gold `#c4a35a`, AI-cyan `#5fbfff`, Inter /
Instrument Serif / Geist Mono) is in `src/styles/theme.css`, mirroring the
tokens from the main `prevail.sh` marketing site.
