import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { login, loading } = useAuth();

  const validate = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'O e-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) 
      newErrors.email = 'E-mail inválido';
      
    if (!password) newErrors.password = 'A senha é obrigatória';
    else if (password.length < 6)
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    const result = await login(email, password);
    
    if (!result.success) {
      Alert.alert(
        'Erro no login', 
        'E-mail ou senha inválidos. Por favor, tente novamente.'
      );
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
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>UniCaronas</Text>
          <Text style={styles.tagline}>Compartilhe o caminho com seus colegas</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Entrar</Text>
          
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail universitário"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            error={errors.password}
          />
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
          
          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
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
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0066cc',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666666',
  },
  registerLink: {
    color: '#0066cc',
    fontWeight: '600',
  },
});