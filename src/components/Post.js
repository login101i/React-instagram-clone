import { Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'


import { db } from '../firebase'
import './post.css'

function Post({ username, caption, imageUrl, postId }) {
    const [comments, setComments] = useState('')
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);


    const postComment = (event) => {
        event.preventDefault()
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

            <div className="post__commentBox">
                <form>
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Twój komentarz"
                        value={comment}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </form>
                <button
                    classNme="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick="postComment"
                >
                    Opublikuj
            </button>

            </div>
        </div>


    )
}

export default Post
