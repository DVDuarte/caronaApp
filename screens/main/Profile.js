import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import * as ImagePicker from 'expo-image-picker'; // You'll need to install this package
import { Ionicons } from '@expo/vector-icons'; // You'll need to install expo vector icons if not already

export default function Profile() {
  const { user, logout, updateProfile, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    university: user?.university || '',
    profileImage: user?.profileImage || null,
  });
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Saída',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const toggleEdit = () => {
    // Se estiver saindo do modo de edição, resetar os valores do formulário
    if (isEditing) {
      setFormData({
        name: user?.name || '',
        university: user?.university || '',
        profileImage: user?.profileImage || null,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(formData);
    
    if (result.success) {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  const updateFormValue = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormValue('profileImage', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera para tirar uma foto');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormValue('profileImage', result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    if (!isEditing) return;
    
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tirar Foto', onPress: takePhoto },
        { text: 'Escolher da Galeria', onPress: pickImage }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={isEditing ? 0.7 : 1}
          onPress={isEditing ? showImageOptions : undefined}
          style={styles.profileImageContainer}
        >
          {formData.profileImage ? (
            <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
          )}
          
          {isEditing && (
            <View style={styles.editImageIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.userName}>
          {isEditing ? formData.name : user?.name || 'Usuário'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {isEditing ? 'Editar Perfil' : 'Informações Pessoais'}
        </Text>
        
        {isEditing ? (
          <>
            <Input
              label="Nome"
              value={formData.name}
              onChangeText={(text) => updateFormValue('name', text)}
              placeholder="Seu nome completo"
            />
            
            <Input
              label="Universidade"
              value={formData.university}
              onChangeText={(text) => updateFormValue('university', text)}
              placeholder="Nome da sua universidade"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                onPress={toggleEdit}
                style={[styles.button, styles.cancelButton]}
                textStyle={styles.cancelButtonText}
              />
              
              <Button
                title="Salvar"
                onPress={handleSaveProfile}
                style={styles.button}
                loading={loading}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.name || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Universidade</Text>
              <Text style={styles.infoValue}>{user?.university || 'Não informado'}</Text>
            </View>
            
            <Button
              title="Editar Perfil"
              onPress={toggleEdit}
              style={styles.editButton}
            />
          </>
        )}
      </View>
      
      <Button
        title="Sair do Aplicativo"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  profileImageContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066cc',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  editButton: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  cancelButtonText: {
    color: '#0066cc',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#f44336',
  },
  logoutButtonText: {
    color: 'white',
  },
});