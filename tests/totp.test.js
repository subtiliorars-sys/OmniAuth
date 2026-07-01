const { test } = require('node:test');
const assert = require('node:assert/strict');
const OTPAuth = require('otpauth');

// Mirror runtime helpers without Expo imports for CI-friendly unit tests.
function parseOtpAuthUri(uri) {
  const totp = OTPAuth.URI.parse(uri);
  if (!(totp instanceof OTPAuth.TOTP)) throw new Error('Only TOTP');
  return {
    secret: totp.secret.base32,
    label: totp.label,
    issuer: totp.issuer,
  };
}

function currentCode(secretBase32) {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secretBase32),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  return totp.generate();
}

test('parseOtpAuthUri reads OmniTender issuer', () => {
  const secret = new OTPAuth.Secret().base32;
  const uri = new OTPAuth.TOTP({
    issuer: 'OmniTender',
    label: 'staff.user',
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  }).toString();
  const parsed = parseOtpAuthUri(uri);
  assert.equal(parsed.issuer, 'OmniTender');
  assert.equal(parsed.label, 'staff.user');
  assert.equal(parsed.secret, secret);
});

test('currentCode returns six digits', () => {
  const secret = new OTPAuth.Secret().base32;
  const code = currentCode(secret);
  assert.match(code, /^\d{6}$/);
});
