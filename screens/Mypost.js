import React, { useEffect, useState } from 'react';
import { View, ImageBackground, TextInput, ScrollView, Image, Text, StyleSheet, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import {loggingOut} from '../API/firebaseMethods';
import { Rating } from 'react-native-ratings';
import StepIndicator from 'react-native-step-indicator';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import track from './track';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export default function Profile({ prop }) {
    var value =prop.value;
    const changed = (value) => {

        if(value === "AllPosts"){
          firebase.firestore()
                      .collection("posts")
                      .where("userId","==",firebase.auth().currentUser.uid)
                      .orderBy("createdAt","desc")
                      .get()
                      .then((snapshot) => {
                          let posts = snapshot.docs.map(doc => {
                              const data = doc.data();
                              firebase.storage()
                              .ref('/' + data.image) 
                              .getDownloadURL()
                              .then((url) => {
                                console.log(url)
                              })
        
                              return { ...data }
                          })
                          setPost(posts)
                      })
                      setType(value);
        }
        else{
          firebase.firestore()
                      .collection("posts")
                      .where("buyer","==",firebase.auth().currentUser.uid)
                      .orderBy("createdAt","desc")
                      .get()
                      .then((snapshot) => {
                          let posts = snapshot.docs.map(doc => {
                              const data = doc.data();
                              firebase.storage()
                              .ref('/' + data.image) 
                              .getDownloadURL()
                              .then((url) => {
                                console.log(url)
                              })
        
                              return { ...data }
                          })
                          setPost(posts)
                      })
                      setType(value);
        }
        }
        

    return (
        <ScrollView>
            <View>
        {type === "AllPosts" ? (
            <View style={styles.b1}>
             {post.map((item, key)=>(<Text key = {key} >
                 <View style={{padding:5}}>
                 <View style={styles.card_template1}>
           <Card style = {styles.card_template1}>
         <Card.Content>
           <Title>{item.productName}</Title>
         </Card.Content  >
         <Card.Cover style = { styles.card_image1 } source={{uri: item.image}}  />
         <Text style={styles.card_title1}>Details: {item.desc} </Text>
           <Text style={styles.card_title1}>Price: {item.price}</Text>
           {item.status === "sold" ? (
             <Text style={styles.card_title1}>Sold out</Text>
           ) : null}
       
       </Card>  
        </View>
        </View></Text>))}
                   
           </View>) : <View style={styles.b1}>
             {post.map((item, key)=>(<Text key = {key} >
               
                 <View style={{padding:5}}>
                 <View style={styles.card_template1}>
           <Card style = {styles.card_template1}>
           
         <Card.Content>
           <Title>{item.productName}</Title>
         </Card.Content  >
         {item.rating == 0 ? (
           <View>
         <Rating
       showRating
       fractions={1}
       onFinishRating={ratingCompleted}
       readonly = {false}
       style={{ left:'-30%' }}
     />
     <TouchableOpacity onPress={()=>rate(item.image, item.userId)}>
             <Text >submit</Text>
            </TouchableOpacity>
           </View> ) :  (<Rating
       fractions={1}
       onFinishRating={ratingCompleted}
       readonly = {true}
       startingValue = {item.rating}
       style={{ left:'-30%' }} />)}
     <TouchableOpacity onPress={()=>navigation.navigate('Track')}>
             <Text >track</Text>
            </TouchableOpacity>
            <View style={styles.con}>
                 <Text style={styles.card_title1}>Seller: {item.userName} </Text>
         <Text style={styles.card_title1}>Details: {item.desc} </Text>
           <Text style={styles.card_title1}>Price: {item.price}</Text>
           
           </View>
       </Card>  
        </View>
        </View></Text>))}
                   
           </View>}
            </View>
           </ScrollView>
    );
}