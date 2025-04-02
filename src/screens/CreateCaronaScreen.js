import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { saveCarona } from "../utils/storage";


export default function CreateCaronaScreen({ navigation }) {
  const [saida, setSaida] = useState("");
  const [destino, setDestino] = useState("");
  const [vagas, setVagas] = useState("");
  const [motorista, setMotorista] = useState("");

  const handleSave = async () => {
    if (!saida || !destino || !vagas || !motorista) {
      alert("Preencha todos os campos!");
      return;
    }

    const novaCarona = {
      id: Date.now(),
      saida,
      destino,
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

      <TextInput label="Saída" mode="outlined" value={saida} onChangeText={setSaida} style={styles.input} />
      <TextInput label="Destino" mode="outlined" value={destino} onChangeText={setDestino} style={styles.input} />
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
  button: { backgroundColor: "#007AFF", marginTop: 10 }
});
