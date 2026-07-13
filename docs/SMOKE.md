# OmniAuth — local smoke / health

Fast checks before opening a PR or starting Expo. **Does not** exercise passkeys, Secure Store, or camera (those need a device/simulator).

## Commands

From repo root (`C:\Users\hrmread\OmniAuth` or clone):

```bash
npm install
npm run smoke
```

`npm run smoke` = `npm test` + `npm run lint` (`tsc --noEmit`).

Optional interactive:

```bash
npx expo start
```

## Expected results

| Check | Pass criteria |
|-------|----------------|
| `npm test` | 2 tests pass (`parseOtpAuthUri`, `currentCode`) |
| `npm run lint` | `tsc --noEmit` exits 0 |
| `assets/*.png` | **Not required for unit smoke** — store builds need icons (see README Assets) |
| EAS `projectId` | Still placeholder `replace-with-eas-project-id` until `eas init` |

## Auth surface (read-only note)

OmniAuth is **on-device TOTP only**. Secrets stay in Expo Secure Store. This smoke suite does **not** change auth policy and does **not** talk to OmniVerse APIs.

## Related (access)

| Link | Visibility | Notes |
|------|------------|-------|
| https://omnitender.us | public | Staff console / QR setup UX |
| https://github.com/subtiliorars-sys/OmniAuth | public | This app |
| https://github.com/subtiliorars-sys/omnitender-web | public | Staff CRM dashboard |
| https://github.com/subtiliorars-sys/OmniVerse | **private** | Passkey/TOTP API — 404 if not logged into GitHub with access |

## Last verified

2026-07-13 — `npm run smoke` PASS on Windows (tests 2/2, `tsc` clean).
