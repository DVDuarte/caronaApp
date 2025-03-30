import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { getCaronas } from "../utils/storage";

export default function HomeScreen({ navigation }) {
  const [caronas, setCaronas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCaronas();
      setCaronas(data);
    };
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate("CriarCarona")} style={styles.button}>
        Criar Carona
      </Button>

      <FlatList
        data={caronas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate("DetalhesCarona", { carona: item })}>
            <Card.Content>
              <Text variant="titleMedium">{item.saida} → {item.destino}</Text>
              <Text>Vagas: {item.vagas - item.passageiros.length}</Text>
              <Text>Motorista: {item.motorista}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F2F7" },
  button: { marginBottom: 15, backgroundColor: "#007AFF" },
  card: { marginBottom: 10, backgroundColor: "#FFF", elevation: 3 }
});
