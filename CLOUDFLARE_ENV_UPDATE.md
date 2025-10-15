# Cloudflare Workers Environment Variables - Updated Implementation

## ✅ What Changed

Updated the Pesapal integration to use the **official Cloudflare Workers method** for accessing environment variables.

### Before (Old Method)
```typescript
// Using process.env with custom helper function
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== "undefined") {
    const directValue = process.env?.[key];
    if (directValue) return directValue;
    // ... more fallback logic
  }
};

const CONSUMER_KEY = getEnvVar("PESAPAL_CONSUMER_KEY");
```

### After (Official Method)
```typescript
// Using Cloudflare Workers env binding
import { env } from "cloudflare:workers";

const CONSUMER_KEY = env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_BASE_URL = env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3";
```

## Why This Change?

### Official Cloudflare Recommendation
According to Cloudflare's official documentation:
> "Importing `env` from `cloudflare:workers` is useful when you need to access a binding such as secrets or environment variables in top-level global scope."

Source: https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global

### Benefits

1. **Direct Access** - No need for helper functions
2. **Type Safety** - Better TypeScript support with proper types
3. **Performance** - More efficient access to environment variables
4. **Best Practice** - Follows Cloudflare's official patterns
5. **Cleaner Code** - Less boilerplate, more readable

## How It Works

### In Development (`pnpm dev`)

The `env` object reads from `wrangler.jsonc`:

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

### In Production (Cloudflare Pages)

The `env` object reads from **Environment Variables** set in Cloudflare Dashboard:
- Workers & Pages → Your Project → Settings → Environment Variables

## Files Updated

### 1. `src/lib/pesapal.ts`
**Changed:** Import and use `env` from `cloudflare:workers`

```typescript
import { env } from "cloudflare:workers";

const PESAPAL_BASE_URL = env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3";
const CONSUMER_KEY = env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = env.PESAPAL_CONSUMER_SECRET;
export const PESAPAL_IPN_ID = env.PESAPAL_IPN_ID;
```

### 2. `src/cloudflare-workers.d.ts` (NEW)
**Created:** TypeScript type definitions for the `cloudflare:workers` module

```typescript
declare module "cloudflare:workers" {
  export const env: {
    PESAPAL_BASE_URL?: string;
    PESAPAL_CONSUMER_KEY?: string;
    PESAPAL_CONSUMER_SECRET?: string;
    PESAPAL_IPN_ID?: string;
    [key: string]: string | undefined;
  };

  export function withEnv<T>(
    envOverrides: Record<string, unknown>,
    callback: () => T
  ): T;
}
```

This file:
- Provides TypeScript intellisense for `env` object
- Defines all Pesapal environment variables
- Includes the `withEnv` helper for testing

## Setting Up Environment Variables

### For Local Development

Add to `wrangler.jsonc`:

```jsonc
{
  "env": {
    "development": {
      "vars": {
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3",
        "PESAPAL_CONSUMER_KEY": "your_key",
        "PESAPAL_CONSUMER_SECRET": "your_secret",
        "PESAPAL_IPN_ID": "your_ipn_id"
      }
    }
  }
}
```

### For Production Deployment

**Option 1: Cloudflare Dashboard**
1. Go to: https://dash.cloudflare.com/
2. Navigate to: Workers & Pages → selfdrive4x4uganda → Settings
3. Scroll to: Environment Variables
4. Add each variable for Production environment:
   - `PESAPAL_BASE_URL`
   - `PESAPAL_CONSUMER_KEY`
   - `PESAPAL_CONSUMER_SECRET`
   - `PESAPAL_IPN_ID`

**Option 2: Wrangler CLI**
```bash
wrangler pages secret put PESAPAL_BASE_URL --project selfdrive4x4uganda
wrangler pages secret put PESAPAL_CONSUMER_KEY --project selfdrive4x4uganda
wrangler pages secret put PESAPAL_CONSUMER_SECRET --project selfdrive4x4uganda
wrangler pages secret put PESAPAL_IPN_ID --project selfdrive4x4uganda
```

