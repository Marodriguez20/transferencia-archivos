
import React, { useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme'; // Corregido
import { API_URL } from '@/constants/Api';

export default function HomeScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const colorScheme = useColorScheme();

  const selectFile = async () => {
    if (isUploading) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.canceled === false) {
        const file = result.assets?.[0];
        if (file) {
          setSelectedFile(file);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error al seleccionar el archivo.');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('Atención', 'Por favor, selecciona un archivo primero.');
      return;
    }

    setIsUploading(true);
    const uploadUrl = `${API_URL}/upload`;
    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType || 'application/octet-stream',
    } as any);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const responseText = await response.text();
      if (response.ok) {
        Alert.alert('Éxito', '¡Archivo subido correctamente!');
        setSelectedFile(null);
      } else {
        Alert.alert('Error', `Error del servidor: ${responseText}`);
      }
    } catch (error) {
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor. Revisa la IP y que el servidor esté activo en tu red.');
    } finally {
      setIsUploading(false);
    }
  };

  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const primaryColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
  const cardBackgroundColor = colorScheme === 'dark' ? '#2a2a2a' : '#fff';
  const fileInfoBackgroundColor = colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#f0f0f0';

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Transferencia de Archivos</ThemedText>
      <ThemedText style={styles.subtitle}>Sube archivos a tu servidor local</ThemedText>

      <ThemedView style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <TouchableOpacity onPress={selectFile} style={styles.selectButton} disabled={isUploading}>
            <Feather name="file-plus" size={24} color={primaryColor} />
            <ThemedText style={[styles.selectButtonText, { color: primaryColor }]}>Seleccionar Archivo</ThemedText>
        </TouchableOpacity>
        
        {selectedFile && (
            <ThemedView style={[styles.fileInfoContainer, { backgroundColor: fileInfoBackgroundColor }]}>
                <Feather name="file-text" size={20} color={iconColor} />
                <ThemedText style={styles.fileName} numberOfLines={1}>{selectedFile.name}</ThemedText>
            </ThemedView>
        )}
      </ThemedView>

      <TouchableOpacity 
        style={[styles.uploadButton, { backgroundColor: selectedFile && !isUploading ? primaryColor : '#aaa' }]} 
        onPress={uploadFile} 
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Feather name="upload-cloud" size={22} color="#fff" />
        )}
        <ThemedText style={styles.uploadButtonText}>
            {isUploading ? 'Subiendo...' : 'Subir Archivo'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 40,
    fontSize: 16,
    color: '#888',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  selectButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  fileName: {
    marginLeft: 10,
    flexShrink: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
