import { Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'


import { db } from '../firebase'
import './post.css'
import firebase from 'firebase'

function Post({ username, caption, imageUrl, postId, user }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState([])

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("123")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }
        return () => {
            // unsubscribe();
            console.log(comments)

        };
    }, [postId]);
    console.log(comments)


    const postComment = (event) => {
        event.preventDefault()
        db.collection("posts").doc(postId).collection('123').add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }


    return (
        <div className="post">
            <div className="post__header">

                <Avatar
                    className="post__avatar"
                    alt={username}
                    src={imageUrl}
                />
                <h3 className="post__username">{username}</h3>
            </div>
            <img
                className="post__image"
                src={imageUrl} alt="" />
            <h4 className="post__text">{caption} <strong>{username}</strong></h4>


            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>{comment.comment}
                    </p>
                ))}
            </div>
            {user &&
                <form>
                    <div className="post__commentBox">

                        <input
                            className="post__input"
                            type="text"
                            placeholder="Twój komentarz"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            className="post__button"
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                            Opublikuj
                  </button>


                    </div>
                </form>
            }


        </div >


    )
}

export default Post
