# All-in-One Wrangler Configuration

## Overview

All environment variables are now configured directly in `wrangler.jsonc`. This simplifies the configuration by having everything in one place.

## Configuration Structure

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
    },
    "production": {
      "vars": {
        "PESAPAL_BASE_URL": "https://pay.pesapal.com/v3",
        "PESAPAL_CONSUMER_KEY": "YOUR_PRODUCTION_CONSUMER_KEY",
        "PESAPAL_CONSUMER_SECRET": "YOUR_PRODUCTION_CONSUMER_SECRET",
        "PESAPAL_IPN_ID": "YOUR_PRODUCTION_IPN_ID"
      }
    }
  }
}
```

## How It Works

### Development Environment

When you run `pnpm dev`, Wrangler automatically uses the `development` environment:

- ✅ Pesapal Sandbox API: `https://cybqa.pesapal.com/pesapalv3`
- ✅ Development credentials (sandbox keys)
- ✅ Test IPN ID

### Production Environment

When you deploy with `wrangler pages deploy dist --env production`, it uses the `production` environment:

- ✅ Pesapal Live API: `https://pay.pesapal.com/v3`
- ✅ Production credentials (live keys)
- ✅ Production IPN ID

## Setting Up Production

Before deploying to production, update the production credentials in `wrangler.jsonc`:

```jsonc
"production": {
  "vars": {
    "PESAPAL_BASE_URL": "https://pay.pesapal.com/v3",
    "PESAPAL_CONSUMER_KEY": "your_actual_production_key",
    "PESAPAL_CONSUMER_SECRET": "your_actual_production_secret",
    "PESAPAL_IPN_ID": "your_actual_production_ipn_id"
  }
}
```

## ⚠️ Important Security Notes

### Should You Commit wrangler.jsonc?

**This depends on your security requirements:**

#### Option 1: Private Repository (Current Setup)

If your repository is **private** (recommended), you can commit `wrangler.jsonc` with credentials:

✅ Convenient - everything in one file
✅ Easy to manage - no separate secrets to configure
✅ Safe - only team members with repo access can see credentials
⚠️ All credentials are in version control

#### Option 2: Public Repository or Extra Security

If your repository is **public** or you want extra security:

❌ **DO NOT commit credentials in wrangler.jsonc**
✅ Use Cloudflare Secrets instead (see below)

### Using Cloudflare Secrets (Alternative Method)

If you prefer to keep credentials out of `wrangler.jsonc`:

1. **Remove credentials from wrangler.jsonc**:
   ```jsonc
   "production": {
     "vars": {
       "PESAPAL_BASE_URL": "https://pay.pesapal.com/v3"
     }
   }
   ```

2. **Set secrets via Cloudflare CLI**:
   ```bash
   wrangler secret put PESAPAL_CONSUMER_KEY --env production
   wrangler secret put PESAPAL_CONSUMER_SECRET --env production
   wrangler secret put PESAPAL_IPN_ID --env production
   ```

3. **Or use Cloudflare Dashboard**:
   - Go to Workers & Pages
   - Select your project
   - Settings → Environment Variables
   - Add variables to Production environment

## Development Workflow

### Start Development Server

```bash
pnpm dev
```

This automatically uses the `development` environment with sandbox credentials.

### Build for Production

```bash
pnpm build
```

### Preview Production Build Locally

```bash
pnpm preview
```

### Deploy to Production

```bash
wrangler pages deploy dist --env production
```

## Benefits of This Approach

✅ **Single source of truth** - All config in one file
✅ **No separate .dev.vars file** - Simpler setup
✅ **Environment-specific** - Different configs for dev/prod
✅ **Version controlled** - Easy to track changes (if repo is private)
✅ **No manual switching** - Automatic environment detection

## Files You Can Delete

Since all config is now in `wrangler.jsonc`, you can safely delete:

- ✅ `.dev.vars` (deprecated - no longer used)
- ✅ `wrangler.toml` (already removed)

## Accessing Variables in Code

Your code in `src/lib/pesapal.ts` already uses the `getEnvVar()` helper:

```typescript
const getEnvVar = (key: string): string => {
  // Check process.env first (for wrangler.jsonc vars)
  const directValue = process.env[key];
  if (directValue) return directValue;

  // Check with VITE_ prefix
  const viteValue = process.env[`VITE_${key}`];
  if (viteValue) return viteValue;

  // Check import.meta.env
  const importMetaValue = import.meta.env[key];
  if (importMetaValue) return importMetaValue;

  throw new Error(`Environment variable ${key} is not defined`);
};
```

This works perfectly with `wrangler.jsonc` vars - they're available via `process.env`.

## Troubleshooting

### Variables Not Loading

1. **Restart the dev server** after changing `wrangler.jsonc`
   ```bash
   # Stop with Ctrl+C
   pnpm dev
   ```

2. **Check you're using the correct environment**
   - Development: `pnpm dev` (uses `env.development`)
   - Production: `wrangler pages deploy dist --env production` (uses `env.production`)

### Wrong API Being Used

Verify the environment in your logs. The `getEnvVar()` function logs which values it finds.

### Still Getting SSL Errors in Development

This is a known limitation of Cloudflare Workers development runtime. See `SSL_CERTIFICATE_ISSUE.md` for workarounds:
- Use production preview: `pnpm build && pnpm preview`
- Deploy to staging
- Use the 4by4-final workspace

## Migration Summary

### What Changed

**Before:**
- Variables in `.dev.vars` (development)
- Variables in Cloudflare Secrets (production)
- Base URL in `wrangler.jsonc`

**After:**
- All variables in `wrangler.jsonc`
- Separate configs for development and production
- No `.dev.vars` needed

### Files Updated

- ✅ `wrangler.jsonc` - Now contains all environment variables
- ✅ `.dev.vars` - Deprecated (can be deleted)
- ✅ No code changes needed - `getEnvVar()` works the same

## Next Steps

1. **Update production credentials** in `wrangler.jsonc` when you have them
2. **Restart dev server** to pick up changes: `pnpm dev`
3. **Test development** - Should connect to sandbox API
4. **Deploy to production** when ready with correct credentials

Your configuration is now simpler and all in one place! 🎉
