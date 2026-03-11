# reality

Next.js web for Egyptsko Ceska Reality with public listing pages and admin panel.

## Run locally

```bash
npm install
npm run dev
```

## Vercel deployment

This project now runs with server routes (`/api/*`) and is intended for Vercel (not static export).

### Required environment variables

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING` (recommended)
- `POSTGRES_PRISMA_URL` (optional)
- `NEXT_PUBLIC_ENABLE_ADMIN=1` (enables `/admin` page)

### Uploads on Vercel

To make property image/video uploads persistent in production, set:

- `BLOB_READ_WRITE_TOKEN`

Without Blob token on Vercel, `/api/upload` returns `503` and admin upload is disabled.

### Contact API (optional)

If you want to use `/api/contact` mail sending, also set:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (optional)
- `CONTACT_TO` (optional)

## Admin

- URL: `/admin`
- Login in UI is currently hardcoded in client (`admin` / `1234`) and should be replaced before public launch.
- Admin supports:
  - property CRUD (including sold/active switch)
  - media upload
  - review CRUD

## Notes

- Public site reads properties and reviews from API first, then falls back to static data in `public/data/*`.
- Local fallback storage exists in `content/properties-local.json` and `content/reviews-local.json` when DB is not configured.
