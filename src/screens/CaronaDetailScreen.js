import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { joinCarona } from "../utils/storage";

export default function CaronaDetailScreen({ route, navigation }) {
  const { carona } = route.params;

  const handleJoin = async () => {
    if (carona.passageiros.length >= carona.vagas) {
      alert("Carona cheia!");
      return;
    }
    await joinCarona(carona.id, "Usuário Exemplo");
    alert("Você entrou na carona!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{carona.saida} → {carona.destino}</Text>
          <Text>Vagas disponíveis: {carona.vagas - carona.passageiros.length}</Text>
          <Text>Motorista: {carona.motorista}</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleJoin} style={styles.button}>
        Entrar na Carona
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F2F7" },
  card: { marginBottom: 20, backgroundColor: "#FFF", elevation: 3 },
  button: { backgroundColor: "#34C759" }
});
