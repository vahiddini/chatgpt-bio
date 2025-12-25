```markdown
# Platfrom limits

This folder contains `limits.json` (machine-readable Platfrom limits) and a small validator + tests.

Why:
- Keeps Platfrom-specific limits in one place.
- Validator lets you test/generate outputs that conform to each Platfrom's rules.

Notes:
- Values are defaults based on commonly-known values as of mid-2024. Platfroms update rules frequently — update `limits.json` when necessary.
- The validator performs pragmatic checks: text length, hashtag/mention counts, media counts, per-media size and format, and video duration where provided.

Usage:
1. Install dev dependencies: `npm install`.
2. Run tests: `npm test`.
3. Validate programmatically:
   - import validatePost from `../lib/validate.ts` and call `validatePost('twitter', { text: '...', images: [...], videos: [...] })`.
```
