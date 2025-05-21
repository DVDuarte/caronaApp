import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Chaves de armazenamento
const USER_STORAGE_KEY = '@UniCaronas:users';
const CURRENT_USER_KEY = '@UniCaronas:currentUser';

// Funções auxiliares
const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

// Funções de usuário
export const registerUser = async (userData) => {
  try {
    // Verificar se já existe lista de usuários
    let users = await getData(USER_STORAGE_KEY) || [];
    
    // Verificar se o email já está em uso
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      Alert.alert('Erro', 'Este email já está cadastrado');
      return false;
    }
    
    // Adicionar novo usuário com ID único
    const newUser = {
      ...userData,
      id: Date.now().toString(), // ID simples baseado em timestamp
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await saveData(USER_STORAGE_KEY, users);
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  try {
    const users = await getData(USER_STORAGE_KEY) || [];
    
    // Buscar usuário pelo email e senha
    const user = users.find(
      user => user.email === email && user.password === password
    );
    
    if (user) {
      // Remover senha antes de salvar como usuário atual
      const { password, ...userWithoutPassword } = user;
      await saveData(CURRENT_USER_KEY, userWithoutPassword);
      return userWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return null;
  }
};

export const getCurrentUser = async () => {
  return await getData(CURRENT_USER_KEY);
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    // Buscar todos os usuários
    const users = await getData(USER_STORAGE_KEY) || [];
    
    // Encontrar e atualizar o usuário específico
    const updatedUsers = users.map(user => 
      user.id === userData.id ? { ...user, ...userData } : user
    );
    
    await saveData(USER_STORAGE_KEY, updatedUsers);
    
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userData.id) {
      await saveData(CURRENT_USER_KEY, { ...currentUser, ...userData });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return false;
  }
};

export const resetPassword = async (email) => {
  try {
    const users = await getData(USER_STORAGE_KEY) || [];
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return { success: false, message: 'Email não encontrado' };
    }
    

    return { 
      success: true, 
      message: 'Instruções para redefinir senha foram enviadas (simulado)' 
    };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return { success: false, message: 'Erro ao processar solicitação' };
  }
};
