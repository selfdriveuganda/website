# Pesapal CORS Error - "Failed to fetch"

## The Problem

You're seeing a **"Failed to fetch"** error because:

1. **Pesapal API doesn't support CORS** (Cross-Origin Resource Sharing)
2. Browser security prevents direct API calls from frontend to Pesapal
3. You need a **backend server** to proxy the Pesapal API requests

## Current Architecture (❌ Won't Work)

```
Browser → Pesapal API (BLOCKED by CORS)
```

## Required Architecture (✅ Will Work)

```
Browser → Your Backend API → Pesapal API → Response → Browser
```

## Solution Options

### Option 1: Create Backend API Routes (Recommended)

Create API endpoints in your backend to handle Pesapal requests:

#### 1. Create API Route for Token
```typescript
// api/pesapal/token.ts
export async function POST() {
  const response = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  
  return await response.json();
}
```

#### 2. Create API Route for Submit Order
```typescript
// api/pesapal/submit-order.ts
export async function POST(request: Request) {
  const orderData = await request.json();
  const token = await getPesapalToken(); // Your token function
  
  const response = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  
  return await response.json();
}
```

#### 3. Update Frontend to Use Backend API
```typescript
// src/lib/pesapal.ts
export async function submitOrder(orderData: PesapalOrderRequest) {
  const response = await fetch('/api/pesapal/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit order');
  }
  
  return await response.json();
}
```

### Option 2: Use Vite Proxy (Development Only)

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api/pesapal': {
        target: 'https://cybqa.pesapal.com/pesapalv3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pesapal/, ''),
      },
    },
  },
});
```

Then update BASE_URL:
```typescript
const PESAPAL_BASE_URL = '/api/pesapal'; // Will proxy to Pesapal
```

**⚠️ Warning**: This only works in development. Production needs a real backend.

### Option 3: Use a Serverless Function

Deploy serverless functions to handle Pesapal API calls:

**Vercel Functions:**
```typescript
// api/pesapal/submit-order.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderData = req.body;
  
  // Get token
  const tokenResponse = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  
  const { token } = await tokenResponse.json();
  
  // Submit order
  const orderResponse = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  
  const data = await orderResponse.json();
  res.status(200).json(data);
}
```

## Quick Fix for Testing (Development Only)

1. **Disable CORS in browser** (NOT for production):
   - Chrome: Install "CORS Unblock" extension
   - Or run: `open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`

2. **Or use Vite proxy** as shown in Option 2

## Recommended Implementation

1. Create backend API routes (`/api/pesapal/*`)
2. Move Pesapal credentials to backend environment variables
3. Update frontend to call your backend API
4. Backend proxies requests to Pesapal

### File Structure:
```
project/
├── api/                    # Backend API routes
│   └── pesapal/
│       ├── token.ts       # Get auth token
│       ├── submit-order.ts # Submit order
│       └── transaction-status.ts
├── src/
│   └── lib/
│       └── pesapal.ts     # Frontend calls to /api/pesapal/*
```

## Testing

After implementing backend proxy:

1. Test token retrieval: `POST /api/pesapal/token`
2. Test order submission: `POST /api/pesapal/submit-order`
3. Verify no CORS errors in browser console
4. Check Pesapal sandbox dashboard for test transactions

## Security Notes

- ✅ Keep Pesapal credentials on backend only
- ✅ Never expose consumer key/secret in frontend
- ✅ Validate requests on backend before proxying
- ✅ Add rate limiting to prevent abuse
- ✅ Log all Pesapal API calls for debugging

## Current Error Details

The "Failed to fetch" error occurs because:
```
Access to fetch at 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This is expected behavior - Pesapal requires server-to-server communication.
