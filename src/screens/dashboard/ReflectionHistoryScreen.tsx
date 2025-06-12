import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import Typography from '../../components/common/Typography';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { semanticColors } from '../../theme/colors';
import { getAsyncReflections, deleteAsyncReflection, editAsyncReflection, ReflectionItem } from '../../utils/asyncReflections';
import { IconButton } from 'react-native-paper';

const ReflectionHistoryScreen = () => {
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
      <Typography variant="headlineMedium" style={[styles.title, { color: semanticColors.onBackground }]}>Histórico de Reflexões</Typography>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {loading ? (
          <Typography style={{ color: semanticColors.textSecondary }}>Carregando...</Typography>
        ) : reflections.length === 0 ? (
          <Typography style={{ color: semanticColors.textSecondary }}>Nenhuma reflexão encontrada.</Typography>
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
                    <IconButton icon="check" size={20} onPress={() => handleEditSave(item.id)} iconColor={semanticColors.primary} />
                    <IconButton icon="close" size={20} onPress={handleEditCancel} iconColor={semanticColors.error} />
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
});

export default ReflectionHistoryScreen; 