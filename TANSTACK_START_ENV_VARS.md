# TanStack Start Environment Variables - Official Pattern

## ✅ The Correct Approach

Based on [TanStack Start official documentation](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables), environment variables are handled as follows:

## Server Functions (Server-Side)

**Access ANY environment variable using `process.env` directly** - no prefix needed!

```typescript
import { createServerFn } from '@tanstack/react-start';

export const submitOrder = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    // ✅ Direct access - TanStack Start loads .env automatically
    const ipnId = process.env.PESAPAL_IPN_ID;
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    
    // These variables are NEVER exposed to the client
    // They stay secure on the server
  });
```

## Client Code (Client-Side)

**Only variables with `VITE_` prefix are accessible** via `import.meta.env`:

```typescript
// Client component
export function AppHeader() {
  // ✅ Works - has VITE_ prefix
  const appName = import.meta.env.VITE_APP_NAME;
  
  // ❌ Undefined - no VITE_ prefix (security feature)
  const secret = import.meta.env.PESAPAL_IPN_ID; // undefined
}
```

## Our Implementation

### `src/lib/pesapal.ts`

```typescript
// ✅ Clean and simple - following TanStack Start pattern
function getPesapalClient(): Pesapal {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const apiBaseUrl = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3/api";

  return new Pesapal({ consumerKey, consumerSecret, apiBaseUrl });
}

export const submitOrder = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    const ipnId = process.env.PESAPAL_IPN_ID;
    
    if (!ipnId) {
      throw new Error("PESAPAL_IPN_ID not configured");
    }

    const orderData = {
      ...data,
      notification_id: ipnId,
    };
    
    const client = getPesapalClient();
    return await client.submitOrder(orderData);
  });
```

### `.env` File

```env
# Server-only variables (no VITE_ prefix)
# These are NEVER exposed to client code
PESAPAL_CONSUMER_KEY=TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET=1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c

# Client-safe variables (VITE_ prefix)
# These CAN be exposed to client code
# VITE_APP_NAME=My App
# VITE_API_URL=https://api.example.com
```

### TypeScript Declarations (`src/vite-env.d.ts`)

```typescript
/// <reference types="vite/client" />

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PESAPAL_CONSUMER_KEY: string;
      readonly PESAPAL_CONSUMER_SECRET: string;
      readonly PESAPAL_BASE_URL: string;
      readonly PESAPAL_IPN_ID: string;
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
```

## How It Works

### 1. Development (`pnpm dev`)
- TanStack Start automatically loads `.env` file
- Makes all variables available via `process.env` in server functions
- Only `VITE_` prefixed variables accessible in client code
- No special configuration needed!

### 2. Production (Cloudflare Pages)
- Set environment variables in Cloudflare Dashboard
- TanStack Start + Cloudflare plugin makes them available
- Same `process.env` access pattern works
- Client code still only sees `VITE_` variables

## Configuration Files

### `vite.config.ts`

The `define` option is optional but can help with static replacement:

```typescript
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
  ],
  // Optional: define for static replacement
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
  },
});
```

## Security Best Practices

### ✅ Do This

```typescript
// Server function - secrets stay on server
const fetchData = createServerFn().handler(async () => {
  const apiKey = process.env.SECRET_API_KEY; // ✅ Server-only
  return await fetch(url, { headers: { Authorization: apiKey } });
});
```

### ❌ Don't Do This

```typescript
// Client code - exposes secret to client bundle!
const config = {
  apiKey: import.meta.env.VITE_SECRET_API_KEY, // ❌ In JS bundle!
};
```

## Key Differences from Previous Approach

| Old Approach | New Approach (TanStack Start) |
|-------------|-------------------------------|
| Helper function `getEnvVar()` | Direct `process.env` access |
| Check multiple sources | Single source of truth |
| Fallback logic | TanStack Start handles loading |
| Complex | Simple |
| Custom pattern | Official pattern |

## Benefits

1. ✅ **Simpler** - Direct `process.env` access
2. ✅ **Official** - Follows TanStack Start docs
3. ✅ **Secure** - Secrets never reach client
4. ✅ **Automatic** - .env loading handled by framework
5. ✅ **Type Safe** - TypeScript declarations included
6. ✅ **Consistent** - Same pattern in dev and production

## Testing

1. **Restart dev server**: `pnpm dev`
2. **Test booking flow**: Environment variables should work automatically
3. **Check TypeScript**: No errors on `process.env.PESAPAL_*`

## Production Deployment

### Cloudflare Pages Dashboard

1. Go to your Pages project
2. Settings > Environment variables
3. Add for **Production**:
   - `PESAPAL_CONSUMER_KEY`: Your production key
   - `PESAPAL_CONSUMER_SECRET`: Your production secret
   - `PESAPAL_BASE_URL`: `https://pay.pesapal.com/v3/api`
   - `PESAPAL_IPN_ID`: Your production IPN ID

## Troubleshooting

### Variable is undefined

✅ **Check**:
- Is `.env` file in project root?
- Did you restart dev server after adding variable?
- Is variable name correct (no typos)?
- For client access, does it have `VITE_` prefix?

### Secret exposed in client bundle

✅ **Fix**:
- Remove `VITE_` prefix from secret variables
- Move secret usage to server functions
- Never use `import.meta.env` for secrets

## References

- [TanStack Start Environment Variables](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)

## Summary

**No helper functions needed!** TanStack Start automatically loads `.env` and makes variables available via `process.env` in server functions. Just use them directly. 🎉
