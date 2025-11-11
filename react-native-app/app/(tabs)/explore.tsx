
import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Alert, Linking, RefreshControl, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme'; // Corregido
import { API_URL } from '@/constants/Api';

export default function FilesScreen() {
  const [files, setFiles] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/files`);
      if (!response.ok) throw new Error('Failed to fetch files.');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Fetch files error:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de archivos. Revisa la IP y que el servidor esté activo en tu red.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFiles();
    setRefreshing(false);
  }, []);

  const handleDownload = (filename: string) => {
    const fileUrl = `${API_URL}/uploads/${filename}`;
    Linking.openURL(fileUrl).catch(err => {
      console.error("Failed to open URL:", err);
      Alert.alert("Error", "No se pudo abrir el archivo.");
    });
  };

  const handleDelete = (filename: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar ${filename}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/files/${filename}`, { method: 'DELETE' });
              if (!response.ok) throw new Error('Failed to delete file.');
              Alert.alert('Éxito', 'Archivo eliminado correctamente.');
              fetchFiles();
            } catch (error) {
              console.error('Delete file error:', error);
              Alert.alert('Error', 'No se pudo eliminar el archivo.');
            }
          },
        },
      ]
    );
  };

  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const deleteIconColor = '#FF3B30';
  const borderColor = colorScheme === 'dark' ? '#3a3a3a' : '#ccc';

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={files}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ThemedView style={[styles.fileItem, { borderBottomColor: borderColor }]}>
            <Feather name="file-text" size={24} color={iconColor} style={styles.fileIcon} />
            <ThemedText style={styles.fileName}>{item}</ThemedText>
            <ThemedView style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => handleDownload(item)} style={styles.iconButton}>
                <Feather name="download-cloud" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconButton}>
                <Feather name="trash-2" size={24} color={deleteIconColor} />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
        ListHeaderComponent={() => <ThemedText type="title" style={styles.title}>Archivos en el Servidor</ThemedText>}
        ListEmptyComponent={() => <ThemedText style={styles.emptyText}>No hay archivos subidos.</ThemedText>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  fileIcon: {
    marginRight: 15,
  },
  fileName: {
    flex: 1,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
