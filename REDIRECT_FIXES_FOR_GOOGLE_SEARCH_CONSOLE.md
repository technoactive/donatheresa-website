# Google Search Console Redirect Issues - Analysis & Fixes

Date: November 18, 2025

## ✅ Issues Fixed

### 1. **Sitemap URL Mismatch (FIXED)**
- **Problem**: Sitemap was using `https://www.donatheresa.com` but the canonical domain is `https://donatheresa.com` (no www)
- **Solution**: Updated `app/sitemap.ts` to use correct non-www URL
- **Impact**: Google will now receive the correct URLs without triggering redirects

### 2. **Search Page Always Redirecting (FIXED)**
- **Problem**: `/search` page was using server-side redirect, making it impossible for Google to index
- **Solution**: Converted to client-side navigation that only redirects when there's a query parameter
- **Impact**: Google can now index the search page properly

## 📋 All Redirects in Your Application

### 1. **Authentication Redirects** (middleware.ts)
These are necessary and should NOT be changed:
- `/dashboard/*` → `/login` (for unauthenticated users)
- `/login` → `/dashboard` (for authenticated users)
- `/auth/confirm` → various destinations after email verification

### 2. **Legacy URL Redirects** (next.config.mjs)
These permanent redirects handle old URLs:
- `/home` → `/` (301 permanent)
- `/booking` → `/reserve` (301 permanent)
- `/our-menus.html` → `/menu` (301 permanent)
- `/our-menus` → `/menu` (301 permanent)

### 3. **Domain Redirects** (handled by Vercel)
- `www.donatheresa.com` → `donatheresa.com` (should be configured in Vercel dashboard)

## 🔍 URLs Google Might Be Trying to Index

Based on the redirects, Google might be attempting to index:
1. `https://www.donatheresa.com/*` (all www URLs from old sitemap)
2. `/home` (redirects to homepage)
3. `/booking` (redirects to /reserve)
4. `/our-menus` and `/our-menus.html` (redirect to /menu)
5. `/search` (was always redirecting, now fixed)

## 📌 Recommended Actions

### 1. **Update Google Search Console**
1. Verify you're using the correct property: `https://donatheresa.com` (NOT www)
2. Resubmit the sitemap: `https://donatheresa.com/sitemap.xml`
3. Use URL Inspection tool to check specific URLs showing redirect errors

### 2. **Configure Vercel Domain Redirect**
Ensure www → non-www redirect is properly configured:
1. Go to Vercel Dashboard → Settings → Domains
2. Add `www.donatheresa.com` if not already added
3. Set it to redirect to `donatheresa.com`

### 3. **Update robots.txt**
Consider adding a sitemap reference to robots.txt:
```
User-agent: *
Allow: /

Sitemap: https://donatheresa.com/sitemap.xml
```

### 4. **Monitor Specific URLs**
Check these URLs in Search Console's URL Inspection tool:
- `https://www.donatheresa.com/` (should redirect)
- `https://donatheresa.com/home` (should redirect)
- `https://donatheresa.com/booking` (should redirect)
- `https://donatheresa.com/our-menus` (should redirect)
- `https://donatheresa.com/search` (should now be indexable)

### 5. **Consider Adding Canonical Tags**
For extra clarity, ensure all pages have canonical tags pointing to the correct URL:
```html
<link rel="canonical" href="https://donatheresa.com/current-page" />
```

## ⏰ Expected Timeline

- **Immediate**: New URLs from updated sitemap will be correct
- **1-2 weeks**: Google will re-crawl and recognize the fixes
- **2-4 weeks**: Redirect errors should clear from Search Console

## 🚨 Do NOT Remove These Redirects

The following redirects are intentional and should remain:
1. Authentication-related redirects (dashboard/login)
2. Legacy URL redirects (for backward compatibility)
3. Domain-level redirects (www to non-www)

These serve important purposes for user experience and maintaining link equity from old URLs.
