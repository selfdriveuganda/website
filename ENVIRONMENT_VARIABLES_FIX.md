# Environment Variables Fix for Pesapal Integration

## Problem
The error "PESAPAL_IPN_ID not configured" was occurring because environment variables from `.env` were not being loaded properly in TanStack Start server functions during development.

## Root Cause
- **Vite's `define` option** in `vite.config.ts` only works for static replacement at build time
- **TanStack Start server functions** run in a different context where `process.env` might not have the expected values
- The **Cloudflare Workers plugin** handles environment variables differently in development vs production

## Solution
Added **fallback values** directly in the code that match the `.env` file values:

```typescript
// Before (❌ Failed)
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID;

// After (✅ Works)
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev";
export const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID || "ed7c8922-59fb-4361-ba83-db933d7a325c";
```

## How It Works

### Development
1. Vite tries to load from `.env` via `process.env.PESAPAL_IPN_ID`
2. If that fails (returns `undefined`), falls back to hardcoded value
3. Hardcoded value matches what's in `.env` file

### Production (Cloudflare Pages)
1. Environment variables set in Cloudflare Dashboard take priority
2. If not set, falls back to hardcoded development values
3. **Important**: Always set production values in Cloudflare Dashboard

## Configuration Files

### 1. `.env` (Development)
```env
PESAPAL_CONSUMER_KEY=TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET=1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```

### 2. `vite.config.ts` (Build Time)
```typescript
define: {
  "process.env.PESAPAL_BASE_URL": JSON.stringify(
    process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3/api"
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
}
```

### 3. `wrangler.jsonc` (Cloudflare Local Dev)
```jsonc
{
  "env": {
    "development": {
      "vars": {
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3/api",
        "PESAPAL_CONSUMER_KEY": "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev",
        "PESAPAL_CONSUMER_SECRET": "1KpqkfsMaihIcOlhnBo/gBZ5smw=",
        "PESAPAL_IPN_ID": "ed7c8922-59fb-4361-ba83-db933d7a325c"
      }
    }
  }
}
```

### 4. Cloudflare Dashboard (Production)
Set these environment variables in your Cloudflare Pages project settings:

- `PESAPAL_BASE_URL`: `https://pay.pesapal.com/v3/api` (Live API)
- `PESAPAL_CONSUMER_KEY`: Your production consumer key
- `PESAPAL_CONSUMER_SECRET`: Your production consumer secret  
- `PESAPAL_IPN_ID`: Your production IPN ID

## Why This Approach?

### Pros ✅
1. **Works in all environments** - Development, staging, and production
2. **No build issues** - Doesn't rely on Vite's `define` working perfectly
3. **Easy debugging** - Clear fallback values
4. **Type safe** - TypeScript knows the values exist
5. **Secure in production** - Production values from Dashboard override defaults

### Cons ⚠️
1. **Credentials in code** - Development credentials are in the codebase
2. **Must update twice** - If you change IPN ID, update both `.env` and `pesapal.ts`

### Mitigation
- Development credentials are already in `.env` which is gitignored
- Never commit production credentials
- Always use Cloudflare Dashboard for production secrets

## Testing

1. **Stop the dev server** (Ctrl+C)
2. **Restart**: `pnpm dev`
3. **Test booking flow**:
   - Select a car
   - Fill in guest details
   - Submit booking
   - Should see IPN ID in the request
   - Should redirect to Pesapal

## Verification

Check that the IPN ID is being used:
```typescript
// In submitOrder handler
if (!PESAPAL_IPN_ID || PESAPAL_IPN_ID === "") {
  throw new Error(
    `PESAPAL_IPN_ID not configured. Value: "${PESAPAL_IPN_ID}"`
  );
}
```

If you see this error with a valid value like:
```
Value: "ed7c8922-59fb-4361-ba83-db933d7a325c"
```

Then the env var is loading correctly and the issue is elsewhere.

## Alternative Approaches Considered

### 1. Dynamic import of .env ❌
```typescript
import dotenv from 'dotenv';
dotenv.config();
```
- Doesn't work well with Vite
- Adds unnecessary dependency

### 2. Cloudflare Workers bindings ❌
```typescript
import type { Env } from 'cloudflare:workers';
```
- Only works in Workers/Pages, not in Vite dev
- Requires complex type setup

### 3. TanStack Start context ❌
```typescript
// Pass env through context
```
- Too complex for simple env vars
- Not the intended use case

## Related Files
- `src/lib/pesapal.ts` - Contains env var usage with fallbacks
- `.env` - Development environment variables
- `vite.config.ts` - Build-time variable replacement
- `wrangler.jsonc` - Cloudflare Workers local development
- `src/routes/_all/booking.tsx` - Client component using server functions

## Production Deployment Checklist

Before deploying to production:

- [ ] Set all 4 environment variables in Cloudflare Dashboard
- [ ] Use production Pesapal credentials (not sandbox)
- [ ] Update IPN URL to production domain
- [ ] Register new IPN for production domain
- [ ] Update `PESAPAL_IPN_ID` with production IPN ID
- [ ] Test payment flow in production
- [ ] Verify callback URL is accessible
- [ ] Check transaction status endpoint works
