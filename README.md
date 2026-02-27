Portfolio professionnel (Jonadab AMAH) — Next.js App Router + TypeScript + Tailwind + Prisma + PostgreSQL.

## Fonctionnalités

- Lead magnet: `/audit-securite` (formulaire + DB + email)
- Web design: `/web-design` (simulateur de devis + envoi)
- Blog: `/blog` et `/blog/[slug]` (markdown + SEO)
- Admin blog: `/admin/login` puis `/admin/blog`
- Espace client: `/client/login` puis `/client`

## Pré-requis

- Node.js
- PostgreSQL managé (Vercel Postgres / Neon / Supabase / Railway...) — `DATABASE_URL` doit être une URL TCP type `postgresql://...`
- Variables d’environnement (voir `.env.example`)

## Getting Started

1) Installer les dépendances:

```bash
npm install
```

2) Configurer `.env` à partir de `.env.example`.

3) Appliquer Prisma (si DB disponible):

```bash
npx prisma migrate dev
```

4) Lancer en dev:

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Admin: mot de passe

`ADMIN_PASSWORD_HASH` est un hash bcrypt. Exemple pour le générer:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('VotreMotDePasse',12).then(console.log)"
```

Option simple en développement: définir `ADMIN_PASSWORD` avec un mot de passe en clair.

## Notes Vercel

- Créer une base PostgreSQL managée (Vercel Postgres / Neon / Supabase / Railway, etc.) et récupérer l’URL.
- Définir les variables d’environnement dans Vercel (au minimum):
	- `DATABASE_URL`
	- `NEXT_PUBLIC_SITE_URL`
	- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`
	- `CLIENT_JWT_SECRET`
	- `RESEND_API_KEY`, `RESEND_FROM` (si tu veux que les emails partent)
	- (optionnel) variables Upstash si tu actives le rate limiting
- Les pages qui lisent la DB sont cachées quand possible (ISR/cache), mais restent dynamiques pour les zones authentifiées.

### Build + migrations Prisma sur Vercel

Le projet expose un script `vercel-build` qui:

1) exécute `prisma generate`
2) exécute `prisma migrate deploy` uniquement en production (`VERCEL_ENV=production`)
3) exécute `next build`

Sur Vercel:

- soit Vercel détecte automatiquement `vercel-build`
- soit tu mets explicitement le Build Command à `npm run vercel-build`

Note: en Preview, les migrations sont volontairement ignorées (pour éviter de modifier la DB de prod). Si tu utilises une DB dédiée Preview, il faudra appliquer les migrations séparément.

## Commandes utiles

```bash
npm run prisma:migrate
npm run dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
