import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import { saveCarona } from "../utils/storage";

export default function CreateCaronaScreen({ navigation }) {
  const [saida, setSaida] = useState(null);
  const [destino, setDestino] = useState(null);
  const [vagas, setVagas] = useState("");
  const [motorista, setMotorista] = useState("");

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    if (!saida) {
      setSaida(coordinate);
    } else if (!destino) {
      setDestino(coordinate);
    }
  };

  const handleSave = async () => {
    if (!saida || !destino || !vagas || !motorista) {
      alert("Preencha todos os campos e selecione os pontos no mapa!");
      return;
    }

    const novaCarona = {
      id: Date.now(),
      saida: `${saida.latitude.toFixed(6)}, ${saida.longitude.toFixed(6)}`,
      destino: `${destino.latitude.toFixed(6)}, ${destino.longitude.toFixed(6)}`,
      vagas: parseInt(vagas),
      motorista,
      passageiros: []
    };

    await saveCarona(novaCarona);
    alert("Carona cadastrada!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Nova Carona</Text>

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: -22.9068,
          longitude: -43.1729,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {saida && <Marker coordinate={saida} pinColor="green" title="Saída" />}
        {destino && <Marker coordinate={destino} pinColor="red" title="Destino" />}
      </MapView>

      <TextInput label="Vagas" mode="outlined" keyboardType="numeric" value={vagas} onChangeText={setVagas} style={styles.input} />
      <TextInput label="Motorista" mode="outlined" value={motorista} onChangeText={setMotorista} style={styles.input} />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Salvar Carona
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F2F7" },
  title: { marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 10 },
  button: { backgroundColor: "#007AFF", marginTop: 10 },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginBottom: 20,
  },
});