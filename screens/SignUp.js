import React, { useState } from 'react';
import { View, Text,ImageBackground, TextInput, Alert, ScrollView, Keyboard ,StyleSheet, SafeAreaView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { registration } from '../API/firebaseMethods';
import { SegmentedControls } from 'react-native-radio-buttons'
import { FloatingLabelInput } from './FloatingLabelInput';
export default function SignUp({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const options = ['I','II','III','IV'];
  const [address, setAddress] = useState('');

  const emptyState = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAddress('');
  };

  const handlePress = () => {
    if (!fullName) {
      Alert.alert('Name is required');
    } else if (!phone) {
      Alert.alert('Phone Number field is required.');
    } else if(!phone.match(/^[6789]\d{9}/ig)){
      Alert.alert('Invalid Phone Number');
    } else if (!email) {
      Alert.alert('Email field is required.');
    } else if (!password) {
      Alert.alert('Password field is required.');
    } else if (!confirmPassword) {
      setPassword('');
      Alert.alert('Confirm password field is required.');
    } else if (!address){
      Alert.alert('Address field is required.');
    }else if (password.length < 6) {
      Alert.alert('Password must be atleast 6 characters long!');
    } else if (password !== confirmPassword) {
      Alert.alert('Password does not match!');
    } else {
      if(email.match(/^[a-z0-9](\.?[a-z0-9]){5,}@bvrithyderabad\.edu\.in(\W|$)/ig)){
        registration(
          email,
          password,
          fullName,
          phone,
          address
        );
        navigation.navigate('Loading');
        emptyState();
      }
      else{
        Alert.alert('Valid bvrithyderabad emails are accepted.');
      }
      
    }
  };

  return (
    <ImageBackground
    style={styles.background}
    source={require('../assets/feedbg.jpeg')}>
    <SafeAreaView>
     <View style={styles.container}>
       
       <Text style={styles.text}>Create an account </Text>

       <ScrollView onBlur={Keyboard.dismiss}>
          <FloatingLabelInput
         
          label="Full Name*"
          value={fullName}
          onChangeText={(fullName) => setFullName(fullName)}
          />
        <FloatingLabelInput
          style={styles.textInput}
          label="Phone Number*"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
          autoCapitalize="none"
         />

         <FloatingLabelInput
        
          label="Email*"
          value={email}
          onChangeText={(email) => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
         />

          <FloatingLabelInput
         
         label="Password*"
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={true}
         />
         <FloatingLabelInput
        
          label="Confirm password*"
          value={confirmPassword}
          onChangeText={(password2) => setConfirmPassword(password2)}
          secureTextEntry={true}
          />
           <FloatingLabelInput
          label="Address*"
          value={address}
          onChangeText={(address) => setAddress(address)}
         />
          <TouchableOpacity style={styles.button} onPress={handlePress}>
           <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.inlineText}>Already have an account?</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign In')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
       </ScrollView>
     </View>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ECF3FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#ffd60a',
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 15,
    alignSelf: 'center',
    height:50
  },
  buttonText: {
    fontSize:18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inlineText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: '5%',
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
    margin: '5%',
    marginTop:'15%',
    fontWeight: 'bold',
    color: 'black',
  },
  textInput: {
    width: '100%',
    fontSize:15,
    borderWidth: '2%',
    borderColor:'#48494B',
    padding: '10%',
    margin: '5%',
  },
});