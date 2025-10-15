# Wrangler Configuration Guide

## Configuration File

The project uses `wrangler.jsonc` for Cloudflare Workers configuration.

## Current Configuration

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

### Environment-Specific Configuration

The configuration uses `env` to define different settings for development and production:

- **Development**: Uses Pesapal sandbox (`https://cybqa.pesapal.com/pesapalv3`)
- **Production**: Uses Pesapal live API (`https://pay.pesapal.com/v3`)

This ensures you automatically use the correct API endpoint based on your environment.

## Environment Variables

### Development

Environment variables for development are stored in `.dev.vars` file (not committed to git):

```bash
# .dev.vars (sensitive credentials only)
PESAPAL_CONSUMER_KEY=your_key_here
PESAPAL_CONSUMER_SECRET=your_secret_here
PESAPAL_IPN_ID=your_ipn_id_here
```

**Note**: `PESAPAL_BASE_URL` is configured in `wrangler.jsonc` under `env.development.vars` and automatically uses the sandbox URL.

### Production

For production deployment, set **sensitive** environment variables as secrets using one of these methods:

**Note**: `PESAPAL_BASE_URL` is already configured in `wrangler.jsonc` under `env.production.vars` to use the live API URL.

#### Method 1: Using Wrangler CLI

```bash
# Set production secrets (for sensitive data)
wrangler secret put PESAPAL_CONSUMER_KEY --env production
wrangler secret put PESAPAL_CONSUMER_SECRET --env production
wrangler secret put PESAPAL_IPN_ID --env production
```

Note: PESAPAL_BASE_URL is already in wrangler.jsonc, no need to set as secret.

#### Method 2: Using Cloudflare Dashboard

1. Go to **Workers & Pages**
2. Select your project: `selfdrive4x4uganda`
3. Navigate to **Settings** > **Environment Variables**
4. Select **Production** environment
5. Click **Add variable**
6. Select **Encrypt** for sensitive values
7. Add these secrets:
   - `PESAPAL_CONSUMER_KEY`
   - `PESAPAL_CONSUMER_SECRET`
   - `PESAPAL_IPN_ID`

Note: `PESAPAL_BASE_URL` is already configured in `wrangler.jsonc` for production.

## Configuration Options

### Compatibility Date

```jsonc
"compatibility_date": "2025-10-15"
```

Specifies the version of the Workers runtime to use. Update this periodically to get new features and fixes.

### Compatibility Flags

```jsonc
"compatibility_flags": ["nodejs_compat"]
```

Enables Node.js compatibility mode, which provides Node.js APIs like `process.env`, `Buffer`, etc.

### Main Entry Point

```jsonc
"main": "@tanstack/react-start/server-entry"
```

Points to TanStack Start's server entry point. Don't modify this unless you know what you're doing.

## Additional Options (Optional)

You can extend `wrangler.jsonc` with these options if needed:

### Development Server Port

```jsonc
{
  "dev": {
    "port": 3000
  }
}
```

### Routes (for custom domains)

```jsonc
{
  "routes": [
    { "pattern": "yourdomain.com/*", "zone_name": "yourdomain.com" }
  ]
}
```

### KV Namespaces (for key-value storage)

```jsonc
{
  "kv_namespaces": [
    { "binding": "MY_KV", "id": "your-kv-namespace-id" }
  ]
}
```

### D1 Databases (for SQL database)

```jsonc
{
  "d1_databases": [
    { 
      "binding": "DB", 
      "database_name": "production-db",
      "database_id": "your-database-id" 
    }
  ]
}
```

### R2 Buckets (for file storage)

```jsonc
{
  "r2_buckets": [
    { "binding": "MY_BUCKET", "bucket_name": "production-files" }
  ]
}
```

## Deployment

### Deploy to Development Environment

```bash
pnpm build
wrangler pages deploy dist --env development
```

This will use the sandbox Pesapal API automatically.

### Deploy to Production Environment

```bash
pnpm build
wrangler pages deploy dist --env production
```

This will use the live Pesapal API automatically.

### Using the Deploy Script

```bash
pnpm deploy
```

This typically deploys to production by default.

## Environment Variables Access

In your code, access environment variables using:

```typescript
// Server-side (in server functions)
const apiKey = process.env.PESAPAL_CONSUMER_KEY;

// Client-side (VITE_ prefixed only)
const publicUrl = import.meta.env.VITE_PUBLIC_URL;
```

## Important Notes

1. **Never commit `.dev.vars`** - It contains sensitive credentials
2. **Use secrets for production** - Don't put sensitive values in `wrangler.jsonc`
3. **Restart dev server** after changing `.dev.vars`
4. **Test production build** before deploying: `pnpm build && pnpm preview`

## Troubleshooting

### Environment variables not loading in development

1. Check `.dev.vars` exists in project root
2. Restart dev server: Stop (Ctrl+C) then `pnpm dev`
3. Verify no syntax errors in `.dev.vars`

### SSL certificate errors in development

This is a known limitation of the Cloudflare Workers development runtime. See `SSL_CERTIFICATE_ISSUE.md` for solutions.

### Deployment fails

1. Ensure you're logged in: `wrangler whoami`
2. Login if needed: `wrangler login`
3. Check your Cloudflare account has Workers/Pages enabled
4. Verify project name in `wrangler.jsonc` is unique

## Reference

- [Wrangler Configuration Docs](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Environment Variables Guide](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
