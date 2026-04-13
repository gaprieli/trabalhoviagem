import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const navigation = useNavigation<LoginScreenProp>();

  const logar = () => {
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
      <Text style={styles.title}>Login</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder='E-mail' 
        autoCapitalize="none" 
        onChangeText={setEmail} 
        value={email} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder='Senha' 
        secureTextEntry 
        onChangeText={setSenha} 
        value={senha} 
      />
      
      <Button title='Entrar' onPress={logar} />
      
      <View style={{ marginTop: 20 }}>
        <Button title='Criar conta' onPress={() => navigation.navigate('Register')} color="#007BFF" />
      </View>

      {/* ADICIONAR ESTE BLOCO NOVO */}
      <View style={{ marginTop: 10 }}>
        <Button 
          title='Esqueceu a senha?' 
          onPress={() => navigation.navigate('RecuperaSenha')} 
          color="#FF9500" // Cor diferente para destacar
        />
      </View>
      {/* FIM DO BLOCO NOVO */}

    </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }
});