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
npm test
npx expo start
```

## Production builds (EAS)

1. Install EAS CLI: `npm i -g eas-cli`
2. Log in: `eas login`
3. Configure project: `eas init` (updates `app.json` `extra.eas.projectId`)
4. Build:
   - `eas build -p android --profile production`
   - `eas build -p ios --profile production`
5. Submit to stores: `eas submit -p android` / `eas submit -p ios`

## Assets

Add branded icons before store submission:

- `assets/icon.png` (1024×1024)
- `assets/adaptive-icon.png` (1024×1024)
- `assets/splash-icon.png`
- `assets/favicon.png`

## Related repos

- [OmniVerse](https://github.com/subtiliorars-sys/OmniVerse) — API (`/api/passkeys/*`, TOTP, recovery codes)
- [omnitender-web](https://github.com/subtiliorars-sys/omnitender-web) — Staff CRM dashboard

## License

Proprietary — OmniTender / Subtilior Ars.
