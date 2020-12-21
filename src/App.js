import React, { useState, useEffect } from 'react'
import { Button, Input, Modal } from '@material-ui/core';



import './App.css';
import Post from './components/Post'
import { auth, db } from './firebase'
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import MenuPopupState from './components/MenuPopupState'
import getUserLocale from 'get-user-locale'



import { makeStyles } from '@material-ui/core/styles';




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}`,
    left: `${left}`,
    transform: `translate(-${top}%,-${top}%)`
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: "50%",
    left: '50%',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 10,
  },

})
);

const Spinner = () => {
  <div className="post__">
    <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading" width="20" />
    <h5>Loading</h5>
  </div>
}

const locale = () => {
  if (getUserLocale().includes('pl')) {
    return (true)
  } else {
    return (false)
  }

}




function App() {
  const [posts, setPosts] = useState([])
  const [logged, setLogged] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  const [username, setUserName] = useState("")
  const [user, setUser] = useState(null)
  const classes = useStyles()
  const [modalStyle, setModalStyle] = useState(getModalStyle)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [lang, setLang] = useState(locale);




  const toggleLang = () => setLang(!lang);





useEffect(() => {
  db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })))
  })
}, [])

// ____________________________________________________________________

useEffect(() => {
  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      setUser(authUser)
      console.log(authUser)

      if (authUser.displayName) {
        // nie uaktualniaj imienia
      } else {
        // jeśli stworzyliśmy nowego
        return authUser.updateProfile({
          displayName: username
        })
      }
    } else {
      setUser(null)
    }
  })
}, [user, username])




const signUp = (event) => {
  event.preventDefault()

  auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
      setOpenSignUp(false)
    })
    .catch((error) => alert(error.message))
}


const signIn = (event) => {
  event.preventDefault()
  setOpenSignIn(true)
  console.log("hhihihi")

  auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

  setOpenSignIn(false)

}


// ____________________________________________________________________


// Rejestracja
return (
  <div className="app">

    <div className="app__header">


      <img
        className="app__headerImage"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />

      <div className="app__logIn">
        {!user ? (<Button onClick={() => setOpenSignIn(true)}>Zaloguj się</Button>)
          :
          (<Button onClick={() => auth.signOut()}>Wyloguj się</Button>)}

        <Button Button onClick={() => setOpenSignUp(true)}>Zarejestruj się</Button>
        <MenuPopupState
          topmenu={true}
          lang={lang}
          user={user}
          functiontopass={toggleLang}
          labeltopass={lang ? "English Version" : "Wersja Polska"}
          signout={() => auth.signOut()}
          signoutlabel={lang ? "Wyloguj" : "Logout"}
          signin={() => setOpenSignIn(true)}
          signinlabel={lang ? "Zaloguj się" : "Sign In"}
          signup={() => setOpenSignUp(true)}
          signuplabel={lang ? "Zarejestruj się" : "Sign Up"}

        />
      </div>
    </div>

    {/* Rejestracja */}

    <Modal
      className={modalStyle}
      open={openSignUp}
      onClose={() => setOpenSignUp(false)}

    >
      <div style={modalStyle} className={classes.paper}>
        <center>
          <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
        </center>
        <div className="app__inputs">
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
          <Input
            placeholder="email/login"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            placeholder="hasło"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button onClick={signUp}>Zarejestruj się</Button>


        </div>


      </div>


    </Modal>

    <Modal
      className={modalStyle}
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <center>
          <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
        </center>
        <div className="app__inputs">

          <Input
            placeholder="email/login"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            placeholder="hasło"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button onClick={signIn}>Zaloguj się</Button>

        </div>


      </div>


    </Modal>
    {/* Logowanie */}



    <div className="app_posts">

      <div className="app__postsLeft">
        {
          posts.map(({ id, post }) => (
            <Post
              user={user}
              key={post.id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}

            />
          ))
        }
      </div>


      <div className="app__postsRight">

        <InstagramEmbed
          url="https://instagr.am/p/CAX8psZMEdL_Lkto_rA_8oIhfVE1IJNLUobpkc0/"
          maxWidth={320}
          hideCaption={false}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => { }}
          onSuccess={() => { }}
          onAfterRender={() => { }}
          onFailure={() => { }}
        />

      </div>
    </div>


    <Post
      username="Maciej Kruszyniak"
      caption="Caption 1"
      imageUrl="https://www.jetsetter.com/wp-content/uploads/sites/7/2018/04/VUC2Bht0-1380x690.jpeg" />



    {user?.displayName ? (
      <ImageUpload
        username={user.displayName}
      />
    ) : (<h3>Przepraszam, musisz się najpierw zalogować</h3>)}




  </div >
);
}

export default App;
