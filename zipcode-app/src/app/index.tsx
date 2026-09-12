import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorCard } from '@/components/ErrorCard';
import { FloatingBlobs } from '@/components/FloatingBlobs';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ResultCard } from '@/components/ResultCard';
import { SearchBar } from '@/components/SearchBar';
import { ZipSearchColors } from '@/constants/theme';
import { useZipCode } from '@/hooks/useZipCode';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { state, result, error, search, newSearch } = useZipCode();
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = (code: string) => {
    setLastQuery(code);
    search(code);
  };

  const handleRetry = () => {
    if (lastQuery) search(lastQuery);
  };

  return (
    <View style={styles.container}>
      <FloatingBlobs />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🚀 Powered by CNPJá</Text>
            </View>

            <Text style={styles.title}>BuscaCEP</Text>
            <Text style={styles.subtitle}>Consulte qualquer CEP do Brasil em segundos</Text>
          </View>

          <SearchBar loading={state === 'loading'} onSearch={handleSearch} />

          <View style={styles.resultArea}>
            <LoadingSkeleton visible={state === 'loading'} />

            {state === 'error' && error && (
              <ErrorCard error={error} onRetry={handleRetry} />
            )}

            {state === 'result' && result && (
              <ResultCard data={result} onNewSearch={newSearch} />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Desenvolvido por{' '}
              <Text style={styles.footerLink}>Julio Cesar Coutinho</Text>
            </Text>
            <Text style={styles.footerCopyright}>© 2026 BuscaCEP</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ZipSearchColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 32,
    ...(Platform.OS === 'web' ? { maxWidth: 600, alignSelf: 'center', width: '100%' } : {}),
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.glassBorder,
  },
  badgeText: {
    fontSize: 12,
    color: ZipSearchColors.textSecondary,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: ZipSearchColors.accent,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: ZipSearchColors.textSecondary,
    fontWeight: '500',
  },
  resultArea: {
    gap: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: ZipSearchColors.textMuted,
  },
  footerLink: {
    color: ZipSearchColors.accent,
    fontWeight: '500',
  },
  footerCopyright: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.5)',
  },
});
