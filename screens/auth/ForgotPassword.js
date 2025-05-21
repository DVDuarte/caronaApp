import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const { forgotPassword, loading } = useAuth();

  const validate = () => {
    if (!email) {
      setError('O e-mail é obrigatório');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('E-mail inválido');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      Alert.alert(
        'Instruções enviadas',
        'Verifique seu e-mail para instruções de redefinição de senha.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login') 
          }
        ]
      );
    } else {
      Alert.alert('Erro', result.message || 'Não foi possível processar sua solicitação');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>UniCaronas</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail e enviaremos instruções para redefinir sua senha.
          </Text>
          
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail universitário"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
          
          <Button
            title="Enviar instruções"
            onPress={handleResetPassword}
            loading={loading}
            style={styles.resetButton}
          />
          
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0066cc',
    fontSize: 16,
  },
});