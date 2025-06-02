import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, Image, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { saveCarona } from '../utils/storage';

export default function CreateCaronaScreen({ navigation }) {
  const [saida, setSaida] = useState('');
  const [destino, setDestino] = useState('');
  const [vagas, setVagas] = useState('');
  const [motorista, setMotorista] = useState('');
  const [foto, setFoto] = useState(null);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  // Solicita permissão só uma vez
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Permissão pendente', 'Precisamos de acesso à câmera para tirar a foto.');
      }
    })();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setFoto(photo.uri);
      setCameraVisible(false);
    }
  };

  const handleSave = async () => {
    if (!saida || !destino || !vagas || !motorista || !foto) {
      Alert.alert('Erro', 'Preencha todos os campos e tire a foto do motorista!');
      return;
    }

    const novaCarona = {
      id: Date.now(),
      saida,
      destino,
      vagas: parseInt(vagas, 10),
      motorista,
      foto,          // URI da foto
      passageiros: []
    };

    await saveCarona(novaCarona);
    Alert.alert('Sucesso', 'Carona cadastrada com foto!');
    navigation.goBack();
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Sem permissão de câmera. Ative nas configurações.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Nova Carona</Text>

      <TextInput
        label="Saída"
        mode="outlined"
        value={saida}
        onChangeText={setSaida}
        style={styles.input}
      />
      <TextInput
        label="Destino"
        mode="outlined"
        value={destino}
        onChangeText={setDestino}
        style={styles.input}
      />
      <TextInput
        label="Vagas"
        mode="outlined"
        keyboardType="numeric"
        value={vagas}
        onChangeText={setVagas}
        style={styles.input}
      />
      <TextInput
        label="Motorista"
        mode="outlined"
        value={motorista}
        onChangeText={setMotorista}
        style={styles.input}
      />

      {foto && (
        <Image source={{ uri: foto }} style={styles.foto} />
      )}

      <Button
        mode="outlined"
        onPress={() => setCameraVisible(true)}
        style={{ marginVertical: 10 }}
      >
        Tirar Foto do Motorista
      </Button>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
      >
        Salvar Carona
      </Button>

      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={() => setCameraVisible(false)}
      >
        <Camera style={styles.camera} ref={cameraRef} />

        <View style={styles.modalButtons}>
          <Button onPress={handleTakePicture} mode="contained" style={styles.modalButton}>
            Capturar Foto
          </Button>
          <Button onPress={() => setCameraVisible(false)} mode="text" style={styles.modalButton}>
            Cancelar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F2F7' },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 10 },
  button: { backgroundColor: '#007AFF', marginTop: 10 },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10
  },
  camera: { flex: 1 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFF'
  },
  modalButton: { flex: 1, marginHorizontal: 5 }
});
