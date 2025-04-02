import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { joinCarona } from "../utils/storage";

export default function CaronaDetailScreen({ route, navigation }) {
  const { carona } = route.params;
  
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    const getInitialLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getInitialLocation();
  }, []);

  useEffect(() => {
    let locationSubscription;

    if (tracking) {
      const startTracking = async () => {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5, 
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setLocation({ latitude, longitude });

            setRouteCoordinates((prevCoords) => [...prevCoords, { latitude, longitude }]);

            setMapRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        );
      };

      startTracking();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [tracking]);

  const handleJoin = async () => {
    if (carona.passageiros.length >= carona.vagas) {
      Alert.alert("Erro", "Carona cheia!");
      return;
    }
    await joinCarona(carona.id, "Usuário Exemplo");
    Alert.alert("Sucesso", "Você entrou na carona!");
    setTracking(true);
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
        <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
          {location && <Marker coordinate={location} title="Sua Localização" />}
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        </MapView>
      )}

      <Button mode="contained" onPress={handleJoin} style={styles.button}>
        {tracking ? "Carona em andamento..." : "Entrar na Carona"}
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