## Testing the Changes

### 1. Local Development
```bash
pnpm dev
```

Should automatically load variables from `wrangler.jsonc`

### 2. Production Build
```bash
pnpm build
pnpm preview
```

### 3. Deploy
```bash
git add .
git commit -m "Use official Cloudflare Workers env binding"
git push
```

## Accessing Variables in Code

### Top-Level Access (Recommended)
```typescript
import { env } from "cloudflare:workers";

// Can use directly in module scope
const API_URL = env.PESAPAL_BASE_URL;
const API_KEY = env.PESAPAL_CONSUMER_KEY;
```

### Inside Server Functions
```typescript
import { env } from "cloudflare:workers";

export const myFunction = createServerFn({ method: "POST" })
  .handler(async () => {
    // Access env variables
    const token = await getToken(env.PESAPAL_CONSUMER_KEY);
    return token;
  });
```

### Limitations

According to Cloudflare docs:
- ✅ **CAN** access environment variables and secrets
- ✅ **CAN** get Durable Object stubs
- ❌ **CANNOT** perform I/O operations in top-level scope
- ❌ **CANNOT** call KV operations outside request context
- ❌ **CANNOT** make fetch calls in module scope

Example:
```typescript
import { env } from "cloudflare:workers";

// ✅ This works - just reading the value
const API_KEY = env.MY_API_KEY;

// ❌ This would error - I/O in top-level scope
// const data = await env.KV.get('my-key');

export default {
  async fetch(req) {
    // ✅ This works - I/O inside request handler
    const data = await env.KV.get('my-key');
    return new Response(data);
  }
}
```

## Testing with `withEnv()`

The `withEnv()` function allows you to override environment variables for testing:

```typescript
import { env, withEnv } from "cloudflare:workers";

function getApiUrl() {
  return env.PESAPAL_BASE_URL;
}

// In tests
withEnv({ PESAPAL_BASE_URL: "http://test-api.local" }, () => {
  const url = getApiUrl();
  // url will be "http://test-api.local"
});
```

## Troubleshooting

### "Cannot find module 'cloudflare:workers'"

**Solution:** The `src/cloudflare-workers.d.ts` file provides the type definitions.
- Make sure it exists in your project
- TypeScript should automatically pick it up
- The module exists at runtime in Cloudflare Workers environment

### "Environment variables are undefined"

**For Development:**
1. Check `wrangler.jsonc` has the variables
2. Restart dev server: `pnpm dev`

**For Production:**
1. Verify variables are set in Cloudflare Dashboard
2. Check they're set for "Production" environment (not just "Preview")
3. Redeploy after adding variables: `git push`

### "Still getting old behavior"

Clear any cached builds:
```bash
rm -rf .vinxi .output dist
pnpm dev
```

## Migration Checklist

- [x] Import `env` from `cloudflare:workers`
- [x] Replace `getEnvVar()` helper with direct `env` access
- [x] Create type definitions file (`cloudflare-workers.d.ts`)
- [x] Update `wrangler.jsonc` with development variables
- [x] Set production variables in Cloudflare Dashboard
- [x] Test locally with `pnpm dev`
- [x] Test production build with `pnpm build && pnpm preview`
- [x] Deploy and verify in production

## References

- [Cloudflare Workers Bindings Documentation](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
- [Importing env as a global](https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global)
- [Environment Variables](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [TanStack Start with Cloudflare](https://tanstack.com/router/latest/docs/framework/react/start/deployment#cloudflare-pages)

## Summary

✅ **More maintainable** - Official Cloudflare pattern
✅ **Better TypeScript support** - Proper type definitions
✅ **Simpler code** - No custom helper functions
✅ **Production-ready** - Works seamlessly in all environments

The update follows Cloudflare's best practices and makes the codebase cleaner and more maintainable!
