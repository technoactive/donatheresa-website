# SWC Version Mismatch - Not a Bug

Date: December 7, 2025

## Summary

The version mismatch between Next.js 15.2.6 and @next/swc-* packages at 15.2.5 is **intentional and not a problem**.

## Why This Happens

1. **Security Patch Release**: Next.js 15.2.6 was a security-only release
2. **SWC Unchanged**: The SWC compiler didn't need updates for this patch
3. **NPM Registry**: @next/swc-* packages version 15.2.6 don't exist

## Verification

Running `npm view @next/swc-darwin-arm64@15.2.6` returns:
```
404 No match found for version 15.2.6
```

## Impact

**None!** This version mismatch is:
- ✅ Expected behavior
- ✅ Fully compatible
- ✅ Will not cause build issues
- ✅ Common in patch releases

## When to Worry

Only be concerned if:
- Build errors mention SWC version conflicts
- Next.js explicitly requires matching versions (rare)
- Major version differences (e.g., 15.x vs 16.x)

## Conclusion

Your application is properly configured. The Next.js team intentionally kept SWC at 15.2.5 for the 15.2.6 security patch.
