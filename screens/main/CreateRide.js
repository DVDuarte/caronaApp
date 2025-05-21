import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import LocationInput from '../../components/LocationInput'; // Importado o componente de localização

// Função para gerar ID único sem dependência do pacote uuid
function generateId() {
  return 'ride_' + 
         Math.random().toString(36).substring(2, 10) + 
         Math.random().toString(36).substring(2, 10) + 
         Date.now().toString(36);
}

export default function CreateRide({ navigation }) {
  const { user } = useAuth();
  const [originData, setOriginData] = useState(null); // Agora armazena o objeto completo
  const [destinationData, setDestinationData] = useState(null); // Agora armazena o objeto completo
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [vacancies, setVacancies] = useState('1');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Chave para armazenamento de dados no AsyncStorage
  const RIDES_STORAGE_KEY = '@RideApp:allRides';

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const validateForm = () => {
    if (!originData) {
      Alert.alert('Erro', 'Por favor, informe o local de origem.');
      return false;
    }
    if (!destinationData) {
      Alert.alert('Erro', 'Por favor, informe o local de destino.');
      return false;
    }
    if (isNaN(parseInt(vacancies)) || parseInt(vacancies) < 1) {
      Alert.alert('Erro', 'Por favor, informe um número válido de vagas.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Formatar data e hora
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: pt });
      const formattedTime = format(time, 'HH:mm', { locale: pt });
      
      // Criar objeto da carona com dados de localização enriquecidos
      const newRide = {
        id: generateId(),
        origin: {
          name: originData.name,
          address: originData.address,
          latitude: originData.latitude,
          longitude: originData.longitude
        },
        destination: {
          name: destinationData.name,
          address: destinationData.address,
          latitude: destinationData.latitude,
          longitude: destinationData.longitude
        },
        date: formattedDate,
        time: formattedTime,
        driver: user?.name || 'Motorista',
        driverId: user?.id || 'user123',
        vacancies: parseInt(vacancies),
        passengers: [],
        createdAt: new Date().toISOString()
      };

      // Recuperar caronas existentes
      const storedRidesJson = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      const storedRides = storedRidesJson ? JSON.parse(storedRidesJson) : [];
      
      // Adicionar nova carona
      const updatedRides = [...storedRides, newRide];
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
      
      Alert.alert('Sucesso', 'Carona criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar carona:', error);
      Alert.alert('Erro', 'Não foi possível criar a carona. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Nova Carona</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Origem</Text>
        <LocationInput
          placeholder="De onde você está saindo?"
          value={originData ? originData.name : ''}
          onLocationSelect={setOriginData}
          buttonTitle="Selecionar Origem"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Destino</Text>
        <LocationInput
          placeholder="Para onde você está indo?"
          value={destinationData ? destinationData.name : ''}
          onLocationSelect={setDestinationData}
          buttonTitle="Selecionar Destino"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity 
            style={styles.dateTimeButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.dateTimeText}>
              {format(date, 'dd/MM/yyyy', { locale: pt })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Horário</Text>
          <TouchableOpacity 
            style={styles.dateTimeButton} 
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.dateTimeText}>
              {format(time, 'HH:mm', { locale: pt })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Número de Vagas</Text>
        <View style={styles.vacanciesInputContainer}>
          <TouchableOpacity
            style={styles.vacancyButton}
            onPress={() => setVacancies(prev => Math.max(1, parseInt(prev) - 1).toString())}
          >
            <Ionicons name="remove" size={18} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.vacanciesDisplay}>{vacancies}</Text>
          
          <TouchableOpacity
            style={styles.vacancyButton}
            onPress={() => setVacancies(prev => Math.min(8, parseInt(prev) + 1).toString())}
          >
            <Ionicons name="add" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Criar Carona</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  vacanciesInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  vacancyButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  vacanciesDisplay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#0066cc',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#7fbaee',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});