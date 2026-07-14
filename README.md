# OmniAuth

OmniTender’s official TOTP authenticator for staff console backup login. Works with the same `otpauth://` QR codes shown during account setup on [omnitender.us](https://omnitender.us). Google Authenticator and Authy remain compatible; OmniAuth is the branded OmniTender experience.

## Auth model (OmniTender fleet)

| Method | Role |
|--------|------|
| **Passkey** | Daily primary sign-in (USB key, Windows Hello, Touch ID) |
| **OmniAuth / TOTP** | Backup when passkey unavailable |
| **Recovery codes** | One-time backup; admin can regenerate |

OmniAuth stores secrets on-device with **Expo Secure Store** (Keychain / Keystore). Nothing is sent to Google or third-party auth servers.

## Development

```bash
npm install
npm run smoke    # unit tests + TypeScript check
npx expo start
```

### First-run tip

Run `npm run smoke` before Expo so typecheck/unit gates are green. Scan the OmniTender console QR with OmniAuth only after the account setup screen is open — secrets stay on-device (Secure Store). Passkeys remain daily primary; OmniAuth is the backup path when a passkey is unavailable.

See [`docs/SMOKE.md`](docs/SMOKE.md) for health criteria and known gaps (assets / EAS project id). Run `eas init` before `eas build` so `app.json` projectId is real.

## Production builds (EAS)

1. Install EAS CLI: `npm i -g eas-cli`
2. Log in: `eas login`
3. Configure project: `eas init` (replaces placeholder `extra.eas.projectId` in `app.json`)
4. Build:
   - `eas build -p android --profile production`
   - `eas build -p ios --profile production`
5. Submit to stores: `eas submit -p android` / `eas submit -p ios`

Until `eas init` runs, `app.json` keeps `projectId: "replace-with-eas-project-id"` on purpose.

## Assets

`app.json` points at branded PNGs under `assets/`. Those files are **not in the repo yet** — only `assets/README.md` is checked in. Add before store submission:

- `assets/icon.png` (1024×1024)
- `assets/adaptive-icon.png` (1024×1024)
- `assets/splash-icon.png`
- `assets/favicon.png`

Local unit smoke does not require the PNGs.

## Fleet

This repo is **OmniTender fleet HQ for staff TOTP backup auth** — branded authenticator for console passkey fallback.

Cross-repo wiring and agent topology: [neural-network/connectome](https://github.com/subtiliorars-sys/neural-network/tree/main/connectome).

## Related repos

- [omnitender-web](https://github.com/subtiliorars-sys/omnitender-web) — Staff CRM dashboard (public)
- [OmniVerse](https://github.com/subtiliorars-sys/OmniVerse) — API (`/api/passkeys/*`, TOTP, recovery codes) — **private**; GitHub returns 404 without org access
- Staff console UX: [omnitender.us](https://omnitender.us)

## License

Proprietary — OmniTender / Subtilior Ars.
