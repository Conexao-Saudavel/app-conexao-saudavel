import AsyncStorage from '@react-native-async-storage/async-storage';

const REFLECTIONS_KEY = 'user_reflections';

export interface ReflectionItem {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getAsyncReflections(): Promise<ReflectionItem[]> {
  const data = await AsyncStorage.getItem(REFLECTIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function addAsyncReflection(content: string): Promise<ReflectionItem> {
  const newReflection: ReflectionItem = {
    id: Date.now().toString(),
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const current = await getAsyncReflections();
  const updated = [newReflection, ...current];
  await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
  return newReflection;
}

export async function deleteAsyncReflection(id: string): Promise<void> {
  const current = await getAsyncReflections();
  const updated = current.filter(reflection => reflection.id !== id);
  await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
}

export async function editAsyncReflection(id: string, newContent: string): Promise<ReflectionItem | null> {
  const current = await getAsyncReflections();
  const updated = current.map(reflection =>
    reflection.id === id
      ? { ...reflection, content: newContent, updated_at: new Date().toISOString() }
      : reflection
  );
  await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
  return updated.find(reflection => reflection.id === id) || null;
} 