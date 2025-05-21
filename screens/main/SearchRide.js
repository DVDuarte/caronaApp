import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';

export default function SearchRide({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procurar Carona</Text>
      <Text style={styles.message}>
        Aqui você poderá procurar caronas disponíveis.
      </Text>
      <Text style={styles.placeholder}>
        Esta é uma tela placeholder. A implementação completa viria em uma próxima etapa.
      </Text>
      <Button 
        title="Voltar para o início" 
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
  },
  button: {
    width: '80%',
  },
});