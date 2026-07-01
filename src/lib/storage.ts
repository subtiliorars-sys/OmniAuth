import * as OTPAuth from 'otpauth';
import * as SecureStore from 'expo-secure-store';

export type Account = {
  id: string;
  label: string;
  issuer: string;
  secret: string;
  createdAt: string;
};

const STORE_KEY = 'omniauth.accounts.v1';

function normalizeSecret(secret: string) {
  return secret.replace(/\s+/g, '').toUpperCase();
}

export async function listAccounts(): Promise<Account[]> {
  const raw = await SecureStore.getItemAsync(STORE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Account[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persist(accounts: Account[]) {
  await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(accounts));
}

export async function addAccountFromSecret(input: {
  label: string;
  secret: string;
  issuer?: string;
}) {
  const secret = normalizeSecret(input.secret);
  if (!/^[A-Z2-7=]+$/i.test(secret)) {
    throw new Error('Setup key must be base32 characters (A–Z, 2–7).');
  }

  // Validate by generating one code.
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });
  totp.generate();

  const accounts = await listAccounts();
  const account: Account = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    label: input.label.trim() || 'OmniTender',
    issuer: (input.issuer || 'OmniTender').trim() || 'OmniTender',
    secret,
    createdAt: new Date().toISOString(),
  };
  accounts.unshift(account);
  await persist(accounts);
  return account;
}

export async function deleteAccount(id: string) {
  const accounts = await listAccounts();
  await persist(accounts.filter((a) => a.id !== id));
}
