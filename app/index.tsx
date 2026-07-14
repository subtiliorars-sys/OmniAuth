import { useCallback, useEffect, useState } from 'react';
import { AppState, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Account, listAccounts } from '@/lib/storage';
import { currentCode, secondsRemaining } from '@/lib/totp';

export default function HomeScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tick, setTick] = useState(0);
  const [obscured, setObscured] = useState(AppState.currentState !== 'active');

  const refresh = useCallback(async () => {
    setAccounts(await listAccounts());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      setObscured(next !== 'active');
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.brand}>OmniAuth</Text>
        <Text style={styles.sub}>OmniTender backup authenticator</Text>
      </View>

      {accounts.length === 0 && (
        <Text style={styles.firstTip} accessibilityLabel="omniauth-first-home-tip">
          First run? Open OmniTender staff setup, then Scan QR — secrets stay on this device. Passkeys stay daily primary.
        </Text>
      )}

      <View style={styles.actions}>
        <Link href="/scan" asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Scan QR code</Text>
          </Pressable>
        </Link>
        <Link href="/add" asChild>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Enter setup key</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={accounts}
        extraData={`${tick}:${obscured ? 1 : 0}`}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No accounts yet. Add your OmniTender console from the staff setup QR.</Text>
        }
        renderItem={({ item }) => {
          const code = currentCode(item.secret);
          const remaining = secondsRemaining();
          const display = obscured ? '••• •••' : code.replace(/(\d{3})(?=\d)/g, '$1 ');
          return (
            <Pressable
              style={styles.card}
              disabled={obscured}
              onPress={async () => {
                if (obscured) return;
                await Clipboard.setStringAsync(code);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.issuer}>{item.issuer}</Text>
                <Text style={styles.timer}>{obscured ? '—' : `${remaining}s`}</Text>
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.code}>{display}</Text>
              <Text style={styles.hint}>{obscured ? 'Codes hide while app is in background' : 'Tap to copy'}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  hero: { marginBottom: 20 },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900' },
  sub: { color: '#9ca3af', marginTop: 4, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#f7792c',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '800' },
  secondaryBtn: {
    flex: 1,
    borderColor: '#374151',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#e5e7eb', fontWeight: '700' },
  firstTip: { color: '#f7792c', marginBottom: 14, lineHeight: 20, fontSize: 13 },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 40, lineHeight: 20 },
  card: {
    backgroundColor: '#171a21',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#2a2f3a',
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  issuer: { color: '#f7792c', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  timer: { color: '#6b7280', fontSize: 12 },
  label: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 4 },
  code: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  hint: { color: '#6b7280', fontSize: 11, marginTop: 6 },
});
