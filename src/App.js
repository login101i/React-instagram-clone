import React, { useState, useEffect } from 'react'
import { Button, Input, Modal } from '@material-ui/core';



import './App.css';
import Post from './components/Post'
import { auth, db } from './firebase'
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import LoginRegister from './components/LoginRegister'







function App() {
  const [posts, setPosts] = useState([])
  const [openSignUp, setOpenSignUp] = useState(false)
  const [logged, setLogged] = useState(false)
  const [openSignIn, setOpenSignIn] = useState('')

  const [username, setUserName] = useState("")
  const [user, setUser] = useState(null)


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
        </div>
      </div>

      {/* Rejestracja */}

   
      {/* Logowanie */}

      <LoginRegister
      
      />


      <div className="app_posts">

        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post
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
