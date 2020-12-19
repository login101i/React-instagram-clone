import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyCwgRmGfyDtDq8CeLuZzJTiXpGqyxQ_svc",
    authDomain: "instgram-clone-mckrus.firebaseapp.com",
    projectId: "instgram-clone-mckrus",
    storageBucket: "instgram-clone-mckrus.appspot.com",
    messagingSenderId: "952132720540",
    appId: "1:952132720540:web:75317a34e45ce97ebb5a59",
    measurementId: "G-8KBTF2J9XS"
})


const db=firebaseApp.firestore()
const auth=firebase.auth()
const storage=firebase.storage()


export  {db, auth, storage}

