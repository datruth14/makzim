# Vercel KV Setup Guide

## What is Vercel KV?
Vercel KV is a serverless Redis database that works perfectly with Vercel deployments. Your data persists forever, unlike SQLite which gets deleted on serverless function resets.

## Setup Instructions

### For Local Development
Local development works **without KV** - it uses default values. You only need to set KV environment variables when deploying to Vercel.

### For Vercel Production

1. **Create a Vercel KV Database:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project (`makzim`)
   - Go to **Storage** tab
   - Click **Create Database**
   - Select **KV Database**
   - Name it (e.g., `mazim-kv`)
   - Select your region
   - Click **Create**

2. **Connect to Your Project:**
   - After creation, click **.env.local**
   - Copy the environment variables shown (KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN)
   - These will be automatically added to your Vercel project

3. **Verify in Vercel Console:**
   - Go to your project settings
   - Navigate to **Environment Variables**
   - You should see: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`

4. **Redeploy Your Project:**
   - Push your changes to GitHub (already done ✓)
   - Vercel will automatically redeploy
   - Your admin content will now persist in KV

## How It Works

- **Admin Dashboard** (`/admin/dashboard`) saves content to KV
- **Homepage** fetches content from KV on page load
- **Profile images**, text, titles, all stored in Redis
- Automatically syncs between local dev and production

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "KV_URL not found" | Check Environment Variables in Vercel console |
| Changes not saving | Refresh the page after clicking Save |
| Can't access admin | Login with `admin@app.com` / `admin` |

## Cost
- **Free tier**: Includes hundreds of GB reads/writes per month
- **Pricing**: Very affordable, pay-as-you-go if you exceed free tier

That's it! Your Maksim Travels app now has persistent storage on Vercel! 🚀
