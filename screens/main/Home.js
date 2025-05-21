import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Home({ navigation }) {
  const { user } = useAuth();

  // Dados simulados de caronas
  const rides = [
    {
      id: '1',
      origin: 'Campus Universitário',
      destination: 'Centro',
      time: '08:00',
      date: '10/06/2023',
      driver: 'Carlos Silva',
      vacancies: 3,
    },
    {
      id: '2',
      origin: 'Shopping Plaza',
      destination: 'Campus Universitário',
      time: '12:30',
      date: '10/06/2023',
      driver: 'Ana Costa',
      vacancies: 2,
    },
    {
      id: '3',
      origin: 'Terminal Rodoviário',
      destination: 'Campus Universitário',
      time: '07:15',
      date: '11/06/2023',
      driver: 'Roberto Almeida',
      vacancies: 4,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name || 'Usuário'}!</Text>
        <Text style={styles.subtitle}>Caronas disponíveis hoje</Text>
      </View>

      {rides.map(ride => (
        <TouchableOpacity
          key={ride.id}
          style={styles.rideCard}
          onPress={() => navigation.navigate('RideDetails', { ride })}
        >
          <View style={styles.rideHeader}>
            <Text style={styles.rideTime}>{ride.time}</Text>
            <Text style={styles.rideDate}>{ride.date}</Text>
          </View>
          
          <View style={styles.rideRoute}>
            <Text style={styles.rideOrigin}>{ride.origin}</Text>
            <Text style={styles.rideDestination}>{ride.destination}</Text>
          </View>
          
          <View style={styles.rideFooter}>
            <Text style={styles.rideDriver}>Motorista: {ride.driver}</Text>
            <Text style={styles.rideVacancies}>
              {ride.vacancies} {ride.vacancies === 1 ? 'vaga' : 'vagas'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rideTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  rideDate: {
    fontSize: 14,
    color: '#666666',
  },
  rideRoute: {
    marginBottom: 12,
  },
  rideOrigin: {
    fontSize: 16,
    fontWeight: '500',
  },
  rideDestination: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 12,
  },
  rideDriver: {
    fontSize: 14,
    color: '#666666',
  },
  rideVacancies: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
});