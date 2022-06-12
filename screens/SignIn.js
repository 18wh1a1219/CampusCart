import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'react-native-web';
import {signIn} from '../API/firebaseMethods';
import { FloatingLabelInput } from './FloatingLabelInput';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = () => {
    if (!email) {
      Alert.alert('Email field is required.');
    }

    if (!password) {
      Alert.alert('Password field is required.');
    }

    signIn(email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../assets/Signing.png')}>
      <Text style={styles.text}>Sign In </Text>
      <View style={styles.in} >
      <FloatingLabelInput
      
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
      />
      <FloatingLabelInput
       
         label="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />
</View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'20%'
  },
  button: {
    width: 350,
    height:'25%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    color: 'white',
    margin: '2%',
    alignSelf:'center',
    padding:'2%'

  },
  buttonText: {
    fontSize:18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ECF3FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  text: {
    textAlign: 'center',
    fontSize: 22,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    marginTop:90
  },
  in:{
    marginBottom:25,
    marginTop:25
  }
});