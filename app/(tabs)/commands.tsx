import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/tokens';

interface CommandGroup {
  title: string;
  commands: { cmd: string; desc: string }[];
}

const GROUPS: CommandGroup[] = [
  {
    title: 'Grid Control',
    commands: [
      { cmd: 'show grid', desc: 'Display numbered grid overlay' },
      { cmd: 'hide grid', desc: 'Remove grid overlay' },
      { cmd: 'grid on / grid off', desc: 'Toggle grid visibility' },
    ],
  },
  {
    title: 'Cell Selection',
    commands: [
      { cmd: '1, 2, 3...', desc: 'Zoom into that numbered cell' },
      { cmd: 'tap 5', desc: 'Same as saying "5"' },
    ],
  },
  {
    title: 'Sub-cell Selection',
    commands: [
      { cmd: 'a, b, c, d, e, f', desc: 'Tap within zoomed cell (6 sub-cells)' },
      { cmd: 'tap a', desc: 'Same as saying "a"' },
    ],
  },
  {
    title: 'Direct Tap (One Step)',
    commands: [
      { cmd: '3a', desc: 'Zoom into cell 3, tap sub-cell a' },
      { cmd: 'tap 5c', desc: 'Zoom into cell 5, tap sub-cell c' },
      { cmd: 'click 1b', desc: 'Zoom into cell 1, tap sub-cell b' },
    ],
  },
  {
    title: 'Navigation',
    commands: [
      { cmd: 'back', desc: 'Return from zoomed view to full grid' },
      { cmd: 'reset', desc: 'Same as back' },
      { cmd: 'cancel', desc: 'Same as back' },
    ],
  },
  {
    title: 'Samsung DeX',
    commands: [
      { cmd: 'dex mirror', desc: 'Mirror display to external monitor' },
      { cmd: 'dex extend', desc: 'Extend display to external monitor' },
      { cmd: 'dex off', desc: 'Disconnect external display' },
    ],
  },
];

export default function CommandsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Voice Commands</Text>
      <Text style={styles.subtitle}>
        Say these commands or type them in the Control tab
      </Text>

      {GROUPS.map((group) => (
        <View key={group.title} style={styles.card}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.commands.map((c) => (
            <View key={c.cmd} style={styles.row}>
              <Text style={styles.cmd}>"{c.cmd}"</Text>
              <Text style={styles.desc}>{c.desc}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Grid taps require Android Accessibility Service to be enabled.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  groupTitle: { color: colors.accent, fontSize: 15, fontWeight: 'bold' },
  row: { gap: 2 },
  cmd: { color: colors.text, fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },
  desc: { color: colors.textMuted, fontSize: 12 },
  footer: { alignItems: 'center', marginTop: 12, marginBottom: 40 },
  footerText: { color: colors.textMuted, fontSize: 11, textAlign: 'center' },
});
