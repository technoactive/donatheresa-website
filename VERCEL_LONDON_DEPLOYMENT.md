# Vercel London Deployment Configuration

## ✅ Configuration Added

I've created a `vercel.json` file that forces your Vercel deployment to use the London region.

### Configuration Details:

```json
{
  "regions": ["lhr1"],
  "functions": {
    "app/api/**/route.ts": {
      "maxDuration": 60
    },
    "app/**/page.tsx": {
      "maxDuration": 60
    }
  }
}
```

### Region Code:
- **`lhr1`** = London (Heathrow)

## 🌍 How It Works

1. **Static Content (CDN)**: Your static assets will still be served from Vercel's global CDN edge network for fastest performance worldwide.

2. **Dynamic Content (Functions)**: 
   - API routes and server-side rendered pages will execute in London
   - This ensures data compliance and lowest latency for UK users
   - Supabase database calls will have minimal latency if your DB is also in EU

## 🚀 Benefits for Your Restaurant

1. **Faster Response Times**: UK customers get fastest booking response
2. **Data Compliance**: Keeps processing within UK/EU
3. **Lower Latency**: Especially important for real-time booking availability
4. **Better SEO**: Google gives preference to locally-hosted content

## ⚡ Additional Performance Options

If you need even faster edge performance, you can convert specific routes to Edge Runtime:

```typescript
// In any API route or page
export const runtime = 'edge'
export const preferredRegion = 'lhr1'
```

## 📋 Other Available Regions

If you ever need to change:
- `lhr1` - London 🇬🇧
- `dub1` - Dublin 🇮🇪 
- `fra1` - Frankfurt 🇩🇪
- `iad1` - Washington DC 🇺🇸
- `sfo1` - San Francisco 🇺🇸

## 🔄 Deployment

This configuration will automatically apply on your next deployment to Vercel. No additional setup required!

## ⚠️ Important Notes

1. **Pro Plan Required**: Region selection requires Vercel Pro plan
2. **Function Duration**: Set to 60 seconds max (good for email processing)
3. **Automatic Fallback**: If London is unavailable, Vercel automatically uses nearest region

Your website is now configured to deploy primarily in London for optimal UK performance!
