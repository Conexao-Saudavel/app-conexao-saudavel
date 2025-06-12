import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Typography from '../../components/common/Typography';
import Button from '../../components/common/Button';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';
import { getAsyncReflections, addAsyncReflection, deleteAsyncReflection, editAsyncReflection, ReflectionItem } from '../../utils/asyncReflections';
import { IconButton } from 'react-native-paper';

const ReflectiveDiaryScreen = () => {
  const [reflection, setReflection] = useState('');
  const [reflections, setReflections] = useState<ReflectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async () => {
    setLoading(true);
    const data = await getAsyncReflections();
    setReflections(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!reflection.trim()) return;
    await addAsyncReflection(reflection.trim());
    setReflection('');
    loadReflections();
  };

  const handleDelete = async (id: string) => {
    await deleteAsyncReflection(id);
    loadReflections();
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleEditSave = async (id: string) => {
    if (!editingContent.trim()) return;
    await editAsyncReflection(id, editingContent.trim());
    setEditingId(null);
    setEditingContent('');
    loadReflections();
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent('');
  };

  return (
    <ScreenWrapper style={{ backgroundColor: semanticColors.background, flex: 1 }}>
      <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>Diário Reflexivo</Typography>
      <Typography variant="bodyMedium" style={[styles.subtitle, { color: semanticColors.textSecondary }]}>Escreva sobre seu dia, seus desafios e conquistas.</Typography>
      <TextInput
        style={[styles.textArea, { backgroundColor: semanticColors.surfaceVariant, color: semanticColors.textPrimary }]}
        placeholder="Como foi seu dia?"
        placeholderTextColor={semanticColors.textSecondary}
        value={reflection}
        onChangeText={setReflection}
        multiline
        numberOfLines={6}
      />
      <Button
        title="Salvar Reflexão"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: semanticColors.primary }]}
        labelStyle={{ color: semanticColors.onPrimary, fontWeight: 'bold' }}
      />
      <View style={styles.divider} />
      <Typography variant="titleMedium" style={{ color: semanticColors.onBackground, marginBottom: 8 }}>Suas Reflexões Recentes</Typography>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {loading ? (
          <Typography style={{ color: semanticColors.textSecondary }}>Carregando...</Typography>
        ) : reflections.length === 0 ? (
          <Typography style={{ color: semanticColors.textSecondary }}>Nenhuma reflexão ainda.</Typography>
        ) : (
          reflections.map((item) => (
            <View key={item.id} style={styles.reflectionItem}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={[styles.editInput, { color: semanticColors.textPrimary, backgroundColor: semanticColors.surfaceVariant }]}
                    value={editingContent}
                    onChangeText={setEditingContent}
                    multiline
                  />
                  <View style={styles.editActions}>
                    <Button title="Salvar" onPress={() => handleEditSave(item.id)} style={styles.editButton} labelStyle={{ color: semanticColors.onPrimary }} />
                    <Button title="Cancelar" onPress={handleEditCancel} style={styles.editButtonCancel} labelStyle={{ color: semanticColors.onSurfaceVariant }} />
                  </View>
                </>
              ) : (
                <>
                  <Typography variant="bodyMedium" style={{ color: semanticColors.textPrimary }}>{item.content}</Typography>
                  <Typography variant="labelSmall" style={{ color: semanticColors.textSecondary, marginTop: 2 }}>
                    {new Date(item.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </Typography>
                  <View style={styles.actionRow}>
                    <IconButton icon="pencil" size={20} onPress={() => handleEdit(item.id, item.content)} iconColor={semanticColors.primary} />
                    <IconButton icon="delete" size={20} onPress={() => handleDelete(item.id)} iconColor={semanticColors.error} />
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 24,
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: semanticColors.outline,
    marginVertical: 16,
  },
  reflectionItem: {
    backgroundColor: semanticColors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  editInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: semanticColors.outline,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: semanticColors.primary,
  },
  editButtonCancel: {
    borderRadius: 8,
    backgroundColor: semanticColors.surfaceVariant,
  },
});

export default ReflectiveDiaryScreen; 