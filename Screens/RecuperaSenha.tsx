import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  Alert, TouchableOpacity
} from 'react-native';

import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type RecoverScreenProp = NativeStackNavigationProp<RootStackParamList, 'RecuperaSenha'>;

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<RecoverScreenProp>();

  const recuperarSenha = () => {
    if (!email) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Sucesso!", "Link enviado! Verifique seu e-mail.");
        navigation.goBack();
      })
      .catch((erro) => {
        Alert.alert("Erro", erro.message);
      });
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>🔐 Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail para receber o link
        </Text>

        <TextInput
          style={styles.input}
          placeholder='E-mail cadastrado'
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        {/* BOTÃO ENVIAR */}
        <TouchableOpacity style={styles.primaryBtn} onPress={recuperarSenha}>
          <Text style={styles.primaryBtnText}>Enviar Link</Text>
        </TouchableOpacity>

        {/* VOLTAR */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    padding: 20
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 20
  },

  input: {
    backgroundColor: '#f2f4f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },

  primaryBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  secondaryBtn: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});