import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { addAccountFromSecret } from '@/lib/storage';

export default function AddScreen() {
  const [label, setLabel] = useState('OmniTender');
  const [secret, setSecret] = useState('');

  async function onSave() {
    try {
      await addAccountFromSecret({ label, secret, issuer: 'OmniTender' });
      router.replace('/');
    } catch (err) {
      Alert.alert('Could not add account', err instanceof Error ? err.message : 'Invalid setup key');
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Enter setup key' }} />
      <View style={styles.container}>
        <Text style={styles.help}>
          Paste the setup key from the OmniTender staff console (or any base32 TOTP secret). Google Authenticator
          exports use the same format.
        </Text>
        <Text style={styles.label}>Account name</Text>
        <TextInput style={styles.input} value={label} onChangeText={setLabel} autoCapitalize="none" />
        <Text style={styles.label}>Setup key</Text>
        <TextInput
          style={[styles.input, styles.mono]}
          value={secret}
          onChangeText={setSecret}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="BASE32SECRET"
        />
        <Pressable style={styles.btn} onPress={onSave}>
          <Text style={styles.btnText}>Save account</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  help: { color: '#9ca3af', lineHeight: 20, marginBottom: 20 },
  label: { color: '#e5e7eb', fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#171a21',
    borderColor: '#2a2f3a',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    padding: 12,
    marginBottom: 16,
  },
  mono: { fontFamily: 'monospace' },
  btn: {
    backgroundColor: '#f7792c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#000', fontWeight: '800' },
});
