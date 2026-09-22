import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Each app is one folder in src/content/apps:
 *
 *   framely/
 *     app.md        store info (frontmatter) and the long description (body)
 *     privacy.md    privacy policy, required
 *     terms.md      terms of use, optional
 *     icon.png      512px icon
 *     screenshots/  phone screenshots, listed in app.md
 *
 * Folders starting with _ are ignored, so _template can live alongside.
 */
const base = './src/content/apps';
const byFolder = ({ entry }: { entry: string }) => entry.split('/')[0];

const apps = defineCollection({
  loader: glob({ pattern: '[!_]*/app.md', base, generateId: byFolder }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** A few words, shown under the name. */
      tagline: z.string(),
      /** One or two sentences for cards and search results. */
      summary: z.string().max(170),
      /** 512px icon. Omit it and the site shows a lettered tile instead. */
      icon: image().optional(),
      screenshots: z.array(image()).default([]),
      /** Brand colour for this app's pages. */
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#1FC98A'),
      category: z.string(),
      /** coming-soon hides the store buttons; retired keeps the policy up. */
      status: z.enum(['live', 'coming-soon', 'retired']).default('live'),
      /** Lower comes first on the home page. */
      order: z.number().default(100),
      stores: z
        .object({
          googlePlay: z.url().optional(),
          appStore: z.url().optional(),
          web: z.url().optional(),
        })
        .default({}),
      /** Android application ID, shown on the support page. */
      packageName: z.string().optional(),
      features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      /** Overrides site.email for this app. */
      supportEmail: z.email().optional(),
      /**
       * Only for apps with sign-in. Google Play requires a public page that
       * explains how to delete an account; this generates it.
       */
      accounts: z
        .object({
          steps: z.array(z.string()).min(1),
          deleted: z.array(z.string()).min(1),
          retained: z.array(z.string()).default([]),
          retention: z.string().optional(),
        })
        .optional(),
    }),
});

const policy = z.object({
  effectiveDate: z.coerce.date(),
  updated: z.coerce.date().optional(),
});

const policies = defineCollection({
  loader: glob({ pattern: '[!_]*/privacy.md', base, generateId: byFolder }),
  schema: policy,
});

const terms = defineCollection({
  loader: glob({ pattern: '[!_]*/terms.md', base, generateId: byFolder }),
  schema: policy,
});

export const collections = { apps, policies, terms };
