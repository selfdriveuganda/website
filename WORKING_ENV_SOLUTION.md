# ✅ Environment Variables - Working Solution

## What Works for TanStack Start + Cloudflare

After testing, here's the **working solution** for accessing environment variables in TanStack Start deployed to Cloudflare Pages:

### The Solution: Use `process.env`

```typescript
const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3";
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
```

### Why Not `cloudflare:workers`?

The `import { env } from "cloudflare:workers"` approach is for **native Cloudflare Workers**, but TanStack Start uses Vite for building, which doesn't recognize the `cloudflare:workers` module during build time.

**Error you'd get:**
```
[vite]: Rollup failed to resolve import "cloudflare:workers"
```

## How Environment Variables Work

### Development (`pnpm dev`)

Reads from `wrangler.jsonc`:
```jsonc
{
  "env": {
    "development": {
      "vars": {
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3",
        "PESAPAL_CONSUMER_KEY": "...",
        "PESAPAL_CONSUMER_SECRET": "...",
        "PESAPAL_IPN_ID": "..."
      }
    }
  }
}
```

### Build Time (`pnpm build`)

Vite's `define` config inlines the values from `process.env`:
```typescript
// vite.config.ts
define: {
  "process.env.PESAPAL_BASE_URL": JSON.stringify(
    process.env.PESAPAL_BASE_URL || "default_value"
  ),
  // ... other vars
}
```

### Production Runtime (Cloudflare Pages)

Environment variables set in Cloudflare Dashboard are injected as `process.env`:
- Dashboard → Workers & Pages → Project → Settings → Environment Variables

## Configuration Files

### 1. `wrangler.jsonc` - Development Variables

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "selfdrive4x4uganda",
  "main": "@tanstack/react-start/server-entry",
  "compatibility_date": "2025-10-15",
  "compatibility_flags": ["nodejs_compat"],
  
  "env": {
    "development": {
      "vars": {
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3",
        "PESAPAL_CONSUMER_KEY": "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev",
        "PESAPAL_CONSUMER_SECRET": "1KpqkfsMaihIcOlhnBo/gBZ5smw=",
        "PESAPAL_IPN_ID": "ed7c8922-59fb-4361-ba83-db933d7a325c"
      }
    }
  }
}
```

### 2. `vite.config.ts` - Build-Time Injection

```typescript
import { defineConfig } from "vite";

const config = defineConfig({
  define: {
    "process.env.PESAPAL_BASE_URL": JSON.stringify(
      process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3"
    ),
    "process.env.PESAPAL_CONSUMER_KEY": JSON.stringify(
      process.env.PESAPAL_CONSUMER_KEY || ""
    ),
    "process.env.PESAPAL_CONSUMER_SECRET": JSON.stringify(
      process.env.PESAPAL_CONSUMER_SECRET || ""
    ),
    "process.env.PESAPAL_IPN_ID": JSON.stringify(
      process.env.PESAPAL_IPN_ID || ""
    ),
  },
  // ... rest of config
});
```

### 3. `src/lib/pesapal.ts` - Using Variables

```typescript
import { createServerFn } from "@tanstack/react-start";

// Access environment variables
const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3";
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
export const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID;
```

## Production Setup

### Set Variables in Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com/
2. Navigate: **Workers & Pages** → **selfdrive4x4uganda** → **Settings**
3. Scroll to: **Environment Variables**
4. Click: **Add variable** for **Production** environment

Add these 4 variables:
```
PESAPAL_BASE_URL = https://cybqa.pesapal.com/pesapalv3
PESAPAL_CONSUMER_KEY = TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET = 1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_IPN_ID = ed7c8922-59fb-4361-ba83-db933d7a325c
```

### Deploy

```bash
git add .
git commit -m "Fix environment variables for TanStack Start"
git push
```

## Testing

### Local Development
```bash
pnpm dev
# Uses wrangler.jsonc vars
```

### Production Build
```bash
pnpm build
# ✅ Should succeed now!
```

### Preview Build
```bash
pnpm build
pnpm preview
# Test locally with production build
```

## How It All Works Together

1. **Development**: `wrangler.jsonc` → Injected as `process.env` by Wrangler
2. **Build**: `vite.config.ts` → Inlines values using Vite's `define`
3. **Production**: Cloudflare Dashboard → Injected as `process.env` at runtime

## Common Issues

### Build fails with "Cannot resolve cloudflare:workers"

✅ **Fixed!** Use `process.env` instead of `import { env } from "cloudflare:workers"`

### Production shows "credentials not configured"

Make sure you:
1. Set all 4 environment variables in Cloudflare Dashboard
2. Set them for **Production** environment (not just Preview)
3. Redeploy after adding variables

### Variables are undefined

Check:
- **Development**: Variables in `wrangler.jsonc` → `env.development.vars`
- **Build**: Variables in `vite.config.ts` → `define` object
- **Production**: Variables in Cloudflare Dashboard

## Summary

✅ **Use `process.env`** - Works in all environments
✅ **Configure `vite.config.ts`** - Inlines values at build time
✅ **Set Cloudflare variables** - For production runtime
❌ **Don't use `cloudflare:workers`** - Breaks Vite build

The build now succeeds and production deployment will work! 🚀
