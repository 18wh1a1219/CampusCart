import React, { useState, useRef, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Chat({ navigation, route }) {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const scrollRef = useRef();
  const user1 = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users").onSnapshot((querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().email != firebase.auth().currentUser.email) {
          users.push(doc.data());
        }
      });
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    if (route.params.paramKey && users.length > 0) {
      selectUser(route.params.paramKey);
    }
  }, [route.params.paramKey, users])
  const open = () => {
    Linking.openURL('paytm://')
        .catch(() => {
            Linking.openURL('https://www.paytm.com');
        })
}

  const selectUser = async (user) => {
    const selectedUserDetails = users.find(user => user.fullName === route.params.paramKey);
    setChat(selectedUserDetails);
    const user2 = selectedUserDetails.uid;
    const id = user1 > user2 ? user1 + user2 : user2 + user1;
    await firebase.firestore().collection("messages").doc(id).collection("chat").orderBy("createdAt", "asc").onSnapshot((querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      for(let i = 0;i < msgs.length;i++){
        let mssgg = "";
        for(let j = 0;j < msgs[i].text.length;j++){
            mssgg += String.fromCharCode(msgs[i].text.charCodeAt(j) - 3);
        }
        msgs[i].text = mssgg;
      }
      setMsgs(msgs);
    });
  }

  const handlePress = async (e) => {
    if(text === ''){
      alert("Enter a message")
    }
    else{
    setMsg(text);
    const user2 = chat.uid;
    const id = user1 > user2 ? user1 + user2 : user2 + user1;
    msgs.push({
      text: text,
      from: user1,
      to: user2,
      createdAt: new Date().toLocaleString()
    })
    let msgg = "";
    for(let i =0; i < text.length; i++){
      msgg += String.fromCharCode(text.charCodeAt(i) + 3);
    }
    await firebase
      .firestore()
      .collection("messages")
      .doc(id)
      .collection("chat")
      .add({
        text: msgg,
        from: user1,
        to: user2,
        createdAt: new Date().toLocaleString()
      });
    setText("");
    }
  };

  return (
    <View style={{height:'100%',backgroundColor:'#F0F0F0'}}>
    <ScrollView>
      <Text style={styles.name}>{chat ? chat.fullName : 'Start the conversation'}</Text>
      <View></View>
      <View style={{top:'6%',margin:'3%'}}>
              {msgs.length
                ? msgs.map((msg, i) => (
                  <View  style={{flex: 1}} >
                    {msg.from != chat.uid ? <View style={{flexDirection:'row'}}><Text style={styles.sender}>{msg.text} </Text></View> : <View style={{flexDirection:'row'}}><Text style={styles.receiver}>{msg.text} </Text></View>}
                  </View>
                ))
                : null}
          <TextInput
              style={styles.textInput}
              placeholder="Enter a message"
              value={text}
              onChangeText={(text) => setText(text)}
            />
          <TouchableOpacity style={styles.button2} onPress={handlePress}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  name: {
    top: '2%',
    fontWeight:'bold',
    alignSelf: 'center',
    color:'black',
    position:'relative'
  },
  sender: { 
    alignSelf:'flex-end',
    right: '-1%',
    padding: '4%',
    flex: 1,
    borderWidth: 1,    flexWrap: 'wrap',
    width:30  ,
    backgroundColor: "#001d3d",
    padding:10,
    marginLeft: '45%',
    color:'white',
    marginTop: 5,
    marginRight: "5%",
    maxWidth: '50%',
    alignSelf: 'flex-end',
    borderColor: '#001d3d',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderRadius: 20,
    },
  receiver: {
    left: '3%',
    padding: '4%',
    margin: 5,
    flex: 1, 
    flexShrink: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
    color: "black",
    padding:10,
    marginLeft: '2%',
    borderRadius: 5,
    marginTop: 5,
    marginRight: "5%",
    maxWidth: '50%',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 0,
    borderRadius: 20,
  },
  buttonText:{
   alignSelf:'center'
  },
  textInput: {
    width: '96%',
    fontSize: 15,
    borderWidth: 2,
    borderColor: 'lightgray',
    padding: 10,
    height:50,
    color:'black',
    borderRadius:10,
    left:'0%',
    margin:'1%',
  },
  card_template: {
    height: 250,
    marginTop: '-60%',
    left: '10%',
  },
  b: {
    marginTop: '160%'
  },
  button2: {
    width: '30%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    padding: 5,
    margin: '2%',
    marginBottom:'25%',
    alignSelf:'flex-end'
  },
  button: {
    width: 150,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffd60a',
    backgroundColor: '#ffd60a',
    padding: 5,
    margin: '2%',
  }
})