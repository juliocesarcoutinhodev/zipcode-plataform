import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ZipSearchColors } from '@/constants/theme';
import { ApiError } from '@/types/zip-code';

interface ErrorCardProps {
  error: ApiError;
  onRetry: () => void;
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
  const isNotFound = error.status === 404;

  return (
    <View
      style={[
        styles.card,
        isNotFound ? styles.cardNotFound : styles.cardUnavailable,
      ]}
    >
      <Text style={styles.emoji}>{isNotFound ? '😔' : '🔧'}</Text>

      <Text style={[styles.title, isNotFound ? styles.titleNotFound : styles.titleUnavailable]}>
        {isNotFound ? 'CEP não encontrado' : 'Serviço temporariamente indisponível'}
      </Text>

      <Text style={styles.message}>
        {isNotFound
          ? 'O CEP informado não existe ou não foi encontrado na base de dados.'
          : 'Tente novamente em alguns instantes.'}
      </Text>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          isNotFound ? styles.retryNotFound : styles.retryUnavailable,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.retryText, isNotFound ? styles.retryTextNotFound : styles.retryTextUnavailable]}>
          Tentar novamente
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  cardNotFound: {
    backgroundColor: ZipSearchColors.errorBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.errorBorder,
  },
  cardUnavailable: {
    backgroundColor: ZipSearchColors.warningBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.warningBorder,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
  },
  titleNotFound: {
    color: ZipSearchColors.error,
  },
  titleUnavailable: {
    color: ZipSearchColors.warning,
  },
  message: {
    fontSize: 15,
    color: ZipSearchColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryNotFound: {
    backgroundColor: ZipSearchColors.errorBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.errorBorder,
  },
  retryUnavailable: {
    backgroundColor: ZipSearchColors.warningBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.warningBorder,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  retryTextNotFound: {
    color: ZipSearchColors.error,
  },
  retryTextUnavailable: {
    color: ZipSearchColors.warning,
  },
  pressed: {
    opacity: 0.7,
  },
});
