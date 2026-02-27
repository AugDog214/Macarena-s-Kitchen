# Web Debugger Memory - Macarena's Kitchen

## Project Structure
- Root: `C:/Users/apirr/OneDrive/Desktop/macarenas-website-live/`
- Pages: index.html, order.html, 404.html, animated-logo.html
- Styles: style.css (single file, ~1795 lines)
- Scripts: script.js (single file, ~543 lines) - only loaded on index.html
- Assets: logo.png, background.png, hero-text.png, hand.webp, dish-*.webp, food-photos/*.webp, videos/*.mp4
- Custom font: assets/fonts/gloucester-mt-extra-condensed.ttf

## Known Issues (Feb 2026 Audit)
- background.png is 5MB, hand.webp is 4.2MB, dish images ~4.5MB each - massive LCP penalty
- gift-certificate-winner.png is 2.8MB unoptimized PNG
- Videos are 16-17MB each (no poster frames, no lazy-loading optimization)
- CSS has rule ordering bug: responsive overrides for .reviews-grid come before base rule definition
- Duplicate .special-menus rule (line 1014 and 1442) with conflicting values
- Sandwiches tab uses wrong SVG icon (warning triangle instead of food icon)
- Pasta tab reuses Appetizers icon (not distinct)
- 5 review cards in 3-col grid = uneven row
- 404.html has no hamburger/mobile-menu (nav unusable on mobile)
- order.html nav missing CATERING link vs index.html
- og:type="restaurant" is non-standard (should be "restaurant.restaurant" or "website")
- X-Frame-Options as meta tag is not reliably honored by browsers
- reuben-aerial.webp is unused asset
- CNAME is set to www subdomain
