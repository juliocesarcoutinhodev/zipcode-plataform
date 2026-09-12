import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ZipSearchColors } from '@/constants/theme';

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = 'Copiar' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await Clipboard.setStringAsync(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }) => [
        styles.button,
        copied ? styles.buttonCopied : styles.buttonDefault,
        pressed && styles.pressed,
      ]}
      accessibilityLabel={copied ? 'Copiado para a área de transferência' : `Copiar ${label}`}
    >
      <Text style={[styles.text, copied ? styles.textCopied : styles.textDefault]}>
        {copied ? '✓ Copiado!' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  buttonDefault: {
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.glassBorder,
  },
  buttonCopied: {
    backgroundColor: ZipSearchColors.successBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.successBorder,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textDefault: {
    color: ZipSearchColors.textSecondary,
  },
  textCopied: {
    color: ZipSearchColors.success,
  },
});
