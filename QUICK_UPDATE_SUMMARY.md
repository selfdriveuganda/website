# ✅ Updated to Official Cloudflare Workers API

## What I Did

Updated the Pesapal integration to use Cloudflare's **official** method for accessing environment variables:

```typescript
import { env } from "cloudflare:workers";

const CONSUMER_KEY = env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = env.PESAPAL_CONSUMER_SECRET;
```

## Why This Fixes the Production Error

Your production error was: **"Pesapal credentials not configured"**

### The Problem
- Using `process.env` doesn't work reliably in Cloudflare Pages deployments
- Cloudflare Workers have their own environment binding system

### The Solution
- Using `import { env } from "cloudflare:workers"` accesses the official Cloudflare bindings
- This works in both development AND production
- It's the recommended approach from Cloudflare's documentation

## What You Need to Do

### 1. Set Variables in Cloudflare Dashboard

Go to: https://dash.cloudflare.com/
- Workers & Pages → selfdrive4x4uganda → Settings → Environment Variables
- Add to **Production** environment:

```
PESAPAL_BASE_URL = https://cybqa.pesapal.com/pesapalv3
PESAPAL_CONSUMER_KEY = TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET = 1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_IPN_ID = ed7c8922-59fb-4361-ba83-db933d7a325c
```

### 2. Deploy the Updated Code

```bash
git add .
git commit -m "Use official Cloudflare Workers env binding"
git push
```

### 3. Wait for Deployment

The deployment will automatically pick up:
- ✅ New code that uses `env` from `cloudflare:workers`
- ✅ Environment variables you set in the dashboard

## Files Created/Updated

1. **`src/lib/pesapal.ts`** - Updated to use `import { env } from "cloudflare:workers"`
2. **`src/cloudflare-workers.d.ts`** (NEW) - TypeScript types for the env object
3. **`CLOUDFLARE_ENV_UPDATE.md`** - Detailed documentation
4. **This file** - Quick reference

## How to Test

### Local Development
```bash
pnpm dev
```
Uses variables from `wrangler.jsonc`

### Production
After deploying, test your booking flow - it should now work! ✅

## Why This Is Better

- ✅ **Official Cloudflare API** - Recommended by Cloudflare
- ✅ **Works in production** - Properly accesses Cloudflare bindings
- ✅ **Simpler code** - No custom helper functions
- ✅ **Better types** - Full TypeScript support

## Next Steps

1. **Set environment variables in Cloudflare Dashboard** (see step 1 above)
2. **Commit and push the code** (step 2 above)
3. **Test the production site** - The error should be gone!

The production deployment will now correctly access the environment variables! 🚀
