# ⚠️ SITEMAP FETCH ERROR - QUICK FIX

## 🔴 THE PROBLEM
You submitted: `https://www.donatheresa.com/sitemap.xml` ❌
Your site uses: `https://donatheresa.com/sitemap.xml` ✅

The "www" is causing the issue!

## ✅ IMMEDIATE FIX (2 minutes)

### Step 1: Remove Wrong Property
1. In Google Search Console, click on the property dropdown (top left)
2. Select `https://www.donatheresa.com`
3. Go to Settings → Remove property
4. Confirm removal

### Step 2: Add Correct Property
1. Click "Add property"
2. Choose "URL prefix"
3. Enter exactly: `https://donatheresa.com` (NO www)
4. Verify ownership
5. Submit sitemap as just: `sitemap.xml`

## 🚀 BETTER SOLUTION - Add Both Versions

### Add All 4 Variations:
1. `https://donatheresa.com` ✅ (main)
2. `https://www.donatheresa.com`
3. `http://donatheresa.com`
4. `http://www.donatheresa.com`

Then set `https://donatheresa.com` as your preferred domain.

## 🛡️ PERMANENT FIX - Add Redirects

Add www to non-www redirect in your `next.config.mjs`:

```javascript
async redirects() {
  return [
    // Existing redirects...
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.donatheresa.com' }],
      destination: 'https://donatheresa.com/:path*',
      permanent: true,
    },
  ]
}
```

## 📋 CHECKLIST
- [ ] Remove www property from Search Console
- [ ] Add non-www property
- [ ] Verify ownership
- [ ] Submit sitemap as `sitemap.xml`
- [ ] Check fetch status (should be "Success")

## 🎯 RESULT
Within 5 minutes, you'll see:
- Status: Success ✅
- Discovered pages: 9
- Last read: Today's date

Your sitemap is perfect - just using the wrong URL!
