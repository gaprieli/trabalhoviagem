import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Screens/Login';
import Home from './Screens/Home';
import Register from './Screens/Register';
// 1. IMPORTAR A TELA NOVA
import RecuperaSenha from './Screens/RecuperaSenha';

export type RootStackParamList ={
    Login: undefined;
    Home: undefined;
    Register: undefined;
    // 2. ADICIONAR NA TIPAGEM
    RecuperaSenha: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function(){
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="RecuperaSenha" component={RecuperaSenha}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}