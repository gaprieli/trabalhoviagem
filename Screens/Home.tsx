import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View,
  Alert, TextInput, FlatList, Modal, TouchableOpacity
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

type Lugar = {
  id: string;
  nome: string;
  descricao: string;
  data: any;
};

export default function Home() {
  const navigation = useNavigation<HomeScreenProp>();

  const [nomeLugar, setNomeLugar] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [data, setData] = useState(new Date());

  const [showDate, setShowDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const lugaresRef = collection(db, "lugares");

  useEffect(() => {
    const q = query(lugaresRef, where("userId", "==", auth.currentUser?.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lugar[];

      setLugares(lista);
    });

    return () => unsubscribe();
  }, []);

  // CREATE
  const adicionarLugar = async () => {
    if (!nomeLugar) {
      Alert.alert('Digite o nome do lugar');
      return;
    }

    await addDoc(lugaresRef, {
      nome: nomeLugar,
      descricao,
      data,
      userId: auth.currentUser?.uid
    });

    setNomeLugar('');
    setDescricao('');
  };

  // EDIT
  const editarLugar = (item: Lugar) => {
    setNomeLugar(item.nome);
    setDescricao(item.descricao);
    setData(new Date(item.data.seconds * 1000));
    setItemSelecionado(item.id);
    setModoEdicao(true);
  };

  const salvarEdicao = async () => {
    if (!itemSelecionado) return;

    await updateDoc(doc(db, "lugares", itemSelecionado), {
      nome: nomeLugar,
      descricao,
      data
    });

    setModoEdicao(false);
    setNomeLugar('');
    setDescricao('');
  };

  // DELETE
  const confirmarDelete = (id: string) => {
    setItemSelecionado(id);
    setModalVisible(true);
  };

  const deletarLugar = async () => {
    if (itemSelecionado) {
      await deleteDoc(doc(db, "lugares", itemSelecionado));
      setModalVisible(false);
    }
  };

  const deslogar = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🌍 Lugares para Viajar</Text>
      <Text style={styles.email}>
        {auth.currentUser?.email}
      </Text>

      <TextInput
        placeholder="Nome do lugar"
        style={styles.input}
        value={nomeLugar}
        onChangeText={setNomeLugar}
      />

      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowDate(true)}
      >
        <Text style={styles.dateText}>
          📅 {data.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={data}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDate(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={modoEdicao ? salvarEdicao : adicionarLugar}
      >
        <Text style={styles.primaryBtnText}>
          {modoEdicao ? "Salvar Alterações" : "Adicionar Lugar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.desc}>{item.descricao}</Text>
            <Text style={styles.date}>
              {new Date(item.data?.seconds * 1000).toLocaleDateString()}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => editarLugar(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmarDelete(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={deslogar}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={{ marginBottom: 10 }}>
              Tem certeza que deseja excluir?
            </Text>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={deletarLugar}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f8'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },

  email: {
    marginBottom: 15,
    color: '#777'
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  dateBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  dateText: {
    color: '#333'
  },

  primaryBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },

  desc: {
    color: '#555',
    marginTop: 5
  },

  date: {
    marginTop: 5,
    color: '#888'
  },

  actions: {
    flexDirection: 'row',
    marginTop: 10
  },

  editBtn: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center'
  },

  deleteBtn: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  },

  logoutBtn: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },

  cancelBtn: {
    padding: 10,
    marginBottom: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa'
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  }
});