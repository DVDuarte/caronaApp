import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation, route }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');
  const [myRides, setMyRides] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Chaves para armazenamento de dados no AsyncStorage
  const RIDES_STORAGE_KEY = '@RideApp:allRides';

  // Efeito para atualizar a lista quando voltar para esta tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRides();
    });
    return unsubscribe;
  }, [navigation]);

  // Efeito inicial para carregar os dados
  useEffect(() => {
    fetchRides();
  }, [user]);

  const fetchRides = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Recuperar dados do AsyncStorage
      const storedRidesJson = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      let rides = storedRidesJson ? JSON.parse(storedRidesJson) : [];
      
      // Separar caronas criadas pelo usuário atual das demais
      const userRides = rides.filter(ride => ride.driverId === user.id);
      const otherRides = rides.filter(ride => ride.driverId !== user.id);
      
      setMyRides(userRides);
      setAvailableRides(otherRides);
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as caronas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRides();
  };

  const handleCreateRide = () => {
    navigation.navigate('CreateRide');
  };
  
  const deleteRide = async (rideId) => {
    try {
      // Recuperar todas as caronas
      const storedRidesJson = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      let rides = storedRidesJson ? JSON.parse(storedRidesJson) : [];
      
      // Filtrar para remover a carona selecionada
      const updatedRides = rides.filter(ride => ride.id !== rideId);
      
      // Salvar de volta no AsyncStorage
      await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
      
      // Atualizar o estado
      const updatedMyRides = myRides.filter(ride => ride.id !== rideId);
      setMyRides(updatedMyRides);
      
      Alert.alert('Sucesso', 'Carona removida com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir carona:', error);
      Alert.alert('Erro', 'Não foi possível remover a carona.');
    }
  };

  const handleLongPressRide = (ride) => {
    if (ride.driverId === user.id) {
      Alert.alert(
        'Gerenciar Carona',
        'O que você deseja fazer com esta carona?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Editar', 
            onPress: () => navigation.navigate('EditRide', { ride }) 
          },
          { 
            text: 'Excluir', 
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Confirmar exclusão',
                'Tem certeza que deseja excluir esta carona? Esta ação não pode ser desfeita.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Excluir', style: 'destructive', onPress: () => deleteRide(ride.id) }
                ]
              );
            }
          },
        ]
      );
    }
  };

  // Função auxiliar para obter o nome do local (compatível com ambos formatos)
  const getLocationName = (location) => {
    if (!location) return "Local não definido";
    
    // Novo formato (objeto com propriedade name)
    if (typeof location === 'object' && location.name) {
      return location.name;
    }
    
    // Formato antigo (string direta)
    return location;
  };

  const renderRideCard = (ride, isCreated = false) => (
    <TouchableOpacity
      key={ride.id}
      style={styles.rideCard}
      onPress={() => navigation.navigate('RideDetails', { ride, isCreated })}
      onLongPress={() => handleLongPressRide(ride)}
      delayLongPress={500}
    >
      <View style={styles.rideHeader}>
        <Text style={styles.rideTime}>{ride.time}</Text>
        <Text style={styles.rideDate}>{ride.date}</Text>
      </View>
      
      <View style={styles.rideRoute}>
        <View style={styles.routeItem}>
          <Ionicons name="location" size={16} color="#0066cc" />
          <Text style={styles.rideOrigin}>{getLocationName(ride.origin)}</Text>
        </View>
        <View style={styles.routeSeparator} />
        <View style={styles.routeItem}>
          <Ionicons name="flag" size={16} color="#0066cc" />
          <Text style={styles.rideDestination}>{getLocationName(ride.destination)}</Text>
        </View>
      </View>
      
      <View style={styles.rideFooter}>
        {isCreated ? (
          <Text style={styles.rideDriverCreated}>
            {ride.passengers?.length || 0} passageiros
          </Text>
        ) : (
          <Text style={styles.rideDriver}>Motorista: {ride.driver}</Text>
        )}
        <Text style={[styles.rideVacancies, ride.vacancies <= 0 && styles.noVacancies]}>
          {ride.vacancies} {ride.vacancies === 1 ? 'vaga' : 'vagas'}
        </Text>
      </View>

      {isCreated && (
        <View style={styles.badgeCreated}>
          <Text style={styles.badgeText}>Criada por você</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name || 'Usuário'}!</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRide}>
          <Ionicons name="add-circle" size={24} color="#0066cc" />
          <Text style={styles.createButtonText}>Criar Carona</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'available' && styles.activeTab]} 
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Caronas Disponíveis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'created' && styles.activeTab]} 
          onPress={() => setActiveTab('created')}
        >
          <Text style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}>
            Minhas Caronas
          </Text>
          {myRides.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{myRides.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Carregando caronas...</Text>
          </View>
        ) : (
          activeTab === 'available' ? (
            <>
              {availableRides.length > 0 ? (
                availableRides.map(ride => renderRideCard(ride))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="car-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyStateText}>Nenhuma carona disponível no momento</Text>
                  <Text style={styles.emptyStateSubtext}>Puxe para baixo para atualizar</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {myRides.length > 0 ? (
                myRides.map(ride => renderRideCard(ride, true))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="add-circle-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyStateText}>Você ainda não criou nenhuma carona</Text>
                  <TouchableOpacity 
                    style={styles.emptyStateButton} 
                    onPress={handleCreateRide}
                  >
                    <Text style={styles.emptyStateButtonText}>Criar minha primeira carona</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#0066cc',
    fontWeight: '600',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#dddddd',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomColor: '#0066cc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#0066cc',
  },
  badge: {
    backgroundColor: '#0066cc',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeCreated: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0066cc',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scrollContent: {
    flex: 1,
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
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeSeparator: {
    height: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#0066cc',
    marginLeft: 8,
    marginVertical: 4,
  },
  rideOrigin: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  rideDestination: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
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
  rideDriverCreated: {
    fontSize: 14,
    color: '#0066cc',
  },
  rideVacancies: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  noVacancies: {
    color: '#dc3545',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});