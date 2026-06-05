This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment variables

Create a `.env.local` file in the project root and add your Flutterwave credentials there.

Example variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
FLW_BASE_URL=https://api.flutterwave.com
FLW_SECRET_KEY=your_flutterwave_secret_key_here
FLW_PUBLIC_KEY=your_flutterwave_public_key_here
FLW_HASH_KEY=your_flutterwave_hash_key_here
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key_here
```

- `FLW_SECRET_KEY` is required by the server-side payment routes.
- `FLW_PUBLIC_KEY` can be used for browser-side SDKs if you add them later.
- `FLW_HASH_KEY` and `FLW_ENCRYPTION_KEY` are additional Flutterwave credentials for advanced integrations.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
