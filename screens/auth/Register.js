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

export default function Register({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  const { register, loading } = useAuth();
  
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'O nome é obrigatório';
    
    if (!formData.email) newErrors.email = 'O e-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) 
      newErrors.email = 'E-mail inválido';
    
    if (!formData.university) newErrors.university = 'A universidade é obrigatória';
    
    if (!formData.password) newErrors.password = 'A senha é obrigatória';
    else if (formData.password.length < 6)
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'As senhas não coincidem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    const userData = {
      name: formData.name,
      email: formData.email,
      university: formData.university,
      password: formData.password,
    };
    
    const result = await register(userData);
    
    if (result.success) {
      Alert.alert(
        'Cadastro realizado!',
        'Seu cadastro foi realizado com sucesso.'
      );
    } else {
      Alert.alert(
        'Erro no cadastro',
        'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.'
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
        <Text style={styles.logo}>UniCaronas</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Criar conta</Text>
          
          <Input
            label="Nome completo"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Seu nome completo"
            error={errors.name}
          />
          
          <Input
            label="E-mail"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="Seu e-mail universitário"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <Input
            label="Universidade"
            value={formData.university}
            onChangeText={(value) => updateFormData('university', value)}
            placeholder="Nome da sua universidade"
            error={errors.university}
          />
          
          <Input
            label="Senha"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            placeholder="Crie uma senha"
            secureTextEntry
            error={errors.password}
          />
          
          <Input
            label="Confirmar Senha"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            placeholder="Confirme sua senha"
            secureTextEntry
            error={errors.confirmPassword}
          />
          
          <Button
            title="Cadastrar"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Faça login</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666666',
  },
  loginLink: {
    color: '#0066cc',
    fontWeight: '600',
  },
});