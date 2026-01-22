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

## 🚀 Deployment Instructions (for George)

To connect this project to your domain and remove any 404 errors, follow these steps:

### 1. Update the Domain in Vercel
1.  Log into your **Vercel Dashboard**.
2.  Open your **robust-ae.com** project.
3.  Go to **Settings** > **Domains**.
4.  If `robust-ae.com` is already there, it likely shows a red **"Invalid Configuration"** or **"DNS Error"**.
5.  Vercel will show you exactly which **A Record** and **CNAME** values it expects. 
    > [!IMPORTANT]
    > **Do not use generic values.** Vercel generates a **unique code** (a long string of random letters and numbers) for the CNAME that is specific to your project. You must copy exactly what is on your screen.

### 2. Update your DNS Records (at your Registrar)
Go to where you bought the domain (e.g., GoDaddy, Namecheap) and update the DNS settings:

| Type | Name | Value |
| :--- | :--- | :--- |
| **A** | `@` | Copy the IP from your Vercel screen |
| **CNAME** | `www` | Copy the **unique** `.vercel-dns.com` string from your Vercel screen |

### 3. Verify and Build
1.  Back in Vercel, click **Refresh** on the Domains page. It should turn green and say **"Valid Configuration"**.
2.  Go to the **Deployments** tab. You should see a "Production" build in progress (triggered by our recent push). 
3.  Once that says **"Ready"**, your site is live at `https://robust-ae.com`.

## Project Configuration
- **Port 3000**: The local development environment defaults to `http://localhost:3000`.
- **Global Layout**: `Navbar` and `Footer` are implemented in `src/app/layout.tsx` and appear on all pages.
- **Clean URLs**: Configured in `vercel.json` to handle paths without extensions.
