# Environment-Based Configuration Summary

## What Changed

I've updated `wrangler.jsonc` to use environment-based configuration following Cloudflare Workers best practices.

## New Configuration Structure

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
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3"
      }
    },
    "production": {
      "vars": {
        "PESAPAL_BASE_URL": "https://pay.pesapal.com/v3"
      }
    }
  }
}
```

## Benefits

### 1. Automatic Environment Switching

- **Development**: Automatically uses Pesapal sandbox API
- **Production**: Automatically uses Pesapal live API
- No need to manually change URLs

### 2. Separation of Concerns

- **Non-sensitive config** (like URLs): In `wrangler.jsonc` - committed to git
- **Sensitive credentials**: In `.dev.vars` (dev) or Secrets (prod) - NOT committed

### 3. Safe Configuration

- Base URL changes automatically based on environment
- No risk of accidentally testing against production API
- No risk of using sandbox in production

## How It Works

### Development (`pnpm dev`)

Reads from:
1. `wrangler.jsonc` → `env.development.vars` → `PESAPAL_BASE_URL` (sandbox)
2. `.dev.vars` → Sensitive credentials (consumer key, secret, IPN ID)

### Production Deployment

Reads from:
1. `wrangler.jsonc` → `env.production.vars` → `PESAPAL_BASE_URL` (live)
2. Cloudflare Secrets → Sensitive credentials

## File Structure

```
project/
├── wrangler.jsonc          # Environment-based config (committed)
│   └── env.development.vars = sandbox URL
│   └── env.production.vars = live URL
│
├── .dev.vars              # Dev secrets only (NOT committed)
│   ├── PESAPAL_CONSUMER_KEY
│   ├── PESAPAL_CONSUMER_SECRET
│   └── PESAPAL_IPN_ID
│
└── Cloudflare Dashboard   # Production secrets (encrypted)
    ├── PESAPAL_CONSUMER_KEY
    ├── PESAPAL_CONSUMER_SECRET
    └── PESAPAL_IPN_ID
```

## Next Steps

### 1. Restart Development Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

Your app will now automatically use the sandbox API in development.

### 2. Set Production Secrets

When ready to deploy to production, set your secrets:

```bash
wrangler secret put PESAPAL_CONSUMER_KEY --env production
wrangler secret put PESAPAL_CONSUMER_SECRET --env production
wrangler secret put PESAPAL_IPN_ID --env production
```

Or use the Cloudflare Dashboard → Workers & Pages → Your Project → Settings → Environment Variables → Production

### 3. Deploy to Production

```bash
pnpm build
wrangler pages deploy dist --env production
```

The app will automatically use the live Pesapal API.

## Important Notes

### What's in wrangler.jsonc (Safe to Commit)

✅ Public URLs (sandbox vs live)
✅ Feature flags
✅ Non-sensitive configuration
✅ KV/D1/R2 bindings (without sensitive data)

### What's NOT in wrangler.jsonc (Use Secrets)

❌ API keys (PESAPAL_CONSUMER_KEY)
❌ API secrets (PESAPAL_CONSUMER_SECRET)
❌ IPN IDs (can be sensitive)
❌ Database passwords
❌ Any private credentials

## Testing

### Test Development Environment

```bash
pnpm dev
# Should connect to: https://cybqa.pesapal.com/pesapalv3
```

### Test Production Environment Locally

```bash
pnpm build
wrangler pages dev dist --env production
# Should connect to: https://pay.pesapal.com/v3
```

## Troubleshooting

### Wrong API URL being used

Check which environment you're in:
- Development: Uses `env.development.vars`
- Production: Uses `env.production.vars`

### Secrets not loading

Development:
- Check `.dev.vars` exists and has correct format
- Restart dev server

Production:
- Verify secrets are set via `wrangler secret list --env production`
- Check Cloudflare Dashboard → Environment Variables

### SSL Certificate Error (Development Only)

This is still a limitation of the Cloudflare Workers development runtime. The environment configuration doesn't fix this. See `SSL_CERTIFICATE_ISSUE.md`.

Solutions:
1. Use production preview: `pnpm build && pnpm preview`
2. Deploy to staging environment
3. Use the 4by4-final workspace for local testing

## Summary

✅ **Automatic API switching** - Sandbox in dev, Live in prod
✅ **Secure credentials** - Never in version control
✅ **Easy deployment** - One command per environment
✅ **No manual configuration** - Environment handles it all

Your configuration is now production-ready and follows Cloudflare Workers best practices!
