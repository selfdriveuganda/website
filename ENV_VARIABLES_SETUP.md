# Cloudflare Workers Environment Variables Setup

## The Problem

Cloudflare Workers in development mode (using `workerd` runtime) don't automatically read from `.env` files like traditional Node.js applications. This causes environment variables to be `undefined` when running `pnpm dev`.

## The Solution

Use `.dev.vars` file for Cloudflare Workers development environment variables.

## Setup Instructions

### 1. Create `.dev.vars` File

I've created a `.dev.vars` file in the project root with your Pesapal credentials:

```bash
# .dev.vars (Cloudflare Workers development environment)
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3
PESAPAL_CONSUMER_KEY=TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET=1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```

This file includes both versions (with and without `VITE_` prefix) to work in all contexts.

### 2. Restart Development Server

**Important**: You must restart the dev server for it to pick up the new `.dev.vars` file:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
pnpm dev
```

### 3. Verify Environment Variables

The code now tries to load environment variables from multiple sources:
1. Direct keys (e.g., `PESAPAL_CONSUMER_KEY`) - from `.dev.vars`
2. VITE-prefixed keys (e.g., `VITE_PESAPAL_CONSUMER_KEY`) - from `.env`
3. Client-side keys (from `import.meta.env`)

## File Structure

```
project-root/
├── .env                  # Vite environment variables (client-side)
├── .dev.vars            # Cloudflare Workers dev variables (server-side) ✨ NEW
├── wrangler.jsonc       # Cloudflare Workers configuration ✨ UPDATED
└── .gitignore           # Updated to exclude .dev.vars
```

## Important Notes

### Security

- ✅ `.dev.vars` is added to `.gitignore` - won't be committed
- ✅ `.env` was already in `.gitignore`
- ⚠️ Never commit sensitive credentials to git

### Production Deployment

For production, use Cloudflare secrets instead of `.dev.vars`:

```bash
# Set production secrets
wrangler secret put PESAPAL_CONSUMER_KEY
wrangler secret put PESAPAL_CONSUMER_SECRET
wrangler secret put PESAPAL_IPN_ID
wrangler secret put PESAPAL_BASE_URL
```

Or use the Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your project
3. Go to Settings > Environment Variables
4. Add the variables

## Environment Variable Priority

The `getEnvVar()` helper function checks in this order:

1. **Server-side** (in server functions):
   - `process.env.PESAPAL_CONSUMER_KEY` (from `.dev.vars`)
   - `process.env.VITE_PESAPAL_CONSUMER_KEY` (from `.env`)

2. **Client-side**:
   - `import.meta.env.VITE_PESAPAL_CONSUMER_KEY` (from `.env`)

## Still Have SSL Issues?

Even with correct environment variables, you may still see SSL certificate errors in development. This is a separate issue with the Cloudflare Workers runtime. See `SSL_CERTIFICATE_ISSUE.md` for solutions.

## Testing

After restarting the dev server, you should see in the console:

```
Requesting Pesapal token from: https://cybqa.pesapal.com/pesapalv3
Consumer Key length: 32
Consumer Key (first 10 chars): TDpigBOOhs
```

If you see:
- `Consumer Key length: undefined` - Environment variables not loading
- SSL certificate error - See SSL_CERTIFICATE_ISSUE.md
- `internal error` from Pesapal - Check credentials are correct

## Quick Checklist

- [ ] `.dev.vars` file created with all Pesapal variables
- [ ] `.dev.vars` added to `.gitignore` (already done)
- [ ] Dev server restarted (`pnpm dev`)
- [ ] Console shows correct key length (32 characters)
- [ ] If SSL errors persist, use production build or deploy

## Need Help?

If environment variables still aren't loading:

1. Verify `.dev.vars` file exists in project root
2. Check file has no syntax errors
3. Restart dev server completely
4. Check console logs for "Consumer Key length: 32"
5. Try production preview: `pnpm build && pnpm preview`
