import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useGridStore } from '../../src/stores/grid.store';
import { useGridCommands } from '../../src/hooks/useGridCommands';
import { parseGridCommand } from '../../src/utils/gridCommands';
import TapService from '../../src/native/TapService';
import { colors } from '../../src/theme/tokens';

export default function ControlScreen() {
  const gridActive = useGridStore((s) => s.gridActive);
  const gridRows = useGridStore((s) => s.gridRows);
  const gridCols = useGridStore((s) => s.gridCols);
  const showGrid = useGridStore((s) => s.showGrid);
  const hideGridFn = useGridStore((s) => s.hideGrid);

  const [text, setText] = useState('');
  const [tapServiceActive, setTapServiceActive] = useState(false);
  const { handleVoiceText } = useGridCommands();

  useEffect(() => {
    if (Platform.OS === 'android') {
      TapService.isEnabled().then(setTapServiceActive);
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const consumed = await handleVoiceText(trimmed);
    if (consumed) {
      setText('');
      return;
    }

    const cmd = parseGridCommand(trimmed);
    if (cmd) {
      setText('');
      return;
    }

    Alert.alert('Unknown command', `"${trimmed}" is not a recognized grid command.`);
  }, [text, handleVoiceText]);

  const toggleGrid = useCallback(() => {
    if (gridActive) {
      hideGridFn();
    } else {
      showGrid();
    }
  }, [gridActive, hideGridFn, showGrid]);

  // Generate grid preview cells
  const cells = [];
  for (let i = 0; i < gridRows * gridCols; i++) {
    cells.push(i + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FutureControl</Text>
      <Text style={styles.subtitle}>Hands-Free Accessibility</Text>

      {/* Status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, tapServiceActive ? styles.dotGreen : styles.dotRed]} />
        <Text style={styles.statusText}>
          {tapServiceActive ? 'Accessibility service active' : 'Service not enabled'}
        </Text>
      </View>

      {/* Grid toggle */}
      <Pressable
        style={[styles.toggleBtn, gridActive && styles.toggleBtnActive]}
        onPress={toggleGrid}
      >
        <Feather
          name={gridActive ? 'eye-off' : 'grid'}
          size={28}
          color="white"
        />
        <Text style={styles.toggleText}>
          {gridActive ? 'Hide Grid' : 'Show Grid'}
        </Text>
      </Pressable>

      {/* Grid preview */}
      <View style={styles.gridPreview}>
        <Text style={styles.gridLabel}>{gridRows} x {gridCols} grid</Text>
        <View style={[styles.grid, { width: Math.min(gridCols * 44, 280) }]}>
          {cells.map((num) => (
            <View key={num} style={styles.cell}>
              <Text style={styles.cellText}>{num}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Command input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a command... (e.g. show grid, 3a)"
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Feather name="send" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.accent, marginTop: 20 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  dotGreen: { backgroundColor: colors.success },
  dotRed: { backgroundColor: colors.error },
  statusText: { color: colors.textSecondary, fontSize: 14 },
  toggleBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  toggleBtnActive: { backgroundColor: colors.error },
  toggleText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  gridPreview: { alignItems: 'center', marginBottom: 24 },
  gridLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cell: {
    width: 40,
    height: 40,
    margin: 2,
    backgroundColor: colors.bgSurface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
