
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const UploadScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setFile(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Alert.alert('No file selected');
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const response = await fetch(file.uri);
    const blob = await response.blob();

    uploadBytes(storageRef, blob).then((snapshot) => {
      Alert.alert('File uploaded!');
      setFile(null);
    }).catch((error) => {
      Alert.alert('Upload failed', error.message);
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload Screen</Text>
      <Button title="Select File" onPress={selectFile} />
      {file && <Text>Selected: {file.name}</Text>}
      <Button title="Upload File" onPress={uploadFile} disabled={!file} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default UploadScreen;
