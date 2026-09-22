import type { APIRoute } from 'astro';
import { site } from '../site.config';

// Ad networks read this from the root of the developer website listed in the
// store. Add lines in site.config.ts once an app shows ads.
export const GET: APIRoute = () => {
  const lines = site.appAdsTxt.length
    ? site.appAdsTxt
    : ['# No apps from this developer show ads.'];
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
