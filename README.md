# DEF CON Rio de Janeiro — DCG5521

Site institucional desenvolvido com Astro e publicado no GitHub Pages.

## Desenvolvimento local

Requisitos: Node.js 22.19.0 ou superior.

```bash
npm ci
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

O build estático é gerado em `dist/`.

## Dados oficiais

Edite `src/data/site.json` para atualizar:
- dados do próximo encontro;
- data ISO (`data_iso`), somente quando o dia estiver confirmado;
- links oficiais de Discord, Telegram, Instagram, LinkedIn, GitHub e e-mail.

Links vazios são omitidos da interface.

## Publicação

O workflow `.github/workflows/deploy.yml` publica automaticamente no GitHub Pages a cada push na branch `main`.

No GitHub, configure **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Domínio personalizado: `defconrj.com.br`. O arquivo `public/CNAME` é copiado para o build. Mantenha os registros DNS atuais do GitHub Pages na Hostinger e confirme o domínio em **Settings → Pages**.
