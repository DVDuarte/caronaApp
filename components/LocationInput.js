import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapLocationSelector from './MapLocationSelector';

// Lista de locais sugeridos pré-definidos para demonstração
const SUGGESTED_LOCATIONS = [
  { id: '1', name: 'UFMG - Campus Pampulha', address: 'Av. Pres. Antônio Carlos, 6627 - Pampulha, Belo Horizonte' },
  { id: '2', name: 'Shopping Del Rey', address: 'Av. Presidente Carlos Luz, 3001 - Pampulha, Belo Horizonte' },
  { id: '3', name: 'Praça da Liberdade', address: 'Praça da Liberdade - Savassi, Belo Horizonte' },
  { id: '4', name: 'Mineirão', address: 'Av. Antônio Abrahão Caram, 1001 - São José, Belo Horizonte' },
  { id: '5', name: 'Estação Central do Metrô', address: 'Praça Rui Barbosa - Centro, Belo Horizonte' },
  { id: '6', name: 'Mercado Central', address: 'Av. Augusto de Lima, 744 - Centro, Belo Horizonte' },
  { id: '7', name: 'Parque Municipal', address: 'Av. Afonso Pena, 1377 - Centro, Belo Horizonte' },
  { id: '8', name: 'Savassi', address: 'Praça da Savassi - Savassi, Belo Horizonte' },
  { id: '9', name: 'Minha Casa', address: 'Definir endereço residencial' },
  { id: '10', name: 'Meu Trabalho', address: 'Definir endereço comercial' },
];

const LocationInput = ({ 
  placeholder, 
  value, 
  onLocationSelect, 
  buttonTitle = "Selecionar Local" 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  const filteredLocations = SUGGESTED_LOCATIONS.filter(
    location => 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (location) => {
    onLocationSelect(location);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.locationInput}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="location-outline" size={20} color="#666" />
        <Text 
          style={[
            styles.locationInputText, 
            !value && styles.placeholderText
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" />
          
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#0066cc" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{buttonTitle}</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar local..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              clearButtonMode="while-editing"
            />
          </View>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map" size={20} color="#0066cc" />
            <Text style={styles.mapButtonText}>Selecionar no Mapa</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.locationIcon}>
                  {item.id === '9' || item.id === '10' ? (
                    <Ionicons name="star" size={20} color="#0066cc" />
                  ) : (
                    <Ionicons name="location" size={20} color="#0066cc" />
                  )}
                </View>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationAddress}>{item.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>
                  Nenhum local encontrado. Tente uma busca diferente ou use o mapa.
                </Text>
              </View>
            }
            contentContainerStyle={filteredLocations.length === 0 ? {flex: 1} : {}}
          />
        </SafeAreaView>
      </Modal>
      
      <MapLocationSelector
        visible={showMap}
        onClose={() => setShowMap(false)}
        onLocationSelect={(location) => {
          handleSelectLocation(location);
          setShowMap(false);
        }}
        title={`${buttonTitle} no Mapa`}
      />
    </>
  );
};

const styles = StyleSheet.create({
  locationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInputText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
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
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0f0ff',
  },
  mapButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '500',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationIcon: {
    marginRight: 16,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default LocationInput;