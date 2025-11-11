# Favicon Setup Instructions

## Current Favicon Design
The favicon has been updated with a clean "DT" monogram design for Dona Theresa restaurant:
- Dark navy background (#0f172a)
- Amber/orange text (#f59e0b) matching the brand colors
- Simple, bold letters that are readable at small sizes

## Files Currently in Place
- ✅ `/public/favicon.svg` - Vector favicon (updated with new DT design)
- ✅ `/public/favicon.ico` - ICO file (needs to be regenerated from new SVG)
- ❌ `/public/apple-touch-icon.png` - Missing (referenced in layout.tsx)
- ❌ `/public/placeholder-logo.png` - Missing (referenced in manifest.json)

## How to Generate Missing Favicon Files

### Option 1: Using RealFaviconGenerator (Recommended)
1. Go to https://realfavicongenerator.net
2. Upload the `/public/favicon.svg` file
3. Configure:
   - iOS: Add background color #0f172a
   - Android Chrome: Theme color #f59e0b
   - Windows Metro: Background #0f172a
4. Generate and download the favicon package
5. Extract and copy these files to `/public/`:
   - `favicon.ico` (replace existing)
   - `apple-touch-icon.png`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

### Option 2: Using Favicon.io
1. Go to https://favicon.io/favicon-converter/
2. Upload the `/public/favicon.svg` file
3. Download the generated package
4. Copy the relevant files to `/public/`

### Option 3: Manual Generation with Design Tools
If you have Photoshop, Figma, or similar:
1. Open `/public/favicon.svg`
2. Export as PNG at these sizes:
   - 16x16 → `favicon-16x16.png`
   - 32x32 → `favicon-32x32.png`
   - 180x180 → `apple-touch-icon.png`
   - 192x192 → `android-chrome-192x192.png`
   - 512x512 → `android-chrome-512x512.png`
3. For `favicon.ico`, use an ICO converter with 16x16, 32x32, and 48x48 sizes

## Files to Update After Generation

### 1. Update `/public/manifest.json`
Replace all instances of `/placeholder-logo.png` with appropriate favicon files:
```json
"icons": [
  {
    "src": "/android-chrome-192x192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any maskable"
  },
  {
    "src": "/android-chrome-512x512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any"
  }
]
```

### 2. Update `/public/browserconfig.xml`
Update with actual favicon PNGs:
```xml
<square70x70logo src="/favicon-70x70.png"/>
<square150x150logo src="/favicon-150x150.png"/>
<square310x310logo src="/favicon-310x310.png"/>
```

## Current References in Code
- `app/layout.tsx` - Links to favicon.ico, favicon.svg, and apple-touch-icon.png
- `public/manifest.json` - References placeholder-logo.png (needs updating)
- `public/browserconfig.xml` - References various favicon sizes (needs files)

## Brand Colors Reference
- Primary Blue: #1e3a8a / #0f172a (dark variant)
- Accent Amber: #f59e0b
- Background: #ffffff / #000000

## Testing Your Favicon
1. Clear browser cache
2. Visit the website
3. Check browser tab for favicon
4. Add to homescreen on mobile to test touch icons
5. Test in different browsers (Chrome, Safari, Firefox, Edge)
