import * as OTPAuth from 'otpauth';

export function parseOtpAuthUri(uri: string) {
  const trimmed = String(uri || '').trim();
  if (!trimmed.startsWith('otpauth://')) {
    throw new Error('Expected an otpauth:// URI');
  }
  const totp = OTPAuth.URI.parse(trimmed);
  if (!(totp instanceof OTPAuth.TOTP)) {
    throw new Error('Only TOTP accounts are supported');
  }
  const secret = totp.secret.base32;
  const label = totp.label || 'OmniTender';
  const issuer = totp.issuer || 'OmniTender';
  return { secret, label, issuer };
}

export function currentCode(secretBase32: string) {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secretBase32),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  return totp.generate();
}

export function secondsRemaining(now = Date.now()) {
  return 30 - (Math.floor(now / 1000) % 30);
}
