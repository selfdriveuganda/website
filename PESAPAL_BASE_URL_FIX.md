# Pesapal Base URL Configuration Fix

## The Error

```
Error: internal error; reference = 0ja6blis4j0ppaqvpja8c4um
    at Pesapal.getAuthToken
```

This error occurred when trying to authenticate with Pesapal.

## Root Cause

The `PESAPAL_BASE_URL` had `/api` appended to it:

```env
# ❌ WRONG
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3/api
```

The `pesapal-v3` npm package **automatically adds** `/api/Auth/RequestToken` and other endpoints to the base URL. When we included `/api` in the base URL, the package was making requests to:

```
https://cybqa.pesapal.com/pesapalv3/api/api/Auth/RequestToken
                                         ^^^ ^^^
                                         duplicate!
```

This caused Pesapal to return an "internal error" because the endpoint doesn't exist.

## The Fix

Remove `/api` from the base URL:

```env
# ✅ CORRECT - Sandbox
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3

# ✅ CORRECT - Production (when ready)
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
```

## How the Package Works

The `pesapal-v3` package constructs URLs like this:

```typescript
// If apiBaseUrl = "https://cybqa.pesapal.com/pesapalv3"
const authUrl = `${apiBaseUrl}/api/Auth/RequestToken`;
// Result: https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken ✅

const submitUrl = `${apiBaseUrl}/api/Transactions/SubmitOrderRequest`;
// Result: https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest ✅
```

## Updated Files

### `.env`
```env
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3
```

### `src/lib/pesapal.ts`
```typescript
const apiBaseUrl =
  getEnv("PESAPAL_BASE_URL") || "https://cybqa.pesapal.com/pesapalv3";
```

## Testing

After updating, restart your dev server:

```bash
pnpm dev
```

Then test the booking flow. The authentication should now work correctly.

## Environment URLs Reference

**Sandbox (Development/Testing):**
- Base URL: `https://cybqa.pesapal.com/pesapalv3`
- Dashboard: https://www.pesapal.com/dashboard

**Production (Live):**
- Base URL: `https://pay.pesapal.com/v3`
- Dashboard: https://www.pesapal.com/dashboard

## Related Documentation

- `PESAPAL_NPM_PACKAGE_IMPLEMENTATION.md` - Package implementation details
- `PROCESS_ENV_DYNAMIC_ACCESS_FIX.md` - Environment variable access fix
- Official package: https://www.npmjs.com/package/pesapal-v3
