# Environment Variables in TanStack Start Server Functions - Final Solution

## The Challenge
Environment variables from `.env` files were showing as `"undefined"` in TanStack Start server functions because:
1. `import.meta.env` only exposes variables prefixed with `VITE_`
2. `process.env` access in server functions isn't straightforward with Vite
3. Vite's `define` option only does static replacement at build time

## The Solution
Created a **`getEnvVar()` helper function** that checks multiple sources in order:

```typescript
function getEnvVar(key: string, defaultValue = ""): string {
  // 1. Check process.env (works with Vite's define and .env loading)
  const value = process?.env?.[key];
  if (value && value !== "undefined" && value !== "") {
    return value;
  }
  
  // 2. Try import.meta.env as fallback
  try {
    const metaValue = import.meta.env[key];
    if (metaValue && metaValue !== "undefined" && metaValue !== "") {
      return metaValue;
    }
  } catch {
    // import.meta might not be available in some contexts
  }
  
  // 3. Return default value
  return defaultValue;
}
```

## Implementation

### 1. Updated `getPesapalClient()`
```typescript
function getPesapalClient(): Pesapal {
  const consumerKey = getEnvVar("PESAPAL_CONSUMER_KEY");
  const consumerSecret = getEnvVar("PESAPAL_CONSUMER_SECRET");
  const apiBaseUrl = getEnvVar("PESAPAL_BASE_URL", "https://cybqa.pesapal.com/pesapalv3/api");

  if (!(consumerKey && consumerSecret)) {
    throw new Error(
      `Pesapal credentials not configured. Keys: ${consumerKey ? "✓" : "✗"}, Secret: ${consumerSecret ? "✓" : "✗"}`
    );
  }

  return new Pesapal({ consumerKey, consumerSecret, apiBaseUrl });
}
```

### 2. Updated `submitOrder()` Handler
```typescript
export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<PesapalOrderRequest, "notification_id">) => data)
  .handler(async ({ data }) => {
    // Get IPN ID using the helper function
    const ipnId = getEnvVar("PESAPAL_IPN_ID");

    if (!ipnId || ipnId === "" || ipnId === "undefined") {
      throw new Error(
        `PESAPAL_IPN_ID not configured. Value: "${ipnId}". ` +
        "Check .env file has: PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c"
      );
    }

    const orderData: PesapalOrderRequest = {
      ...data,
      notification_id: ipnId,
    };
    
    const client = getPesapalClient();
    return await client.submitOrder(orderData);
  });
```

## Why This Works

### Development with Vite Dev Server
1. Vite reads `.env` file automatically
2. `process.env` is populated with values from `.env`
3. Vite's `define` option in `vite.config.ts` replaces `process.env.X` references
4. `getEnvVar()` accesses these replaced values

### Production with Cloudflare Pages
1. Environment variables set in Cloudflare Dashboard
2. Made available via Cloudflare Workers runtime
3. Accessible through `process.env` in server context
4. `getEnvVar()` retrieves them the same way

## Configuration Files

### `.env` (Development)
```env
PESAPAL_CONSUMER_KEY=TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET=1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```

### `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    // ... other plugins
  ],
  define: {
    // These enable static replacement of process.env.X in code
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

### `wrangler.jsonc` (Optional - for wrangler dev)
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

## Error Messages

The improved error messages help with debugging:

### Credentials Error
```
Pesapal credentials not configured. Keys: ✓, Secret: ✗
```
Shows which credential is missing.

### IPN ID Error
```
PESAPAL_IPN_ID not configured. Value: "undefined". 
Check .env file has: PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```
Shows the actual value received and what's expected.

## Troubleshooting

### If you see `"undefined"` string
- ❌ Variable is being set to the string `"undefined"` literally
- ✓ Check `.env` file exists and has correct values
- ✓ Restart dev server: `pnpm dev`
- ✓ Make sure no quotes around values in `.env`

### If you see empty string `""`
- ❌ Variable is defined but has no value
- ✓ Check `.env` file has value after `=`
- ✓ No trailing spaces or comments on same line

### If you see `null` or actual `undefined`
- ❌ Variable not defined anywhere
- ✓ Add to `.env` file
- ✓ Add to `vite.config.ts` define option
- ✓ Set in Cloudflare Dashboard for production

## Testing

### 1. Verify `.env` is loaded
```bash
# Add this temporarily to getPesapalClient:
const allEnv = Object.keys(process?.env || {}).filter(k => k.startsWith('PESAPAL'));
console.log('Available PESAPAL env vars:', allEnv);
```

### 2. Test booking flow
1. Start dev server: `pnpm dev`
2. Select a car
3. Fill in guest details
4. Click "Book Now"
5. Should redirect to Pesapal payment page

### 3. Check error messages
If it fails, the error will show exactly which value is missing or incorrect.

## Production Deployment

### Cloudflare Pages Dashboard
Set these environment variables:

**Production Environment:**
- `PESAPAL_BASE_URL`: `https://pay.pesapal.com/v3/api`
- `PESAPAL_CONSUMER_KEY`: Your production consumer key
- `PESAPAL_CONSUMER_SECRET`: Your production consumer secret
- `PESAPAL_IPN_ID`: Your production IPN ID

**How to set:**
1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Settings > Environment variables
4. Add variables for "Production" environment
5. Redeploy your application

## Key Takeaways

1. ✅ **Use `getEnvVar()` helper** - Checks multiple sources
2. ✅ **Keep `define` in vite.config.ts** - Enables static replacement  
3. ✅ **Use `.env` for development** - Gitignored, safe for dev values
4. ✅ **Use Cloudflare Dashboard for production** - Secure, separate from code
5. ✅ **Better error messages** - Show exactly what's wrong

## Related Files
- `src/lib/pesapal.ts` - Contains `getEnvVar()` helper and server functions
- `.env` - Development environment variables (gitignored)
- `vite.config.ts` - Build configuration with `define` option
- `wrangler.jsonc` - Cloudflare Workers local development config

## Why Not Just Use `VITE_` Prefix?

We could rename all variables to `VITE_PESAPAL_*`, but:
- ❌ Would expose secrets to client code (security risk)
- ❌ Would require changing all references everywhere
- ❌ Doesn't work well with Cloudflare Workers conventions
- ✅ Current solution keeps server secrets on server only
- ✅ Works consistently across all environments
