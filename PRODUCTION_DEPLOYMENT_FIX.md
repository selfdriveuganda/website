# Production Deployment Fix - Environment Variables

## The Problem

You're getting: **"Pesapal credentials not configured. Please check environment variables."**

This happens because Cloudflare Pages deployments don't automatically use the `vars` from `wrangler.jsonc` - you need to set them in the Cloudflare Dashboard.

## Quick Fix - Set Environment Variables in Cloudflare Dashboard

### Option 1: Use Development Credentials (For Testing)

If you want to test with sandbox credentials in production:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Workers & Pages** → **selfdrive4x4uganda**
3. Go to: **Settings** → **Environment Variables**
4. Click **Add variables** for **Production** environment
5. Add these variables:

```
PESAPAL_BASE_URL = https://cybqa.pesapal.com/pesapalv3
PESAPAL_CONSUMER_KEY = TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev
PESAPAL_CONSUMER_SECRET = 1KpqkfsMaihIcOlhnBo/gBZ5smw=
PESAPAL_IPN_ID = ed7c8922-59fb-4361-ba83-db933d7a325c
```

### Option 2: Use Production Credentials (For Live Payments)

If you have production/live Pesapal credentials:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Workers & Pages** → **selfdrive4x4uganda**
3. Go to: **Settings** → **Environment Variables**
4. Click **Add variables** for **Production** environment
5. Add these variables with your **live** credentials:

```
PESAPAL_BASE_URL = https://pay.pesapal.com/v3
PESAPAL_CONSUMER_KEY = [your_live_consumer_key]
PESAPAL_CONSUMER_SECRET = [your_live_consumer_secret]
PESAPAL_IPN_ID = [your_live_ipn_id]
```

### Step-by-Step with Screenshots Guide

1. **Login to Cloudflare**: https://dash.cloudflare.com/

2. **Find Your Project**:
   - Click on "Workers & Pages" in the left sidebar
   - Find "selfdrive4x4uganda" in the list
   - Click on it

3. **Go to Settings**:
   - Click the "Settings" tab at the top
   - Scroll down to "Environment Variables"

4. **Add Variables**:
   - Click "Add variable" button
   - For each variable:
     - **Variable name**: (e.g., `PESAPAL_BASE_URL`)
     - **Value**: (e.g., `https://cybqa.pesapal.com/pesapalv3`)
     - **Environment**: Select "Production" (and optionally "Preview")
   - Click "Save"

5. **Redeploy**:
   After adding all variables, you need to trigger a new deployment:
   - Go to the "Deployments" tab
   - Click "Create deployment"
   - Select the latest commit
   - Or simply push a new commit: `git commit --allow-empty -m "Trigger redeploy" && git push`

## Alternative: Use Wrangler CLI

You can also set variables using the Wrangler CLI:

```bash
# For testing with sandbox
wrangler pages secret put PESAPAL_BASE_URL --project selfdrive4x4uganda
# When prompted, enter: https://cybqa.pesapal.com/pesapalv3

wrangler pages secret put PESAPAL_CONSUMER_KEY --project selfdrive4x4uganda
# When prompted, enter: TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev

wrangler pages secret put PESAPAL_CONSUMER_SECRET --project selfdrive4x4uganda
# When prompted, enter: 1KpqkfsMaihIcOlhnBo/gBZ5smw=

wrangler pages secret put PESAPAL_IPN_ID --project selfdrive4x4uganda
# When prompted, enter: ed7c8922-59fb-4361-ba83-db933d7a325c
```

## Understanding the Issue

### Why wrangler.jsonc Vars Don't Work in Production

- **Local Development** (`pnpm dev`): 
  - ✅ Uses `wrangler.jsonc` → `env.development.vars`
  - ✅ Works perfectly

- **Cloudflare Pages Deployment**:
  - ❌ Does NOT automatically use `wrangler.jsonc` vars
  - ✅ Requires environment variables set in Dashboard or via CLI
  - ✅ This is more secure (credentials not in git)

### The Right Approach

**wrangler.jsonc** should be used for:
- Non-sensitive configuration
- Local development
- Default values

**Cloudflare Environment Variables** should be used for:
- Sensitive credentials (API keys, secrets)
- Production configuration
- Environment-specific values

## Recommended Setup

### Update wrangler.jsonc (Remove Sensitive Data)

Keep only non-sensitive defaults:

```jsonc
{
  "env": {
    "development": {
      "vars": {
        "PESAPAL_BASE_URL": "https://cybqa.pesapal.com/pesapalv3",
        "PESAPAL_CONSUMER_KEY": "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev",
        "PESAPAL_CONSUMER_SECRET": "1KpqkfsMaihIcOlhnBo/gBZ5smw=",
        "PESAPAL_IPN_ID": "ed7c8922-59fb-4361-ba83-db933d7a325c"
      }
    },
    "production": {
      "vars": {
        // Production values set in Cloudflare Dashboard
      }
    }
  }
}
```

### Set Production Variables in Cloudflare

Use the Dashboard or CLI to set the actual production credentials.

## Testing the Fix

After setting environment variables:

1. **Check the variables are set**:
   - Go to Dashboard → Settings → Environment Variables
   - Verify all 4 variables are there

2. **Trigger a new deployment**:
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push
   ```

3. **Test the booking flow**:
   - Go to your live site
   - Try to book a car
   - Check if Pesapal integration works

4. **Check logs** (if issues persist):
   - Dashboard → Deployments → Click on latest deployment
   - View "Functions" logs to see any errors

## Quick Commands

```bash
# Trigger a redeploy to pick up new env vars
git commit --allow-empty -m "Trigger redeploy"
git push

# Or deploy directly with wrangler
pnpm build
wrangler pages deploy dist

# Check current environment variables (won't show values for security)
wrangler pages deployment list --project selfdrive4x4uganda
```

## Common Issues

### "Still getting the error after adding variables"

- Make sure you clicked "Save" for each variable
- Trigger a new deployment (env vars only apply to new deployments)
- Check you added them to "Production" environment (not just "Preview")

### "Variables showing as undefined in logs"

- Verify variable names are EXACTLY:
  - `PESAPAL_BASE_URL` (not pesapal_base_url)
  - `PESAPAL_CONSUMER_KEY` (not CONSUMER_KEY)
  - `PESAPAL_CONSUMER_SECRET`
  - `PESAPAL_IPN_ID`

### "Can't find environment variables section"

- Make sure you're in the right project
- Go to: Workers & Pages → selfdrive4x4uganda → Settings tab
- Scroll down to find "Environment Variables"

## What to Do Now

**Immediate Action** (Choose one):

1. **Quick Test** - Use sandbox credentials:
   - Add the 4 sandbox variables to Production environment in Dashboard
   - Redeploy

2. **Production Ready** - Use live credentials:
   - Get your production Pesapal credentials
   - Add the 4 live variables to Production environment in Dashboard
   - Redeploy

After setting variables, wait 1-2 minutes for deployment to complete, then test your booking flow.

## Need Help?

If you're still getting errors after following these steps:
1. Check the Functions logs in Cloudflare Dashboard
2. Verify all 4 variables are set correctly
3. Make sure you triggered a new deployment after adding variables
4. Check that the variable names match exactly (case-sensitive)
