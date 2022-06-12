import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { View, ScrollView, Text, StyleSheet} from 'react-native';
import { Card,Title,Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loaddd from './Loaddd';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Cart({ navigation, route }) {
    const [cartProducts, setcartProducts] = useState([]);
    const [newArray, setnewArray] = useState([]);
    const [cond, setCond] = useState(true); 
     const [loading, setLoading] = useState(true)

    const isFocused = useIsFocused();

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
              cartProducts.forEach(obj => {
                  if (!newArray.some(o => o.image === obj.image)) {
                    newArray.push(obj)
                  }
                  if (!newArray.some(o => o.userId === obj.userId)) {
                      setCond(false)
                  }
              });
              setcartProducts(posts);
                });
        }

        isFocused && fetchUserPosts();

    },[isFocused]);

    const proceed = async() => {
      var h = 0
      cartProducts.forEach(x => {
        firebase.firestore().collection("posts").doc(x.id).get()
        .then(snapshot => {
          const data = snapshot.data()
          console.log(data)
          console.log(data.status)
          if(data.status === 'sold'){
            alert("An item is sold out")
            navigation.navigate('Cart')
          }
        })
        })
        navigation.navigate('Payment',  { paramKey: cartProducts})
    }

    const remove = (iid) => {
      
      setLoading(false)
     var count = -1
     firebase.firestore().collection('Cartt/'+firebase.auth().currentUser.uid+'/cart').get()
     .then(res => {
      console.log("hey")
       res.forEach(ele => {
        count = count + 1
        var j = ele.id
        console.log(j,iid)
         if((j === (iid)) || (j.localeCompare(iid))){
          firebase.firestore().collection('Cartt/'+firebase.auth().currentUser.uid+'/cart').get()
          .then(querySnapshot => {
              querySnapshot.docs[count].ref.delete().then(re => {
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
                  setLoading(true)

                  setcartProducts(posts);})
    });
         })}
       })
     })
}

    return (
      <View>
        
        { loading ? (
      <ScrollView>
        <View>
            {
                cartProducts.length > 0 ?
                    cartProducts.map((item, i) =>
                    <View>
                    <View style={{padding:5}}>
                    <View style={styles.card_template1}>
              <Card style = {styles.card_template1}>
            <Card.Content>
              <Title>{item.productName}
              </Title>
            
            </Card.Content  >
            <Card.Cover style = { styles.card_image1 } source={{uri: item.image}}  />
            <Text style={styles.card_title1}>{item.desc} </Text>
              <Text style={styles.card_title1}> {'\u20B9'}{item.price}</Text>
             <MaterialCommunityIcons onPress={() => remove(item.id)} style ={{top:'-40%',left:'65%'}} name="delete" size={56} color={'darkblue'} />
          </Card>  
           </View>
          </View>
          <View>
 </View>
         </View>           ) : <Text style={{ marginLeft: '10%', marginTop: '20%' }}> No items in cart</Text>}
                    <View>
                    {
                      cartProducts.length > 0 ? 
                      <TouchableOpacity  onPress={()=>proceed()}>
            <Button style={{backgroundColor:'#ffd60a', borderRadius:15, height:48,width:'80%',marginBotton:'2%',alignSelf:'center'
  }}><Text style={{ alignItems: "center",color:'darkblue'}}>Buy Now</Text></Button>
           </TouchableOpacity> : null
                    } 
       </View>
        </View>
        </ScrollView>)
         : (<Loaddd/>)}
         </View>
    );
}

const styles = StyleSheet.create({
  buttonText1: {
    fontSize:18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 365,
  },
    con:{
        marginTop:'2%'
      },
      name:{
        fontSize:18,
        color: 'black',
        fontWeight: 'bold',
        marginTop:-80,
        marginLeft:80,
        marginBottom:35
      },
      Sold:{
        color:'white'  
      },
    
      b1:{
        top : '0.5%',
        left: '-12%',
        marginTop:20,
      },
       card_template1:{
         width: '99%',
        height : 230,
        alignSelf:'center',
        marginBottom:'1%'
       },
       card_image1: {
         left: '5%',
         width: '40%',
         height: '55%',
         borderRadius : 10
       },
   
       card_title1: {
         top: '-55%',
         left: '50%',
          color: "black",
          fontStyle :'italic',
          fontSize :17
       },
       background1: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center'
       },
      
       buttonText1: {
         fontSize:18,
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
      input:{
        top: '2%'
      },
      div:{
        left: '15%',
        alignContent: 'center',
        height: '100%'
      },
    
     b:{
         top:'5%',
        left: '18%'
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
        left: '-15%',
        width: '100%',
        padding: 10,
        backgroundColor: '#ffd60a',
        borderWidth: 2,
        borderColor: '#ffd60a',
        borderRadius: 15,
        alignSelf: 'center',
        height:'30%',
        marginLeft:70,
      },
    
      buttonText: {
        fontSize:18,
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
})