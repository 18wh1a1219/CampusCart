import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ScrollView, Image, Text, StyleSheet, Object, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import { loggingOut } from '../API/firebaseMethods';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Cart from './Cart'
import { Dropdown } from 'react-native-element-dropdown';
import { propTypes } from 'react-native-radio-buttons/lib/radio-buttons';
import { useIsFocused } from '@react-navigation/native';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import Loaddd from './Loaddd';
export default function Feed({ navigation }) {
  const [Name, setName] = useState(null);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [allPosts, setAllPosts] = useState('');
  const [post, setPost] = useState([]);
  const [r, setR] = useState([]);
  const isFocused = useIsFocused();
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [avgrating,setAvgRating] = useState(0);
  var [category, setCategory] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [docId, setDocId] = useState('');
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    function fetchUserPosts() {
      setCategory('All')
      firebase.firestore()
        .collection("posts").orderBy("createdAt", "desc")
        .where("status", "==", "available")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
             firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
            return { ...data }
          })
          setAllPosts(posts)
          setPost(posts)
        })
        .catch(() => {
          console.log("Handled")
        }
        )
    }
    isFocused && fetchUserPosts();

  }, [isFocused])

  const payinit = (image) => {
    firebase
      .firestore().collection('posts').where("image", "==", image).get()
      .then(function (querySnapshot) {
        let id = 0;
        querySnapshot.forEach((doc) => id = doc.id);
        console.log(id);
        setDocId(id);
        firebase.firestore().collection('posts').doc(id).update({
          status: "pending"
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    navigation.navigate('Payment', { id: docId });
  }

  const change = (value) => {
    if (value === 'All') {
      firebase.firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .where("status", "==", "available")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            firebase.storage()
              .ref('/' + data.image)
              .getDownloadURL()
            return { ...data }
          })
          setAllPosts(posts)
          setPost(posts)
        })
        .catch(() => {
        }
        )
    }
    else {
      setPost(allPosts.filter(item => value === item.category))
    }
  };

  const renderLabel = () => {
    if (category || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'black' }]}>
          Choose Category
        </Text>
      );
    }
    return null;
  };

  const data = [
    { label: 'All', value: 'All' },
    { label: 'Books', value: 'Books' },
    { label: 'Stationary', value: 'Stationary' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothes', value: 'Clothes' },
    { label: 'Others', value: 'Others' }
  ];

  const handlePress = (username) => {
    setName(username)
  }

  let Product = [];
  const addToCart = (image) => {
    setLoading(false)
    let d =firebase
      .firestore().collection('posts').where("image", "==", image).get().then((querySnapshot) => {
        let id =0;
        console.log("heyyyy")
        querySnapshot.forEach((doc) => id = doc.id);
        setDocId(id);
        const data = firebase.firestore()
              .collection("posts")
              .doc(id)
              .get()
              .then((querySnapshot) => {
                    let data = querySnapshot.data();
                    firebase.firestore()
                    .collection('Cartt')
                    .doc(firebase.auth().currentUser.uid)
                    .collection('cart')
                    .get()
                    .then(snapshot => {
                      if(snapshot.empty){
                        firebase.firestore()
                        .collection('Cartt')
                        .doc(firebase.auth().currentUser.uid)
                        .collection('cart')
                        .doc(id).set(data).then(()=>{
                          setLoading(true)

                              alert("Successfully added to Cart");
                      })}
                      else{
                        firebase.firestore().collection('Cartt')
                        .doc(firebase.auth().currentUser.uid)
                        .collection('cart')
                        .get().then((querySnapshot) => {
                          querySnapshot.forEach(snapshot => {
                              let doc = snapshot.data();
                          if(doc.userId === data.userId){
                            firebase.firestore()
                        .collection('Cartt')
                        .doc(firebase.auth().currentUser.uid)
                        .collection('cart')
                        .doc(id).set(data).then(()=>{
                          setLoading(true)
                              alert("Successfully added to Cart");
                              
                      })
                        
                        }
                        else{
                          setLoading(true)

                          alert('Seller must be same to buy all at once');
                        }
                          })
                      })
                    }
                    });                                
                  })
                })   
      }
  const handleAddToCart = (item) => {
    addToCart(item);
  }
  return (
    <ImageBackground  source={require('../assets/feeed.jpeg')} resizeMode="stretch" style={styles.image}>
   
   { loading ? (
    <ScrollView >
      <View style={styles.container1}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'darkblue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Categories' : '...'}
          searchPlaceholder="Search..."
          value={category}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCategory(item.value);
            change(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <View style={styles.b}>
        {post.map((item, key) => (<Text key={key} >
          {item.userId != firebase.auth().currentUser.uid ? (
            <View style={{ padding: 5 }}>
              <Card style={{
                shadowColor: "#000",
                marginBottom: -5,
                width:330,
                height:500,
                marginLeft:10,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.60,
                shadowRadius: 4.75,
                elevation: 8,
                borderRadius: 20
              }}>
                <Card.Content>
                  <Card.Actions>
                    <Button style={{ alignSelf: 'center', marginTop: '-2%' }} onPress={() => navigation.navigate('UserProfile', { paramKey: item.userId })}><Text style={{color:'darkblue',marginLeft:'10%'}}>{item.userName}  <Image style={styles.img} source={require('../assets/star.png')}></Image>{item.userRating} </Text>
                    </Button>
                  </Card.Actions>
                </Card.Content>    
                <Card.Cover style={styles.card_image} source={{ uri: item.image }} />
                <Text style={styles.card_title}> Product: {item.productName}</Text>                         
                <Text style={styles.card_title}> Category: {item.category} </Text>               
                <Text style={styles.card_title}> Description: {item.desc} </Text>
                <Text style={styles.card_title}> Price: {'\u20B9'} {item.price}</Text>
                <Card.Actions>
                  <Button style={styles.button} onPress={() => addToCart(item.image)} ><Text style={styles.Book} >Add to Cart</Text></Button>
                </Card.Actions>
                <Card.Actions>
                  <Button style={styles.button1} onPress={() => navigation.navigate('Chat', { paramKey: item.userName })}><Text style={styles.Book} >Book</Text></Button>
                </Card.Actions>
              </Card>
              <Text></Text></View>) : null}</Text>))}
      </View>
    </ScrollView>) : (
<Loaddd/>
    )}
    </ImageBackground> 
  );
}

