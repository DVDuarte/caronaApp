import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function Input({
  label,
  error,
  style,
  inputStyle,
  labelStyle,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : {},
          inputStyle
        ]}
        placeholderTextColor="#999999"
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
});