import React, { useState, useCallback, useLayoutEffect, useRef, useEffect } from 'react';

import { GiftedChat } from 'react-native-gifted-chat'
import * as firebase from 'firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { TextInput, Alert, ScrollView,Dimensions, Keyboard, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Messages({ navigation }) {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const isFocused = useIsFocused();
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [usersList, setUsersList] = useState([]);
  const scrollRef = useRef();
  const [userMsgsInfo, setUserMsgsInfo] = useState([]);
  var screenWidth = Dimensions.get('window').width;
  const user1 = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  useEffect(() => {
    function fetch(){
      firebase.firestore()
          .collection('users')
          .get()
          .then((snapshot) => {
              let userr = snapshot.docs.map(doc => {
                  const data = doc.data();
                  return { ...data }
              })              
              setUsers(userr);
              let msgsInfo = [];
              let mappedObj = {};
              let u = []
              console.log("users",userr)
              var count = 0
              userr.forEach(user => {
                const len = userr.length
                const user2 = user.uid;
                const id = user1 > user2 ? user1 + user2 : user2 + user1;
                let msgs = [];
                let unread = 0;
                firebase.firestore().collection("messages").doc(id).collection("chat").orderBy("createdAt", "asc").onSnapshot((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    if(doc.data().from === user2 && doc.data().read === false){
                      unread = unread + 1
                    }
                    msgs.push(doc.data());
                  });
                if(msgs.length > 0){
                  let res = userr.find(userData => userData.uid === user2)
                  res.unread = unread
                  u.push(res)
                }
                count = count + 1
                if(count === len){
                  console.log(u)
                  setUsersList(u)
                }
              })
          })
      })
  }     
            
  isFocused &&  fetch();
  }, [isFocused]);


  return (
    <View style={styles.Container}>
      <View style={styles.card_template}>
             {usersList.map(user => (
              <View>
              <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Chat', { paramKey: user.fullName})}>
                <Text style={styles.buttonText} >{user.fullName} <Text style={{ color:'red',fontWeight:'900'}}>{user.unread>0?user.unread:null}</Text></Text>
              </TouchableOpacity>
              <View style={{height:'2%'}}><Text></Text></View>
              </View>
            ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: -170,
    paddingVertical: 20,
    backgroundColor: '#F5FCFF',
  },
  Container: {
    height:'100%',
    alignItems: 'center', 
  },
  name: {
    top: '2%',
    fontWeight:'bold',
    alignSelf: 'center',
    color:'darkblue'
  },
  sender: {
    left: '83%',
    padding: '4%',
    borderWidth: 2,
    margin:'2%',
    borderColor:'gray'
  },
  receiver: {
    left: '3%',
    padding: '4%',
    borderWidth: 2,
    margin:'2%'
  },
  textInput: {
    width: 300,
    fontSize: 18,
    borderWidth: 2,
    borderColor: 'gray',
    padding: 10,
    margin: 5,
    backgroundColor: '#ffffff'
  },
  card_template: {
    margin:'5%',
    width:'80%',
    alignContent:'center',
    flexDirection:'column',justifyContent:'space-between'
  },
  b: {
    marginTop: '160%'
  },
  button2: {  
    height:50,   
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    padding: '3%',  
     
  },
})