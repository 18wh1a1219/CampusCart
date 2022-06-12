import React, { useEffect, useState } from 'react';
import { View, ImageBackground, TextInput, ScrollView, Image, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import { loggingOut } from '../API/firebaseMethods';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


export default function UserProfile({ navigation, route }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState([]);
  const [rating, setRating] = useState(0);
  const [post, setPost] = useState([]);

  var [avgrating,setAvgRating] = useState(0);
  useEffect(() => {

    function fetchUserPosts() {
      firebase.firestore()
        .collection("posts")
        .where("userId", "==", route.params.paramKey)
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
          setPost(posts)
        })
    }
    fetchUserPosts();

  }, [])
  useEffect(() => {

    function fetchUserPosts() {
      const data = firebase.firestore()
        .collection("users")
        .doc(route.params.paramKey)
        .get()
        .then((querySnapshot) => {
          let data = querySnapshot.data();
          setFullName(data.fullName)
          setEmail(data.email)
          setPhone(data.phone)
          setRating(data.rating)
          setUser(data)
          setAvgRating((data.rating/data.count))
        })
    }
    fetchUserPosts();

  }, [])

  

  return (
    <ScrollView >
      <View style={styles.div}>
        <Image style={styles.card_image} source={require('../assets/human.png')} />
        <Text style={{color:'black',fontSize:16,fontWeight:'500',alignSelf:'center',top:'-3%'}}>{fullName}   <Image style={styles.img} source={require('../assets/star.png')}></Image> {avgrating.toFixed(2)}</Text>
        
        <Text style={{color:'black',fontSize:16,fontWeight:'500',alignSelf:'flex-start'}}>POSTS</Text> 
          <View style={styles.b1}>
            {post.map((item, key) => (<Text key={key} >
              <View style={{ padding: 5 }}>
                <View style={styles.card_template1}>
                  <Card style={styles.card_template1}>
                    <Card.Content>
                      <Title>{item.productName}</Title>
                    </Card.Content  >
                    <Card.Cover style={styles.card_image1} source={{ uri: item.image }} />
                    <Text style={styles.card_title1}> {item.desc} </Text>
                    <Text style={styles.card_title1}>{'\u20B9'} {item.price}</Text>
                    {item.status === "sold" ? (
     <Text style={{
                        top:  '-60%',
                        marginLeft: '56%',
                        borderRadius: 10,
                        color: "black",
                        height:30,
                        fontStyle: 'italic', padding: 4,paddingLeft:4,
                        fontSize: 15, backgroundColor: 'red', color: 'white', width: '23%'
                      }}>SOLD OUT</Text>
      ) : null}
                  </Card>
                </View>
              </View></Text>))}

          </View>
        </View>
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 24,
    width: 24
  }, b1: { 
    left: '-12%',
    marginTop: 20,
  },
  card_template1: {
    width: 380,
    height: 230,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,

  },
  Sold: {
    color: 'white',
  },
  card_image1: {
    marginTop:'2%',
    left:'2%',
    width: '48%',
    height: '65%',
    borderRadius: 10,

  },


  card_title1: {

    top: '-62%',
    left: '57%',
    color: "black",
    fontStyle: 'italic',
    fontSize: 15
  },
  background1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    top: '5%'
  },
  div: {
    left: '15%',
    alignContent: 'center',
    height: '100%'
  },

  b: {
    top: '5%',
    left: '18%'
  },
  card_template: {
    width: 380,
    height: 230,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  card_image: {
    width: 100,
    height: 100,
    borderRadius: 45, 
    left: '-5%',
    backgroundColor: 'white'
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
    left: '-12%',
    width: 120,
    padding: 5,
    backgroundColor: '#B6DCB6',
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