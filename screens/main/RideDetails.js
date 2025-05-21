import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function RideDetails({ route, navigation }) {
  const { ride } = route.params;
  
  const handleRequestRide = () => {
    Alert.alert(
      'Confirmar solicitação',
      `Deseja solicitar uma vaga nesta carona para ${ride.destination}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert(
              'Solicitação enviada',
              'Sua solicitação de carona foi enviada ao motorista.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{ride.time}</Text>
            <Text style={styles.date}>{ride.date}</Text>
          </View>
          
          <View style={styles.vacanciesContainer}>
            <Text style={styles.vacanciesNumber}>{ride.vacancies}</Text>
            <Text style={styles.vacanciesText}>
              {ride.vacancies === 1 ? 'vaga' : 'vagas'} disponíveis
            </Text>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <View style={styles.originDot} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Origem</Text>
              <Text style={styles.locationName}>{ride.origin}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Destino</Text>
              <Text style={styles.locationName}>{ride.destination}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Motorista</Text>
        
        <View style={styles.driverContainer}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>
              {ride.driver.charAt(0) || 'M'}
            </Text>
          </View>
          
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ride.driver}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>4.8 (24 avaliações)</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informações adicionais</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={20} color="#666666" />
          <Text style={styles.infoText}>Honda Civic Prata</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={20} color="#666666" />
          <Text style={styles.infoText}>R$ 5,00 por pessoa</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color="#666666" />
          <Text style={styles.infoText}>Saída do estacionamento principal</Text>
        </View>
      </View>
      
      <Button 
        title="Solicitar carona" 
        onPress={handleRequestRide} 
        style={styles.requestButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  vacanciesContainer: {
    alignItems: 'center',
  },
  vacanciesNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  vacanciesText: {
    fontSize: 12,
    color: '#666666',
  },
  routeContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066cc',
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#dddddd',
    marginLeft: 12,
  },
  locationTextContainer: {
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666666',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  driverInfo: {
    marginLeft: 16,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  requestButton: {
    margin: 16,
    marginTop: 8,
  },
});