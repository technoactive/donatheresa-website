# WWW Redirect Solution for Vercel

## ❌ The Problem
The Next.js redirect caused an infinite loop because Vercel already handles domain redirects at the edge level.

## ✅ The Correct Solution

### Option 1: Use Vercel Dashboard (RECOMMENDED)
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Domains**
3. Add `www.donatheresa.com` as an additional domain
4. Vercel will ask: "Redirect to donatheresa.com?"
5. Click **Yes** - Vercel handles it automatically!

### Option 2: Use vercel.json (Alternative)
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://donatheresa.com/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "www.donatheresa.com"
        }
      ]
    }
  ]
}
```

### Option 3: Handle in your domain DNS
1. Go to your domain provider
2. Set up a CNAME record:
   - Host: `www`
   - Points to: `cname.vercel-dns.com`
3. Vercel auto-handles the redirect

## 🚨 Why Next.js Redirect Failed
- Next.js redirects run AFTER Vercel's edge network
- This creates a loop: Vercel → Next.js → Vercel → Next.js
- Always handle domain-level redirects at the edge (Vercel) not application level (Next.js)

## ✅ For Google Search Console

Since redirect isn't working yet, just use the correct property:
1. Remove `https://www.donatheresa.com` property
2. Add `https://donatheresa.com` property (no www)
3. Submit sitemap: `sitemap.xml`

The sitemap will work perfectly without the redirect!
