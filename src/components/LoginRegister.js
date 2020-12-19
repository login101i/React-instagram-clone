import React ,{useState} from 'react'


import { auth} from '../firebase'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, Modal } from '@material-ui/core';



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


function ModalLogin() {
    const classes = useStyles()

    const [modalStyle, setModalStyle] = useState(getModalStyle)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [openSignIn, setOpenSignIn] = useState('')
    const [username, setUserName] = useState("")
    const [openSignUp, setOpenSignUp] = useState(false)



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

        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message))

        // openSignIn(false)
    }
    return (

        <>

            <Modal
                // className={modalStyle}
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
                // className={modalStyle}
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
        </>
    )
}

export default ModalLogin
