# Pesapal IPN ID Configuration Fix

## Problem
The error "Missing notification_id (IPN ID)" was occurring because the `PESAPAL_IPN_ID` environment variable was being accessed on the **client side** where it wasn't available.

## Root Cause
- Environment variables in `.env` and `wrangler.jsonc` are only available on the **server side**
- The booking component was trying to access `PESAPAL_IPN_ID` on the client side and pass it to the server
- Client-side code cannot access server-side environment variables for security reasons

## Solution
Changed the architecture so that the **server function adds the IPN ID** instead of receiving it from the client:

### Before (❌ Broken)
```typescript
// Client side (booking.tsx)
const orderData = {
  // ... other fields
  notification_id: PESAPAL_IPN_ID || "", // This was empty on client
};

// Server side (pesapal.ts)
export const submitOrder = createServerFn()
  .handler(async ({ data }) => {
    // Received empty notification_id from client
    return await client.submitOrder(data);
  });
```

### After (✅ Fixed)
```typescript
// Client side (booking.tsx)
const orderData = {
  // ... other fields
  // notification_id is NOT sent from client
};

// Server side (pesapal.ts)
export const submitOrder = createServerFn()
  .inputValidator((data: Omit<PesapalOrderRequest, "notification_id">) => data)
  .handler(async ({ data }) => {
    // Get IPN ID from server-side environment variable
    const IPN_ID = process.env.PESAPAL_IPN_ID;
    
    // Add it to the order data
    const orderData: PesapalOrderRequest = {
      ...data,
      notification_id: IPN_ID,
    };
    
    return await client.submitOrder(orderData);
  });
```

## Benefits
1. ✅ **Security**: Sensitive environment variables stay on the server
2. ✅ **Simplicity**: Client doesn't need to know about IPN ID
3. ✅ **Reliability**: Server always has access to env variables
4. ✅ **Maintainability**: Single source of truth for configuration

## Environment Configuration

### Development (.env)
```env
PESAPAL_IPN_ID=ed7c8922-59fb-4361-ba83-db933d7a325c
```

### Development (wrangler.jsonc)
```jsonc
{
  "env": {
    "development": {
      "vars": {
        "PESAPAL_IPN_ID": "ed7c8922-59fb-4361-ba83-db933d7a325c"
      }
    }
  }
}
```

### Production
Set in Cloudflare Dashboard under Settings > Environment Variables:
- `PESAPAL_IPN_ID`: Your production IPN ID

## Testing
1. Restart dev server: `pnpm dev`
2. Go to booking page
3. Fill in guest details
4. Submit booking
5. Should successfully redirect to Pesapal payment page

## Related Files
- `src/lib/pesapal.ts` - Server function that adds IPN ID
- `src/routes/_all/booking.tsx` - Client component that calls server function
- `.env` - Local environment variables
- `wrangler.jsonc` - Cloudflare Workers configuration
