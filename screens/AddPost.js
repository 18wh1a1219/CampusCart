import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ImageBackground, Image } from 'react-native';
import {  Alert, ScrollView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { post } from '../API/firebaseMethods';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { FloatingLabelInput } from './FloatingLabelInput';
import firebase from 'firebase';
import { Button , Card,} from 'react-native-paper';

export default function AddPost({ navigation }) {
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [productName, setProductName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRating, setUserRating] = useState(0);
  var [rating, setRating] = useState(0);
  var [count, setCount] = useState(0);
  var [avgrating,setAvgRating] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState([]);


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
          setUser(data)
        })
    }
    fetchUserPosts();

  }, [])

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'black',width:350 }]}>
          Choose Category
        </Text>
      );
    }
    return null;
  };

  const data = [
    { label: 'Books', value: 'Books' },
    { label: 'Stationary', value: 'Stationary' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothes', value: 'Clothes' },
    { label: 'Others', value: 'Others' }
  ];

  const emptyState = () => {
    setProductName('');
    setDesc('');
    setPrice('');
    setImage('');
    setValue('');
  };

  const handlePress = () => {
    if (!productName) {
      Alert.alert('Product Name is required');
    } else if (!desc) {
      Alert.alert('Product Description is required.');
    } else if (!price) {
      Alert.alert('Enter price ranging from 0.');
    } else if (!image) {
      Alert.alert('Choose an image');
    } else if (!value) {
      Alert.alert('Choose a category');
    } else {
      const data = firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          let data = querySnapshot.data();
          setUserName(data.fullName)
          setRating(data.rating)
          setCount(data.count)
          setAvgRating((data.rating/data.count).toFixed(2))
          post(
            productName,
            desc,
            price,
            image,
            value,
            fullName,
            (data.rating/data.count).toFixed(2)
          );
        })
      if (price === 0) {
        setPrice("Free")
      }
      emptyState();
      navigation.replace('hi');
    }
  };

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setImage(result.uri);
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setImage(result.uri)
    }
  }
 

  return (
    <ImageBackground
    style={styles.background}
    source={require('../assets/feeed.jpeg')}>
      <ScrollView  onBlur={Keyboard.dismiss}>
        <Card style={{backgroundColor:'white',width:'94%',margin:'8%',height:870,alignSelf:'center',borderRadius:10}}>
          <View style={{top:'1%'}}>
          <Image style={styles.img} source={require('../assets/more.png')}></Image>
          <View style={styles.buttonContainer}>
           <Button onPress={showImagePicker} >Select an image</Button>
          <Button onPress={openCamera} >Open  camera </Button>
            <View style={styles.imageContainer}>
              {
                pickedImagePath !== '' && <Image
                  source={{ uri: pickedImagePath }}
                  style={styles.image}
                />
              }
            </View>
            <View style={{left:'2%'}}> 
              <FloatingLabelInput
                label="Product Name *"
                value={productName}
                onChangeText={(productName) => setProductName(productName)}
              />
             
              <FloatingLabelInput
                label="Product Description *"
                value={desc}
                onChangeText={(desc) => setDesc(desc)}
                autoCapitalize="none"
              />

              <FloatingLabelInput
                label="Price *"
                value={price}
                onChangeText={(price) => setPrice(price)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.container1}>
              {renderLabel()}
              <Dropdown 
                style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Categories' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
          </View>
          </Card>
      </ScrollView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
    button: {
      width: 130,
      padding:5,
      backgroundColor: '#ffd60a',
      borderColor: '#ffd60a',
      borderRadius: 15,
      alignSelf: 'center',
      height:45
  },
  container1: {
    width: '78%',
    padding: 16,
  },
  dropdown: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '125%',
    marginLeft:-34
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    left: 22,
    zIndex: 999,
    paddingHorizontal: -26,
    fontSize: 15,
    marginLeft:-35
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  img: {
    height: 50,
    width: '15%',
    left: '40%'
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    padding: 10
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover'
  },
  container: {
    height: 700,
    width: '100%',
    backgroundColor: '#ECF3FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  buttonText: {
    fontSize: 18,
    color: 'darkblue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    width: 300,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#48494B',
    padding: 10,
    margin: 5,
  },
});