import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  logoutUser,
  updateUserProfile,
  resetPassword
} from '../utils/userStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário atual quando o app inicia
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Função para login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      return { success: !!userData };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para registro
  const register = async (userData) => {
    setLoading(true);
    try {
      const success = await registerUser(userData);
      if (success) {
        // Login automático após registro bem-sucedido
        const user = await loginUser(userData.email, userData.password);
        setUser(user);
      }
      return { success };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const success = await updateUserProfile({ ...user, ...userData });
      if (success) {
        setUser(prev => ({ ...prev, ...userData }));
      }
      return { success };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar senha
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const result = await resetPassword(email);
      return result;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        updateProfile,
        forgotPassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);