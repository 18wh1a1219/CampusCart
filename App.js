import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { View, Image } from 'react-native';
import firebase from 'firebase';
import apiKeys from './config/keys';
import WelcomeScreen from './screens/WelcomeScreen';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import LoadingScreen from './screens/LoadingScreen';
import Dashboard from './screens/Dashboard';
import Feed from './screens/Feed';
import Chat from './screens/Chat';
import UserProfile from './screens/UserProfile';
import Payment from './screens/Payment';
import Track from './screens/track';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddPost from './screens/AddPost';
import Profile from './screens/Profile';
import Cart from './screens/Cart';
 import Messages  from './screens/Messages';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
 
function CampusCartStack() {

  return (
      <Stack.Navigator
        initialRouteName="Campus cart"
        screenOptions={{
          headerStyle: { backgroundColor: '#001d3d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
        
      <Stack.Screen name={'Feed'} component={Feed} options={{ headerShown: false }}/>

      <Stack.Screen name={'Payment'} component={Payment} options={{ headerShown: false }}/>
      <Stack.Screen name={'Chat'} component={Chat} options={{ headerShown: false }}/>
      <Stack.Screen name={'UserProfile'} component={UserProfile} options={{ headerShown: false }}/>
      </Stack.Navigator>
  );
}

function MessagesStack() {

  return (
      <Stack.Navigator
        initialRouteName="Messages"
        screenOptions={{
          headerStyle: { backgroundColor: '#001d3d' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
      <Stack.Screen name={'Message'} component={Messages} options={{ headerShown: false }}/>
      <Stack.Screen name={'Chat'} component={Chat} options={{ headerShown: false }}/>
      </Stack.Navigator>
  );
}
 

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: { backgroundColor: '#001d3d' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}>
       <Stack.Screen name={'Profil'} component={Profile} options={{ headerShown: false }}/>
     
     <Stack.Screen name={'Track'} component={Track} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function Stackk() {
  return (
    <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          activeTintColor: '#001d3d',
        }}>
        <Tab.Screen
          name="Campus Cart"
          component={CampusCartStack}
          options={{
            headerTitleAlign :'center',
            headerTitleStyle: {fontFamily: 'poppins', fontWeight: 'bold'},
            headerLeft: (props) => (
              
              <Image 
              source={require('./assets/logo.jpeg')}
              style={{left:'10%',width:'75%'
            ,height:'100%'}}
              />
            ),
            tabBarLabel: 'Feed',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={size}
              />
            ),
          }}  />
           <Tab.Screen name="Cart" component={Cart}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={26} />
          ),
        }}
      />

<Tab.Screen
          name="Post"
          component={AddPost}
          options={{
            tabBarHideOnKeyboard: true,
            tabBarLabel: 'Post',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="camera"
                color={color}
                size={size}
              />
            ),
          }}  />
          
           <Tab.Screen name="Messages" component={MessagesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-bulleted" color={color} size={26} />
          ),
        }}
      />
          
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                size={size}
                color={color}
              />
            ),
          }} />
      </Tab.Navigator>
  );
}
 
function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
    firebase.firestore().settings({experimentalForceLongPolling: true});
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }}/>
      <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }}/>
      <Stack.Screen name='hi' component={Stackk} options={{ headerShown: false }}/>

      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

 

export default App;