const styles = StyleSheet.create({
  img: {
    height: 24,
    width: 24
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:null,
    width: '100%'
  },
 
  Book: {
    fontSize: 12,
    color: 'darkblue'
  },
  container1: {
    backgroundColor: 'white',
    padding: 16,
    fontFamily: 'Montserrat-Italic'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    alignSelf:'center',
    width: '80%',
    marginTop:'3%'  
  },
  icon: {
    marginRight: '2%',
  },
  label: {
    position: 'absolute',
    left: '6%',
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    marginTop: '1%',
    paddingLeft: '17%'
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: '9%',
    height: '25%',
  },
  inputSearchStyle: {
    height: '30%',
    fontSize: 16,
  },
  b: {
    top: '0.5%',
    width: '100%'
  },
 
  card_image: {
    width: '80%',
    height: '47%',
    borderRadius:5,
    alignSelf: 'center',   
  },
 
  card_title: {
   
    left: '9%',
    color: "black",
    fontFamily: 'Montserrat-Italic',
    fontSize: 15,
    padding: '1%'
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    top: '-2%',
    width: '45%',
    marginLeft: '9%',
    padding: 0,
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  button1: {
    top:'-21%',
    marginLeft: '60%',
    width: '35%',
    padding: 0,
    backgroundColor: '#ffd60a',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#0b2b4f',
    textAlign: 'center',
    padding:'5%',
    color: 'darkblue',   
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#001d3d',
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
    color: 'darkblue',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'darkblue',
    top: '-23%',
    left: '-30%'
  },
});