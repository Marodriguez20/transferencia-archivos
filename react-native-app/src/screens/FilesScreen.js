
import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const FilesScreen = ({ navigation }) => {
  const auth = getAuth();

  // Placeholder data for files
  const files = [
    { id: '1', name: 'file1.txt', size: '10 KB' },
    { id: '2', name: 'image.png', size: '2 MB' },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Files</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Text>{item.name}</Text>
            <Text>{item.size}</Text>
          </View>
        )}
      />
      <Button
        title="Go to Upload"
        onPress={() => navigation.navigate('Upload')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FilesScreen;
