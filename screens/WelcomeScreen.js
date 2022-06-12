import {ImageBackground, StyleSheet, View, Text} from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen ({navigation}) {
  return (
     <ImageBackground
      style={styles.background}
      source={require('../assets/Main2.png')}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>CampusCart</Text>
        <Text style={styles.subtitle}>BVRITH Students Essential Mart</Text>
      </View> 
      <View style={styles.titles} >
      <Text style={styles.title1}>Welcome!!</Text>
      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Sign Up')} >
        <Text style={styles.buttonText}>Sign Up</Text>
       </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Sign In')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      </View>
     </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'75%',
    width:'100%',
 
  },
  button1: {
    width: '100%',
    height:65,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    color: 'white',
    margin: '2%',
    alignSelf:'center',
    padding:'5%'
  },
  button2: {
    width:  '100%',
    height:65,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    padding: 5,
    margin: '2%',
    alignSelf:'center',
    padding:'5%'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  inlineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'navy',
    textAlign: 'center',
    marginTop: '5%',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  titles:{
    marginTop:'100%'
  },
  title1: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop:'10%',
    marginBottom:'2%'
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  titleContainer: {
    position: 'absolute',
    top: 35,
  },
});