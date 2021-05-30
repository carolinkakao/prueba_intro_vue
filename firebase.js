
import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDwRITV-VyMhoXFw2h6-jnMd6x6sd6P_HU",
    authDomain: "prueba-pizza-55dde.firebaseapp.com",
    projectId: "prueba-pizza-55dde",
    storageBucket: "prueba-pizza-55dde.appspot.com",
    messagingSenderId: "153680198782",
    appId: "1:153680198782:web:4e6273e461a3c33a546c2f",
    measurementId: "G-WEVRLXQMCH"
  };
  firebase.initializeApp(firebaseConfig);
  const db= firebase.firestore();
  firebase.analytics();
  export {firebaseConfig,db};
