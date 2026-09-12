import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { CopyButton } from '@/components/CopyButton';
import { ZipSearchColors } from '@/constants/theme';
import { ZipCode } from '@/types/zip-code';

interface ResultCardProps {
  data: ZipCode;
  onNewSearch: () => void;
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function copyAllText(data: ZipCode): string {
  return [
    `CEP: ${data.code}`,
    `Logradouro: ${data.street || '-'}`,
    `Bairro: ${data.district || '-'}`,
    `Cidade: ${data.city}`,
    `Estado: ${data.state}`,
    `Município: ${data.municipality}`,
    `Atualizado em: ${formatDate(data.updated)}`,
  ].join('\n');
}

interface FieldRowProps {
  icon: string;
  label: string;
  value: string;
  copyValue: string;
}

function FieldRow({ icon, label, value, copyValue }: FieldRowProps) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.fieldLeft}>
        <Text style={styles.fieldIcon}>{icon}</Text>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>{value || '-'}</Text>
        </View>
      </View>
      <CopyButton value={copyValue} />
    </View>
  );
}

export function ResultCard({ data, onNewSearch }: ResultCardProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    await Clipboard.setStringAsync(copyAllText(data));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.code}>{data.code}</Text>
          <Text style={styles.location}>
            {data.city} · {data.state}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ CEP encontrado</Text>
        </View>
      </View>

      <View style={styles.fields}>
        <FieldRow icon="🏠" label="Logradouro" value={data.street || ''} copyValue={data.street || ''} />
        <FieldRow icon="🏘️" label="Bairro" value={data.district || ''} copyValue={data.district || ''} />
        <FieldRow icon="🏙️" label="Cidade" value={data.city} copyValue={data.city} />
        <FieldRow icon="🗺️" label="Estado" value={data.state} copyValue={data.state} />
        <FieldRow icon="🔢" label="Município" value={String(data.municipality)} copyValue={String(data.municipality)} />
        <FieldRow icon="🕐" label="Atualizado" value={formatDate(data.updated)} copyValue={formatDate(data.updated)} />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleCopyAll}
          style={({ pressed }) => [styles.copyAllButton, pressed && styles.pressed]}
        >
          <Text style={styles.copyAllText}>
            {copiedAll ? '✓ Copiado!' : '📋 Copiar tudo'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onNewSearch}
          style={({ pressed }) => [styles.newSearchButton, pressed && styles.pressed]}
        >
          <Text style={styles.newSearchText}>Nova busca</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>📋 Compartilhe este resultado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  code: {
    fontSize: 30,
    fontWeight: '800',
    color: ZipSearchColors.textPrimary,
    letterSpacing: 0.5,
  },
  location: {
    fontSize: 17,
    color: ZipSearchColors.textSecondary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: ZipSearchColors.successBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.successBorder,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ZipSearchColors.success,
  },
  fields: {
    gap: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fieldIcon: {
    fontSize: 18,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: ZipSearchColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: ZipSearchColors.textPrimary,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  copyAllButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ZipSearchColors.accent,
    alignItems: 'center',
    shadowColor: ZipSearchColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  copyAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  newSearchButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: ZipSearchColors.glassBorder,
    alignItems: 'center',
  },
  newSearchText: {
    fontSize: 15,
    fontWeight: '600',
    color: ZipSearchColors.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
  footer: {
    fontSize: 12,
    color: ZipSearchColors.textMuted,
    textAlign: 'center',
  },
});
