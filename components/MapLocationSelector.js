import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MapLocationSelector = ({ 
  visible, 
  onClose, 
  onLocationSelect, 
  initialRegion,
  title = "Selecionar Local no Mapa" 
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Região padrão (BH Centro)
  const defaultRegion = {
    latitude: -19.9227318,
    longitude: -43.9450948,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
  // Região de visualização do mapa
  const [region, setRegion] = useState(initialRegion || defaultRegion);

  useEffect(() => {
    let isMounted = true;
    
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            "Permissão negada", 
            "Para melhor experiência, permita o acesso à sua localização.",
            [{ text: "OK" }]
          );
          if (isMounted) setLoading(false);
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (isMounted) {
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          
          setCurrentLocation(userLocation);
          if (!initialRegion) {
            setRegion(userLocation);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        if (isMounted) setLoading(false);
      }
    };

    getLocationPermission();
    
    return () => { isMounted = false; };
  }, []);

  const handleMapPress = (e) => {
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Atenção", "Toque no mapa para selecionar um local");
      return;
    }
    
    try {
      setLoading(true);
      
      // Tentando obter o endereço através da localização
      let address = "Local selecionado no mapa";
      
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        
        if (reverseGeocode && reverseGeocode.length > 0) {
          const location = reverseGeocode[0];
          address = [
            location.name,
            location.street,
            location.district,
            location.city,
            location.region,
          ].filter(Boolean).join(", ");
        }
      } catch (error) {
        console.log("Erro ao converter coordenadas para endereço:", error);
      }
      
      onLocationSelect({
        name: address,
        address: `${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)}`,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao confirmar localização:", error);
      Alert.alert("Erro", "Não foi possível selecionar este local. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const goToCurrentLocation = () => {
    if (currentLocation) {
      setRegion(currentLocation);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#0066cc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          </View>
        ) : (
          <>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
              >
                {currentLocation && (
                  <Marker
                    coordinate={{
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                    }}
                    pinColor="#2196F3"
                    title="Sua localização"
                  />
                )}
                
                {selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    pinColor="#E53935"
                    title="Local selecionado"
                  />
                )}
              </MapView>
              
              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={goToCurrentLocation}
              >
                <Ionicons name="locate" size={24} color="#0066cc" />
              </TouchableOpacity>
              
              <View style={styles.pinContainer}>
                <View style={styles.mapPin}>
                  <Ionicons name="location" size={36} color="#E53935" />
                </View>
              </View>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleConfirmLocation}
              >
                <Text style={styles.confirmButtonText}>
                  Confirmar Local
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: height - 150, // Ajuste conforme necessário
  },
  currentLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  mapPin: {
    marginBottom: 36, // Ajuste para centralizar o pin no mapa
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#0066cc',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  }
});

export default MapLocationSelector;