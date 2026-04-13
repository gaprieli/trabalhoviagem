import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View,
  TextInput, FlatList,
  TouchableOpacity, Alert
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

import {
  collection, addDoc, onSnapshot,
  query, where, deleteDoc, doc, updateDoc
} from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {

  const navigation = useNavigation<HomeScreenProp>();

  const [nomeLugar, setNomeLugar] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lugares, setLugares] = useState<any[]>([]);
  const [data, setData] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);

  const lugaresRef = collection(db, "lugares");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      lugaresRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLugares(lista);
    });

    return () => unsubscribe();
  }, []);

  // CREATE OU UPDATE
  const salvarLugar = async () => {
    if (!nomeLugar) {
      Alert.alert("Erro", "Digite o nome do lugar");
      return;
    }

    if (editId) {
      await updateDoc(doc(db, "lugares", editId), {
        nome: nomeLugar,
        descricao,
        data
      });

      setEditId(null);
    } else {
      await addDoc(lugaresRef, {
        nome: nomeLugar,
        descricao,
        data,
        userId: auth.currentUser?.uid
      });
    }

    setNomeLugar('');
    setDescricao('');
  };

  // EDITAR
  const editarLugar = (item: any) => {
    setNomeLugar(item.nome);
    setDescricao(item.descricao);
    setData(new Date(item.data.seconds * 1000));
    setEditId(item.id);
  };

  // DELETE
  const deletarLugar = async (id: string) => {
    await deleteDoc(doc(db, "lugares", id));
  };

  // LOGOUT
  const deslogar = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch {
      Alert.alert("Erro", "Não foi possível sair");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🌍 Meus Lugares</Text>
      <Text style={styles.email}>{auth.currentUser?.email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do lugar"
        value={nomeLugar}
        onChangeText={setNomeLugar}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowDate(true)}
      >
        <Text>📅 Escolher data</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={data}
          mode="date"
          onChange={(e, d) => {
            setShowDate(false);
            if (d) setData(d);
          }}
        />
      )}

      {/* BOTÃO SALVAR / EDITAR */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={salvarLugar}
      >
        <Text style={styles.btnText}>
          {editId ? "Salvar Alteração" : "Adicionar Lugar"}
        </Text>
      </TouchableOpacity>

      {/* LISTA */}
      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>{item.descricao}</Text>

            <Text style={styles.data}>
              📅 {new Date(item.data.seconds * 1000).toLocaleDateString()}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => editarLugar(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deletarLugar(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      />

      <TouchableOpacity onPress={deslogar}>
        <Text style={styles.logout}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },

  email: {
    color: '#e8f5e9',
    marginBottom: 15
  },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },

  dateBtn: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },

  addBtn: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32'
  },

  data: {
    marginTop: 5,
    color: '#777'
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center'
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  },

  logout: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  }
});