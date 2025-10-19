# Using import.meta.env in TanStack Start Server Functions

## The Solution
As you correctly pointed out, **`import.meta.env` works inside `createServerFn` handlers**! This is the cleanest way to access environment variables in TanStack Start server functions.

## Implementation

### 1. Type Definitions (`src/vite-env.d.ts`)
```typescript
/// <reference types="vite/client" />

// Extend Vite's ImportMetaEnv with Pesapal environment variables
declare module "vite/client" {
  interface ImportMetaEnv {
    readonly PESAPAL_CONSUMER_KEY: string;
    readonly PESAPAL_CONSUMER_SECRET: string;
    readonly PESAPAL_BASE_URL: string;
    readonly PESAPAL_IPN_ID: string;
  }
}
```

### 2. Server Functions (`src/lib/pesapal.ts`)
```typescript
// ✅ Access env vars inside server function handlers
function getPesapalClient(): Pesapal {
  const consumerKey = import.meta.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = import.meta.env.PESAPAL_CONSUMER_SECRET;
  const apiBaseUrl = import.meta.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3/api";
  
  if (!(consumerKey && consumerSecret)) {
    throw new Error("Pesapal credentials not configured");
  }

  return new Pesapal({ consumerKey, consumerSecret, apiBaseUrl });
}

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<PesapalOrderRequest, "notification_id">) => data)
  .handler(async ({ data }) => {
    // ✅ Access IPN ID from environment at runtime
    const ipnId = import.meta.env.PESAPAL_IPN_ID;
    
    if (!ipnId) {
      throw new Error("PESAPAL_IPN_ID not configured");
    }

    const orderData: PesapalOrderRequest = {
      ...data,
      notification_id: ipnId,
    };
    
    const client = getPesapalClient();
    return await client.submitOrder(orderData);
  });
```

## How It Works

### Development
1. Vite loads `.env` file automatically
2. `import.meta.env.X` accesses these values at runtime
3. No build-time string replacement needed
4. Hot module reloading works perfectly

### Production (Cloudflare Pages)
1. Set environment variables in Cloudflare Dashboard
2. TanStack Start + Cloudflare plugin makes them available via `import.meta.env`
3. Same code works in both environments

## Advantages ✅

1. **Clean Code**: No hardcoded fallbacks needed
2. **Type Safe**: TypeScript knows all env vars
3. **Runtime Access**: Works in server function handlers
4. **HMR Friendly**: Changes to `.env` are picked up
5. **Secure**: Env vars never exposed to client code
6. **Standard**: Uses Vite's standard `import.meta.env` API

## Comparison

### Before (❌ Complex)
```typescript
// Module-level constants (didn't work)
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || "hardcoded-fallback";

// or Vite's define (only works at build time)
define: {
  "process.env.PESAPAL_KEY": JSON.stringify(process.env.PESAPAL_KEY)
}
```

### After (✅ Clean)
```typescript
// Inside server function handler
const consumerKey = import.meta.env.PESAPAL_CONSUMER_KEY;
```

## Configuration Files

### `.env` (Development)
```env
PESAPAL_CONSUMER_KEY=TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET=1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```

### `vite.config.ts`
No special `define` configuration needed! Vite handles `.env` automatically.

```typescript
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    // ... other plugins
  ],
  // No define needed for import.meta.env!
});
```

### Cloudflare Dashboard (Production)
Settings > Environment Variables:
- `PESAPAL_CONSUMER_KEY`: Your production key
- `PESAPAL_CONSUMER_SECRET`: Your production secret
- `PESAPAL_BASE_URL`: `https://pay.pesapal.com/v3/api`
- `PESAPAL_IPN_ID`: Your production IPN ID

## Testing

1. **Restart dev server**: `pnpm dev`
2. **Check TypeScript**: No errors on `import.meta.env.PESAPAL_*`
3. **Test booking flow**: Submit an order
4. **Verify**: IPN ID should be included in the Pesapal request

## Why This Works

### TanStack Start + Vite
- Server functions run in a Vite SSR environment
- Vite's `import.meta.env` is available in SSR context
- Environment variables are loaded at runtime, not build time

### Cloudflare Plugin
- The `@cloudflare/vite-plugin` bridges Vite and Workers
- Makes Cloudflare env vars available via `import.meta.env`
- Seamless transition from dev to production

## Best Practices

1. ✅ **Always use `import.meta.env` in server functions**
2. ✅ **Never use `process.env` directly** (doesn't work reliably)
3. ✅ **Define types in `vite-env.d.ts`** for IntelliSense
4. ✅ **Set production vars in Cloudflare Dashboard**
5. ✅ **Don't commit `.env` to git**

## Related Files
- `src/vite-env.d.ts` - TypeScript definitions for env vars
- `src/lib/pesapal.ts` - Server functions using `import.meta.env`
- `.env` - Local environment variables (gitignored)
- `vite.config.ts` - Vite configuration (no define needed!)

## Credits
Thanks for the insight that `import.meta.env` works in `createServerFn`! This is much cleaner than the previous approach with hardcoded fallbacks. 🎉
