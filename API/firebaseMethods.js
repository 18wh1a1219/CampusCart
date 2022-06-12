
import firebase from 'firebase';
import {Alert} from "react-native";
export async function registration(email, password, fullName, phone, address) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential)=>{
    userCredential.user.sendEmailVerification();
    Alert.alert("Email sent");
    });
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        uid: currentUser.uid,
        email: currentUser.email,
        fullName: fullName,
        phone: phone,
        count: 0,
        rating: 0,
        address: address
      });
    firebase.auth().signOut();
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}


export async function post(productName, desc, price, image, category, userName, userRating) {
  try {
    const currentUser = firebase.auth().currentUser;
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const uploadUri =  image.replace('file://', '');let formData = new FormData();
    const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
  };
  xhr.onerror = function() {
    reject(new TypeError("Network request failed"));
  };
  xhr.responseType = "blob";
  xhr.open("GET", image, true);
  xhr.send(null);
});
  const ref = firebase.storage().ref().child(filename);
  const task = ref.put(blob, { contentType: 'image/jpg' });
  task.on('state_changed', 
  (snapshot) => {
    console.log(snapshot.totalBytes)
  }, 
  (err) => {
    console.log(err)
  }, 
  () => {
    task.snapshot.ref.getDownloadURL().then((downloadURL) => {
      var newDocRef = firebase.firestore().collection('posts').doc();
      newDocRef.set({
                  productName: productName,
                  desc: desc,
                  price: price,
                  image: downloadURL,
                  category: category,
                  createdAt: new Date().toLocaleString(),
                  userId: firebase.auth().currentUser.uid,
                  userName: userName,
                  status: "available",
                  buyer: "",
                  rating:0,
                 id: newDocRef.id,
                 userRating: userRating
          })
  });
})
} catch(err) {
 console.log(err)
}
}


export async function signIn(email, password) {
  try{
    await firebase.auth().signInWithEmailAndPassword(email, password ).then(authUser => {
    if(authUser.user.emailVerified){ 
    } else{
      firebase.auth().signOut();
      Alert.alert('email not verified');
    }
    })
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}