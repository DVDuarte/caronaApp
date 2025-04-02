import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
import { joinCarona } from "../utils/storage";

export default function CaronaDetailScreen({ route, navigation }) {
  const { carona } = route.params;
  
  const [mapRegion, setMapRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    setupMap();
  }, []);

  const setupMap = async () => {
    const [startLat, startLng] = carona.saida.split(',').map(coord => parseFloat(coord.trim()));
    const [endLat, endLng] = carona.destino.split(',').map(coord => parseFloat(coord.trim()));

    const startCoord = { latitude: startLat, longitude: startLng };
    const endCoord = { latitude: endLat, longitude: endLng };

    // Configurar a região do mapa
    setMapRegion({
      latitude: startLat,
      longitude: startLng,
      latitudeDelta: Math.abs(startLat - endLat) * 1.5,
      longitudeDelta: Math.abs(startLng - endLng) * 1.5,
    });

    // Configurar as coordenadas da rota
    setRouteCoordinates([startCoord, endCoord]);

    // Obter e desenhar a rota real (você precisará implementar esta função)
    await getRouteCoordinates(startCoord, endCoord);
  };

  const getRouteCoordinates = async (start, end) => {
    // Aqui você deve implementar a lógica para obter as coordenadas da rota
    // usando um serviço como a API de Direções do Google
    // Por enquanto, vamos usar uma linha reta entre os pontos
    setRouteCoordinates([start, end]);
  };

  const handleJoin = async () => {
    if (carona.passageiros.length >= carona.vagas) {
      Alert.alert("Erro", "Carona cheia!");
      return;
    }
    await joinCarona(carona.id, "Usuário Exemplo");
    Alert.alert("Sucesso", "Você entrou na carona!");
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

      {mapRegion && (
        <MapView style={styles.map} region={mapRegion}>
          <Marker 
            coordinate={{
              latitude: parseFloat(carona.saida.split(',')[0]),
              longitude: parseFloat(carona.saida.split(',')[1])
            }}
            title="Saída"
            pinColor="green"
          />
          <Marker 
            coordinate={{
              latitude: parseFloat(carona.destino.split(',')[0]),
              longitude: parseFloat(carona.destino.split(',')[1])
            }}
            title="Destino"
            pinColor="red"
          />
          <Polyline 
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="blue"
          />
        </MapView>
      )}

      <Button mode="contained" onPress={handleJoin} style={styles.button}>
        Entrar na Carona
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F2F7" },
  card: { marginBottom: 20, backgroundColor: "#FFF", elevation: 3 },
  map: { width: "100%", height: 300, marginBottom: 20 },
  button: { backgroundColor: "#34C759" },
});