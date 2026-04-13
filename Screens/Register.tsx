import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  Alert, TouchableOpacity
} from 'react-native';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigation = useNavigation<RegisterScreenProp>();

  const cadastrar = () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert("Sucesso!", "Conta criada!");
        navigation.replace('Home');
      })
      .catch((erro) => {
        Alert.alert("Erro", erro.message);
      });
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>✨ Criar Conta</Text>
        <Text style={styles.subtitle}>
          Cadastre-se para começar
        </Text>

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

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity style={styles.primaryBtn} onPress={cadastrar}>
          <Text style={styles.primaryBtnText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* VOLTAR */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Voltar ao Login</Text>
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
    marginBottom: 15
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