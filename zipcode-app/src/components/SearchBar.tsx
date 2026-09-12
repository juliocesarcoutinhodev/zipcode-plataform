import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ZipSearchColors } from '@/constants/theme';

interface SearchBarProps {
  loading: boolean;
  onSearch: (code: string) => void;
}

export function SearchBar({ loading, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) {
      setQuery(digits);
    } else {
      setQuery(`${digits.slice(0, 5)}-${digits.slice(5)}`);
    }
    if (error) setError('');
  };

  const handleSubmit = () => {
    const digits = query.replace(/\D/g, '');
    if (digits.length !== 8) {
      setError('CEP inválido. Digite 8 dígitos numéricos.');
      return;
    }
    setError('');
    onSearch(digits);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputRow, focused && styles.inputRowFocused, error ? styles.inputRowError : undefined]}>
        <TextInput
          value={query}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Digite o CEP... ex: 01310-100"
          placeholderTextColor={ZipSearchColors.textMuted}
          keyboardType="numeric"
          inputMode="numeric"
          returnKeyType="search"
          editable={!loading}
          style={styles.input}
          accessibilityLabel="Digite o CEP para consulta"
          accessibilityHint="Informe 8 dígitos numéricos para consultar o endereço"
        />

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.pressed,
            loading && styles.searchButtonDisabled,
          ]}
          accessibilityLabel="Consultar CEP"
        >
          <Text style={styles.searchButtonText}>{loading ? '...' : '🔍'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.glassBorder,
    overflow: 'hidden',
  },
  inputRowFocused: {
    borderColor: 'rgba(99,102,241,0.4)',
  },
  inputRowError: {
    borderColor: 'rgba(239,68,68,0.5)',
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '500',
    color: ZipSearchColors.textPrimary,
  },
  searchButton: {
    marginRight: 6,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: ZipSearchColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ZipSearchColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.85,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: ZipSearchColors.error,
    paddingHorizontal: 4,
  },
});
