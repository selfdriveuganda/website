# IMMEDIATE FIX - Copy These Exact Steps

## Problem
Production site shows: "Pesapal credentials not configured"

## Solution
Set environment variables in Cloudflare Dashboard

---

## Step 1: Go to Cloudflare Dashboard

Open: https://dash.cloudflare.com/

Login with your Cloudflare account

---

## Step 2: Navigate to Your Project

1. Click **"Workers & Pages"** in the left sidebar
2. Find and click **"selfdrive4x4uganda"** (or your project name)

---

## Step 3: Go to Environment Variables

1. Click the **"Settings"** tab at the top
2. Scroll down to **"Environment Variables"** section
3. Click **"Add variable"** button

---

## Step 4: Add Each Variable

Copy and paste these EXACTLY (for testing with sandbox):

### Variable 1:
```
Name: PESAPAL_BASE_URL
Value: https://cybqa.pesapal.com/pesapalv3
Environment: ✓ Production (check this box)
```

### Variable 2:
```
Name: PESAPAL_CONSUMER_KEY
Value: TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
Environment: ✓ Production (check this box)
```

### Variable 3:
```
Name: PESAPAL_CONSUMER_SECRET
Value: 1KpqkfsMaihIcOlhnBo/gBZ5smw=
Environment: ✓ Production (check this box)
```

### Variable 4:
```
Name: PESAPAL_IPN_ID
Value: ed7c8922-59fb-4361-ba83-db933d7a325c
Environment: ✓ Production (check this box)
```

**IMPORTANT**: 
- Variable names are case-sensitive
- Make sure "Production" is checked
- Click "Save" or "Deploy" after adding all variables

---

## Step 5: Trigger New Deployment

After adding variables, you MUST deploy again for changes to take effect.

**Option A - Push New Commit:**
```bash
cd /Volumes/Frank/Dev/ts/web/customers/james/4fixed
git commit --allow-empty -m "Apply environment variables"
git push
```

**Option B - Redeploy from Dashboard:**
1. Go to **"Deployments"** tab
2. Click **"Retry deployment"** on the latest one
3. Or click **"Create deployment"** and select latest commit

---

## Step 6: Wait and Test

1. Wait 1-2 minutes for deployment to finish
2. Go to your live site
3. Try the booking flow
4. Should now work! ✅

---

## Expected Result

✅ No more "credentials not configured" error
✅ Pesapal integration works
✅ Can create test bookings

---

## If Still Not Working

Check the logs:
1. Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Click "Functions" tab
4. Look for error messages

Common issues:
- ❌ Forgot to check "Production" environment
- ❌ Typo in variable name (they're case-sensitive)
- ❌ Didn't trigger new deployment after adding variables
- ❌ Added to "Preview" instead of "Production"

---

## Alternative: Use CLI (If You Prefer)

```bash
# Set variables using wrangler CLI
wrangler pages secret put PESAPAL_BASE_URL --project selfdrive4x4uganda
# Paste: https://cybqa.pesapal.com/pesapalv3

wrangler pages secret put PESAPAL_CONSUMER_KEY --project selfdrive4x4uganda
# Paste: TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev

wrangler pages secret put PESAPAL_CONSUMER_SECRET --project selfdrive4x4uganda
# Paste: 1KpqkfsMaihIcOlhnBo/gBZ5smw=

wrangler pages secret put PESAPAL_IPN_ID --project selfdrive4x4uganda
# Paste: ed7c8922-59fb-4361-ba83-db933d7a325c

# Then deploy
pnpm build
wrangler pages deploy dist
```

---

That's it! The site should work after following these steps.
