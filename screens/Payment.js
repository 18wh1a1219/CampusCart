import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase';
import { View, ImageBackground, TextInput, NativeModules, ScrollView, Image, Text, StyleSheet, Alert } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import RadioGroup from 'react-native-simple-radio-button';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNSmtpMailer from "react-native-smtp-mailer";
import { MenuProvider } from 'react-native-popup-menu';
import Loaddd from './Loaddd';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const UPI = NativeModules.UPI;
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
export default function Cart({ navigation, route }) {
    const [dest, setDest] = useState('');
  const [paymode, setPayMode] = useState('');
  const [loading, setLoading] = useState(true)

    const [cartProducts, setcartProducts] = useState([]);
    useEffect(() => {
        function fetchUserPosts() {
          firebase.firestore()
                .collection('Cartt')
                .doc(firebase.auth().currentUser.uid)
                .collection('cart')
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        firebase.storage()
                            .ref('/' + data.image)
                            .getDownloadURL()

                        return { ...data }
                    })                  
                    setcartProducts(posts);
                });
        }
        fetchUserPosts();
    },[]);
    const openLink = async () => {
        if(dest === ''){
          alert("Choose a delivery option");
        }
        if(paymode === ''){
          alert("Choose a mode of Payment");
        }       
        if(dest != '' && paymode === "Cash"){
          setLoading(false)
          cartProducts.forEach(d => {
          firebase
          .firestore().collection('posts').where("image", "==", d.image).get()
          .then((querySnapshot)=> {
            let id =0;
            querySnapshot.forEach((doc) => id = doc.id);
            firebase.firestore().collection('posts').doc(id).update({
                status: "sold",
                buyer: firebase.auth().currentUser.uid
              });
              firebase.firestore().collection('orders').doc().set({
                          productName: d.productName,
                          price: d.price,
                          buyer: firebase.auth().currentUser.uid,
                          seller: d.userId,
                          rating:0,
                  })
                  setTimeout(() => 
                  firebase.firestore().collection('posts').doc(id).get()
                  .then((querySnapshot) => {
                    let data = querySnapshot.data();
                    console.log(data.buyer,firebase.auth().currentUser.uid)
                    if(data.buyer === (firebase.auth().currentUser.uid)){
                      setLoading(true)
                  alert("Order Confirmed!!!")
                  navigation.navigate('Profile')
                    }
                    else{
                      setLoading(true)
                  alert("Sorry, the product is already booked ")
                  navigation.navigate('Profile')
                    }
                  }),
                  
                   6000)
                 
                  
                })
              })
              firebase.firestore().collection('Cartt/' +firebase.auth().currentUser.uid +  '/cart')
              .get()
              .then(res => {
              res.forEach(element => {
              element.ref.delete();
              });
                    })
     /* RNSmtpMailer.sendMail({
        username: "CampusCart00@gmail.com",
        password: "MajorProject",
        mailhost: "smtp.gmail.com",
        port: "465",
        ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
        fromName: "Campus Cart", // optional
        recipients: "18wh1a1219@bvrithyderabad.edu.in",
        subject: "Your Order is Confirmed!!!",
        htmlBody: "<p>Hi!<br>Thank you for placing an order in CampusCart. Please leave a feedback for seller after receiving the product.</p>",
        attachmentPaths: [
        ], // optional
        attachmentNames: [
        ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
      })
        .then(success => console.log(success))
        .catch(err => console.log(err));
          */
        }
        if(dest != '' && paymode === "Phonepe"){

      /*  cartProducts.foreach((x) => {
          firebase
      .firestore().collection('posts').where("image", "==", x.image).get()
    .then(function (querySnapshot) {
        let id =0;
        querySnapshot.forEach((doc) => id = doc.id);
        console.log(id);
        firebase.firestore().collection('posts').doc(id).update({
            status: "pending"
          });
          
    })
   
    .catch(function (error) {
        console.log("Error getting documents: ", error);
    });
        }
        )*/
         let UpiUrl =
            "phonepe://pay?pa=9652324155@ybl&pn=chandrika&tr=kdahskjahs275787fsdfasdas&am=1&mam=null&cu=INR&url=https://MyUPIApp&refUrl=https://MyUPIApp";
          let response = await UPI.openLink(UpiUrl);
          if(response === "failure"){
          //  firebase.firestore().collection('posts').doc(id).update({
            //    status: "available"
             // });
            }
            else{
              firebase.firestore().collection('Cartt/' +firebase.auth().currentUser.uid +  '/cart')
              .get()
              .then(res => {
              res.forEach(element => {
              element.ref.delete();
              });})
            /*  cartProducts.foreach((x) => {
                firebase
            .firestore().collection('posts').where("image", "==", x.image).get()
          .then(function (querySnapshot) {
              let id =0;
              querySnapshot.forEach((doc) => id = doc.id);
              console.log(id);
              firebase.firestore().collection('posts').doc(id).update({
                  status: "sold",
                  buyer: firebase.auth().currentUser.uid
                });
                
          })})*/
            }
           
          }}
          const [chosenOption, setChosenOption] = useState('');
          const options = [
            { label: 'Meet Offline', value: 'Meet Offline' },
            { label: 'Send to Address', value: 'Send to Address' },
          ];
          const [chosenPayOption, setChosenPayOption] = useState('');
          const payoptions = [
            { label: 'Cash', value: 'Cash' },
            { label: 'Phonepe', value: 'Phonepe' },
          ];

    return (
      <ImageBackground
      style={styles.background}
      source={require('../assets/Signing.png')}>
        { loading ? (
          <View>
      <Text style={{color:'white',fontSize:18 ,fontWeight:'500' ,marginBottom:'40%'}}> Thank you for shopping!!</Text>
      <View>
      <Text style={{color:'black' ,fontWeight:'500',fontSize:18}}> Choose  address for delivery  </Text>     
      
      <RadioGroup>
      <RadioForm
      buttonColor={'#00244c'}
      selectedButtonColor = {'#00244c'}
      style={{alignSelf:'center',marginTop:'2%', buttonColor:'#001d3d' }} 
       radio_props={options}
       initial={0} 
        onSelect={ () => {setDest(value) }}
        onPress={(value) => {
          setDest(value);
          setChosenOption(value);
        }}
      />
       <Text style={{alignSelf:'center' ,color:'darkblue',fontWeight:'600'}}> {chosenOption}</Text>
       <Text style={{marginTop:'5%',color:'black' ,ontWeight:'500',fontSize:18}}> Choose payment mode  </Text>
       </RadioGroup>
       <RadioGroup>
      <RadioForm
          buttonColor={'#00244c'}
          selectedButtonColor = {'#00244c'}
          style={{alignSelf:'center', marginLeft:'-9%',marginTop:'2%', buttonColor:'#001d3d' }} 
          radio_props={payoptions}
          initial={0} 
          onSelect={() => setPayMode(value)}            
          onPress={(value) => {
              setPayMode(value) ;
              setChosenPayOption(value);
            }} />
            </RadioGroup>
       <Text style={{alignSelf:'center',color:'darkblue',fontWeight:'600' }}> {chosenPayOption}</Text>
       <TouchableOpacity style={styles.paymentButton} onPress={()=>openLink()}>
            <Text style={{ fontWeight:'500',fontSize:17 ,color: "#00244c" }}>Make Payment</Text>
        </TouchableOpacity>
    </View>
    </View>) : (<Loaddd/>)  }
</ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'30%'
  },
  container: {paddingVertical:150,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  TextInput: { 
    width: "80%", 
    height: 40, 
    borderColor: "gray", 
    borderWidth: 1 },
    paymentButton: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",   
    marginTop:'10%',
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: '#ffd60a',
    borderRadius: 10,
    alignSelf: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
})