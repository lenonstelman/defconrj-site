import type { APIRoute } from 'astro';

const rotas = ['/', '/sobre/', '/encontros/', '/conduta/', '/contato/'];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://defconrj.com.br');
  const urls = rotas
    .map((rota) => `  <url><loc>${new URL(rota, base).href}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
