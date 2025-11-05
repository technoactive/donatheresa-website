# Complete Google Setup Guide for Dona Theresa

## 📋 Quick Overview
1. Submit to Google Search Console (10 mins)
2. Get Google Analytics Measurement ID (10 mins)
3. Connect Everything (5 mins)

---

## 1️⃣ Submit to Google Search Console

### Step 1: Add Your Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"**
4. Choose **"URL prefix"** method
5. Enter exactly: `https://donatheresa.com`
6. Click **"Continue"**

### Step 2: Verify Ownership (Choose ONE method)

#### Option A: HTML Tag (EASIEST) ✅
1. Copy the meta tag they provide (looks like: `<meta name="google-site-verification" content="...">`)
2. Add it to your `app/layout.tsx` in the `<head>` section
3. Deploy to Vercel
4. Click "Verify" in Search Console

#### Option B: DNS TXT Record
1. Go to your domain provider (where you bought donatheresa.com)
2. Add the TXT record Google provides
3. Wait 5-10 minutes
4. Click "Verify"

### Step 3: Submit Your Sitemap
1. In Search Console, click **"Sitemaps"** in sidebar
2. Enter: `sitemap.xml`
3. Click **"Submit"**
4. ✅ Your sitemap is already optimized!

### Step 4: Request Indexing (Optional but Recommended)
1. Go to **"URL Inspection"** in sidebar
2. Enter `https://donatheresa.com`
3. Click **"Request Indexing"**
4. Repeat for important pages:
   - `https://donatheresa.com/reserve`
   - `https://donatheresa.com/menu`

---

## 2️⃣ Get Google Analytics Measurement ID

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Click **"Admin"** (bottom left ⚙️)
3. Click **"Create Property"**
4. Enter:
   - Property name: **Dona Theresa Restaurant**
   - Time zone: **United Kingdom - London**
   - Currency: **GBP**
5. Click **"Next"**

### Step 2: Business Details
1. Industry: **Food and Beverage**
2. Business size: **Small**
3. Select your goals:
   - ✅ Drive online sales
   - ✅ Raise brand awareness
   - ✅ Get contact form submissions
4. Click **"Create"**

### Step 3: Set Up Data Stream
1. Choose **"Web"**
2. Enter:
   - URL: `https://donatheresa.com`
   - Stream name: **Dona Theresa Website**
3. Keep **"Enhanced measurement"** ON
4. Click **"Create stream"**

### Step 4: Get Your Measurement ID
1. You'll see your ID at the top: **G-XXXXXXXXXX**
2. Copy this ID - you need it for the next step!

---

## 3️⃣ Add Measurement ID to Your Website

### Update Your Dashboard
1. Go to your website dashboard: `https://donatheresa.com/dashboard`
2. Navigate to **Settings** → **Google Analytics**
3. Toggle **"Enable Google Analytics"** ON
4. Paste your **Measurement ID** (G-XXXXXXXXXX)
5. Click **"Save Settings"**

✅ **DONE!** Analytics will start tracking immediately

---

## 🎯 What Happens Next?

### In Google Search Console (1-7 days):
- Google starts crawling your site
- Pages begin appearing in search results
- You'll see search performance data
- Monitor for any crawl errors

### In Google Analytics (Immediate):
- Real-time visitor tracking starts
- See traffic sources
- Monitor popular pages
- Track booking form submissions

---

## 📊 Pro Tips for Restaurants

### Search Console:
1. **Monitor these metrics:**
   - "Reserve table" searches
   - "Italian restaurant Pinner" queries
   - Click-through rates
   - Mobile vs Desktop

2. **Fix any errors quickly:**
   - 404 pages
   - Mobile usability issues
   - Core Web Vitals

### Google Analytics:
1. **Set up Goals:**
   - Booking form submissions
   - Menu page views
   - Contact form fills

2. **Track important events:**
   - Reserve button clicks
   - Phone number clicks
   - Direction clicks

---

## 🔧 Verification Code Example

If using HTML tag verification, add this to your `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  verification: {
    google: "YOUR_VERIFICATION_CODE_HERE"
  }
}
```

Or add directly in the `<head>`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
```

---

## ⏰ Timeline

- **Today**: Complete all steps above
- **24-48 hours**: Google starts indexing
- **3-7 days**: See first search data
- **2-4 weeks**: Full indexing complete

---

## 🚨 Common Issues & Fixes

### "Couldn't verify ownership"
- Wait 5 minutes after adding verification
- Clear browser cache
- Make sure you deployed to Vercel

### "Sitemap couldn't be fetched"
- Check URL is exact: `sitemap.xml`
- Already tested - yours works perfectly!

### "No data in Analytics"
- Check Measurement ID is correct
- Ensure Analytics is enabled in dashboard
- Use Incognito mode to test

---

## 📞 Need Help?

1. **Google Search Console Help**: [support.google.com/webmasters](https://support.google.com/webmasters)
2. **Google Analytics Help**: [support.google.com/analytics](https://support.google.com/analytics)

Your website is perfectly prepared for Google submission! 🎉
