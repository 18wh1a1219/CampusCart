import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddPost from './AddPost';
import Feed from './Feed'
import sign from './SignIn'
import Profile from './Profile'
import Messages from './Messages'
import Cart from './Cart';
export default function Dashboard({ navigation }) {
  const [productName, setProductName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState(undefined);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator style={styles.background}>
      <Tab.Screen name="Campus cart" component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
        <Tab.Screen name="Cart" component={Cart}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={26} />
        
          ),
        }}
      />
      <Tab.Screen name="Messages" component={Messages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-bulleted" color={color} size={26} />
            
          ),
        }}
      />
     
      <Tab.Screen name="Post" component={AddPost}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen name="Profile" component={Profile}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
          }
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  card_template: {
    width: 250,
    height: 250,
  },
  background: {
    borderRadius: 20,
  },
  b: {
    marginTop: '160%'
  },
  card_image: {
    width: 250,
    height: 250,
    borderRadius: 10
  },
  text_container: {
    position: "absolute",
    width: 250,
    height: 30,
    bottom: 0,
    padding: 5,
    backgroundColor: "rgba(0,0,0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  card_title: {
    color: "white",
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 120,
    padding: 5,
    backgroundColor: '#001d3d',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
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
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: '2%',
    marginBottom: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    top: '-23%',
    left: '-30%'
  },
});
