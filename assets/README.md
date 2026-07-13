# Expo assets (required for store builds)

`app.json` references:

- `icon.png` (1024×1024)
- `adaptive-icon.png` (1024×1024)
- `splash-icon.png`
- `favicon.png`

These PNGs are **not committed yet**. Unit/TypeScript smoke (`npm run smoke`) does not need them.

After adding OmniTender-branded PNGs here:

```bash
npx expo prebuild --clean
```

See `docs/SMOKE.md` for the full local health checklist.
