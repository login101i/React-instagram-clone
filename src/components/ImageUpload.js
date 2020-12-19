import { Button } from '@material-ui/core'
import React, { useState } from 'react'


import { storage, db } from '../firebase'
import firebase from 'firebase'
import './imageUpload.css'

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        // This is what uploads the image to Firebase
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // Post image URL inside db
                        db.collection("posts").add({
                            // timestamp is used here to figure out the time the image was uploaded, which is gonna determine the order in which we display the posts (latest at the top)
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                         
                        });

                        // Reset everything once upload process is completed
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                 
                    })
            }
        )
    }
    return (
        <div className="imageupload">
            {/* <h1>{lang}</h1> */}
            <progress className="imageupload__progress" value={progress} max="100" />
            <br /><br />
            <input type="text" placeholder= 'Enter a caption' onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
            Upload
            </Button>
        </div>
    )
}

export default ImageUpload
