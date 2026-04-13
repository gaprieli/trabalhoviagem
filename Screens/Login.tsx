import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  Alert, TouchableOpacity
} from 'react-native';

import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigation = useNavigation<LoginScreenProp>();

  const logar = () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        navigation.replace('Home');
      })
      .catch((erro) => {
        Alert.alert("Erro", erro.message);
      });
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>🌍 Bem-vindo</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder='E-mail'
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder='Senha'
            secureTextEntry={!mostrarSenha}
            onChangeText={setSenha}
            value={senha}
          />

          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Text style={styles.showText}>
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO LOGIN */}
        <TouchableOpacity style={styles.primaryBtn} onPress={logar}>
          <Text style={styles.primaryBtnText}>Entrar</Text>
        </TouchableOpacity>

        {/* CRIAR CONTA */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.btnText}>Criar conta</Text>
        </TouchableOpacity>

        {/* ESQUECEU SENHA */}
        <TouchableOpacity
          onPress={() => navigation.navigate('RecuperaSenha')}
        >
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
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
    fontSize: 26,
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
    marginBottom: 10
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f8',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10
  },

  passwordInput: {
    flex: 1,
    padding: 12
  },

  showText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },

  primaryBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  secondaryBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  linkText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#4CAF50',
    fontWeight: 'bold'
  }
});