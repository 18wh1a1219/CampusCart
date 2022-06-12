import React, { useEffect, useState } from 'react';
import { View, ImageBackground,TouchableOpacity, TextInput, ScrollView, Image, Text, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import { loggingOut } from '../API/firebaseMethods';
import { Rating } from 'react-native-ratings';
import StepIndicator from 'react-native-step-indicator';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import track from './track';
import { useIsFocused } from '@react-navigation/native';

export default function Profile({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('AllPosts');
  const [address, setAddress] = useState('');
  const isFocused = useIsFocused();
  var [rating, setRating] = useState(0);
  var [count, setCount] = useState(0);
  var [avgrating, setAvgRating] = useState(0);
  const [user, setUser] = useState([]);
  const [mypost, setMyPost] = useState([]);
  const [bought, setBought] = useState([]);
  const [valueSelected, setValueSelected] = useState('');
  useEffect(() => {

    function fetchUserPosts() {
      const data = firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          let data = querySnapshot.data();
          setFullName(data.fullName)
          setEmail(data.email)
          setPhone(data.phone)
          setAddress(data.address)
          setRating(data.rating)
          setCount(data.count)
          setAvgRating((data.rating / data.count))
          setUser(data)
        })

    }
    isFocused && fetchUserPosts();

  }, [isFocused])

  useEffect(() => {

    function fetchUserPosts() {
      firebase.firestore()
        .collection("posts")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
              .then((url) => {
              })

            return { ...data }
          })
          setMyPost(posts)
        })
      firebase.firestore()
        .collection("posts")
        .where("buyer", "==", firebase.auth().currentUser.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
              .then((url) => {
              })

            return { ...data }
          })
          setBought(posts)
        })


    }
    isFocused && fetchUserPosts();

  }, [isFocused])


  const ratingCompleted = (rating) => {
    setRating(rating);
  }

  const rate = (image, userId) => {
    alert('Rating submitted')
    navigation.replace('Profile')
    firebase.firestore().collection('posts').where("image", "==", image).get()
      .then(function (querySnapshot) {
        let id = 0;
        querySnapshot.forEach((doc) => id = doc.id);
        firebase.firestore().collection('posts').doc(id).update({
          rating: rating
        });
        const data = firebase.firestore()
          .collection("users")
          .doc(userId)
          .get()
          .then((querySnapshot) => {
            let data = querySnapshot.data();
            let r = data.rating + rating
            let c = data.count + 1
            firebase.firestore().collection("users").doc(userId).update({
              rating: r,
              count: c
            })
            firebase.firestore().collection("posts").where("userId", "==", userId).get()
              .then(snapshot => {
                snapshot.forEach(x => {
                  firebase.firestore().collection("posts").doc(x.id).update({
                    userRating: ((data.rating + rating) / (data.count + 1)).toFixed(2)
                  })
                })
              })

          })

          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      })


  }

  const changed = (value) => {
    setValueSelected(value);
    if (value === "AllPosts") {
      setType(value);
      firebase.firestore()
        .collection("posts")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
              .then((url) => {
              })

            return { ...data }
          })
          setMyPost(posts)
        })

    }
    else {
      setType(value);
      firebase.firestore()
        .collection("posts")
        .where("buyer", "==", firebase.auth().currentUser.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
              .then((url) => {
              })

            return { ...data }
          })
          setBought(posts)
        })
    }
  }

  const handlePress = () => {
    loggingOut();
    navigation.replace('Home');
  };

  const handlePresss = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        fullName: fullName,
        email: email,
        phone: phone,
        address: address
      })
      .then(() => {
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.'
        );
      })
    firebase
      .firestore()
      .collection('posts')
      .where("userId", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(x => {
          firebase.firestore().collection('posts').doc(x.id).update({ userName: fullName })
        }
        )
      })
  };

  return (
    <ScrollView >
      <View style={styles.div}>
        <Image style={styles.card_image} source={require('../assets/human.png')} />
        <Text style={styles.name}>Hi {fullName}!! <Image style={styles.img} source={require('../assets/star.png')}></Image>{avgrating.toFixed(2).toString()}  </Text>
        <TouchableOpacity style={styles.button2} onPress={handlePress}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.input}>
          <View style={styles.box}>
            <Text style={styles.heading}>Update your Details</Text>
            <TextInput style={styles.formInput} placeholder="Full Name*" value={fullName} onChangeText={(fullName) => setFullName(fullName)} />
            <TextInput style={styles.formInput} placeholder="Phone Number*" value={phone} onChangeText={(phone) => setPhone(phone)} autoCapitalize="none" />
            <TextInput style={styles.formInput} placeholder="Email*" value={email} onChangeText={(email) => setEmail(email)} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.formInput} placeholder="Address*" value={address} onChangeText={(address) => setAddress(address)} />
            <TouchableOpacity style={styles.button} onPress={handlePresss}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity style={{flexDirection:'row'}} >
            <Button style={{ flex:1, borderRadius: 15, marginLeft: '0%',marginRight:'2%', marginTop: '16%', alignSelf: 'flex-start', justifyContent: 'space-evenly', backgroundColor: valueSelected === "AllPosts" ? '#ffd60a' : 'white' }} onPress={() => changed("AllPosts")} > posts</Button>
            <Button style={{ flex: 1, borderRadius: 15, marginRight: '25%', marginTop: '-9.5%', alignSelf: 'flex-end', justifyContent: 'space-around', backgroundColor: valueSelected === "Bought" ? '#ffd60a' : 'white' }} onPress={() => changed("Bought")}> purchases</Button>
          </TouchableOpacity>
        </View>
        {type === "AllPosts" ? (
          <View style={styles.b1}>
            {mypost.map((item, key) => (<Text key={key} >
              <View style={{ padding: 5 }}>
                <View style={styles.card_template1}>
                  <Card style={styles.card_template1}>
                    <Card.Content>
                      <Title >{item.productName}</Title>
                    
                    </Card.Content  >
                    <Card.Cover style={styles.card_image1} source={{ uri: item.image }} />
                    <Text style={{
                      top: '-70%',
                      left: '2%',
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 18
                    }}> {item.desc} </Text>
                    <Text style={{
                      top: '-70%',
                      left: '3%',
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 18
                    }}>{'\u20B9'} {item.price}</Text>
                    {item.status === "sold" ? (
                      <Text style={{
                        top: '-70%',
                        left: '2%',
                        borderRadius: 10,
                        color: "black",
                        height: 30,

                        fontStyle: 'italic', padding: 4, paddingLeft: 4,
                        fontSize: 15, backgroundColor: 'red', color: 'white', width: '23%'
                      }}>SOLD OUT</Text>
                    ) : null}
                  </Card>
                </View>
              </View></Text>))}
          </View>) : <View style={styles.b1}>
          {bought.map((item, key) => (<Text key={key} >
            <View style={{ padding: 5 }}>
              <View style={styles.card_template1}>
                <Card style={styles.card_template1}>
                  <Card.Content>
                    <Title style={{ flexWrap: 'wrap',alignSelf:'flex-start'}}>{item.productName}</Title>
                    <TouchableOpacity style={{  top: '-80%', alignSelf: 'center', backgroundColor: '#ffd60a' }} onPress={() => navigation.navigate('Track')}>
                    <Button style={{}} >track</Button>
                  </TouchableOpacity>
                  </Card.Content  >
                  {item.rating == 0 ? (
                    <View>
                      <Rating
                        showRating
                        fractions={1}
                        onFinishRating={ratingCompleted}
                        readonly={false}
                        style={{ alignSelf: 'flex-start', top:'-25%' }}
                      />
                      <Button style={{backgroundColor:'#ffd60a' ,alignSelf:'flex-start',width:'30%',marginLeft:'1%',marginTop:'-10%'}} onPress={() => rate(item.image, item.userId)}>submit</Button>
                      <View style={{ marginLeft:'60%' }}>
                    <View style={styles.con}>
                      <Text style={{  top:'-240%',
                      right: '2%',
                      fontSize: 18,
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 15}}> {item.userName} </Text>
                      <Text style={{  top: '-240%',
                      right: '2%',
                      fontSize: 18,
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 15}}>{item.desc} </Text>
                      <Text style={{  top: '-240%',
                      right: '2%',
                      fontSize: 18, flexWrap: 'wrap',
                      color: "black",
                      fontStyle: 'italic',
                      fontSize: 15}}>{'\u20B9'} {item.price}</Text>
                    </View>
                  </View>
                    </View>) :
                   
                    (<View>
                    <Rating
                      fractions={1}
                      onFinishRating={ratingCompleted}
                      readonly={true}
                      startingValue={item.rating}
                      style={{ alignSelf: 'flex-start',top:'-3%'}} />
                      <View style={{ marginLeft:'60%' }}>
                    <View style={styles.con}>
                      <Text style={{  top:'-160%',
                      right: '2%',
                      fontSize: 18,
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 15}}> {item.userName} </Text>
                      <Text style={{  top: '-160%',
                      right: '2%',
                      fontSize: 18,
                      color: "black", flexWrap: 'wrap',
                      fontStyle: 'italic',
                      fontSize: 15}}>{item.desc} </Text>
                      <Text style={{  top: '-160%',
                      right: '2%',
                      fontSize: 18, flexWrap: 'wrap',
                      color: "black",
                      fontStyle: 'italic',
                      fontSize: 15}}>{'\u20B9'} {item.price}</Text>
                    </View>
                  </View>
                  </View>
                 )}
                  
                </Card>
              </View>
            </View></Text>))}
        </View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 24,
    width: 24
  }, con: {
    top: 40,
    
  },
  name: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: '-20%',
    marginLeft: '19%',
    marginBottom: '6%'
  },
  Sold: {
    color: 'white'
  },
  box: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: 360,
    marginLeft: '-15%',
    alignItems: 'center',

  },
  heading: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: '3%',

  },
  b1: {
    top: '0.5%',
    left: '-12%',
    marginTop: 20,
  },
  card_template1: {
    width: 380,
    height: 200,
    
  },
  card_image1: {
    left: '-6%',
    bottom: '6%',
    width: '45%',
    height: 150,
    borderRadius: 10,
    alignSelf: 'flex-end'
  },
  text_container1: {
    position: "absolute",
    width: 250,
    height: 100,
    bottom: 0,
    padding: 5,
    backgroundColor: "rgba(0,0,0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  card_title1: {
    top: '-70%',
    left: '2%',
    color: "black",
    fontStyle: 'italic',
    fontSize: 15
  },
  background1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button1: {
    left: 250,
    width: 120,
    padding: 0,
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',

  },
  buttonText1: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 365,
  },
  container1: {
    height: '100%',
    width: '100%',
    backgroundColor: '#c0f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: '2%',
    marginBottom: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
  titleText1: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    top: '-23%',
    left: '-30%'
  },
  input: {
    top: '2%'
  },
  div: {
    left: '15%',
    alignContent: 'center',
    height: '100%'
  },
  formInput: {
    width: '90%',
    fontSize: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderColor: '#48494B',
    padding: '2.5%',
    margin: '1.25%',
  },
  b: {
    top: '5%',
    left: '18%'
  },
  card_template: {
    width: 250,
    height: 900
  },
  card_image: {
    width: '25%',
    height: 100,
    borderRadius: 80,
    left: '-10%',
    top: '2%',
    backgroundColor: '#ffffff',
  },
  text_container: {
    position: "absolute",
    width: 250,
    height: 100,
    bottom: 0,
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  card_title: {
    color: "black"
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    top: '35%',

    width: 380,
    padding: '2%',
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: '#ffd60a',
    borderRadius: 15,
    alignSelf: 'center',
    height: 50,
  },
  button2: {
    top: '-19%',
    width: '65%',
    padding: '2%',
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: '#ffd60a',
    borderRadius: 15,
    alignSelf: 'center',
    height: 50,
    marginRight: '64%',
    marginLeft: '62%'
  },
  button3: {
    top: '-35%',
    width: 120,
    padding: 5,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'red',
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'center',
    height: 50,
    color: 'white',
    marginRight: 290,
    marginLeft: 170
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