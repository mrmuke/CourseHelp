import React, { useState, useEffect } from 'react';
//import { render } from 'react-dom';
import { Text, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-paper';
import EditForum from './EditForum';
import CommentForum from './CommentForum'
import 'react-native-get-random-values';
import CategoryPicker from '../components/CategoryPicker'

export default function Forum() {
    const [postData, setPostData] = useState(null)
    const [user, setUser] = useState(null)
    const [create, setCreate] = useState(false)
    const [comment, setComment] = useState(false)
    const [forum, setForum] = useState(null)
    //const [votes, setVotes] = useState(0)
    const [upvote, setUpvote] = useState([])
    const [downvote, setDownvote] = useState([])
    const [category, setCategory] = React.useState('all')
    const userUID = firebase.auth().currentUser.uid
    useEffect(() => {
        getPosts('all')
        getUser()
    }, [])


    function Votes(type) {
        let upRef = firebase.database().ref('forum/' + forum.id + '/upvotes')
        let downRef = firebase.database().ref('forum/' + forum.id + '/downvotes')
        var upVoters = []
        var downVoters = []
        upRef.on('value', snapshot => {
            let upLength = 0
            snapshot.forEach(function (childSnapshot) {
                upVoters.push(childSnapshot.val())
            })
        })
        downRef.on('value', snapshot => {
            let downLength = 0
            snapshot.forEach(function (childSnapshot) {
                downVoters.push(childSnapshot.val())
            })
        })

        if (type == 'up') {
            if (upVoters.includes(userUID) && !downVoters.includes(userUID)) {
                upRef.remove()
            } else if (!upVoters.includes(userUID) && !downVoters.includes(userUID)) {
                upRef.push(userUID)
            } else if (!upVoters.includes(userUID) && downVoters.includes(userUID)) {
                upRef.push(userUID)
                downRef.remove()
            }
        } else if (type == 'down') {
            if (downVoters.includes(userUID) && !upVoters.includes(userUID)) {
                downRef.remove()
            } else if (!downVoters.includes(userUID) && !upVoters.includes(userUID)) {
                downRef.push(userUID)
            } else if (!downVoters.includes(userUID) && upVoters.includes(userUID)) {
                downRef.push(userUID)
                upRef.remove()
            }
        }
        setUpvote(upVoters)
        setDownvote(downVoters)
        console.log('up', upvote.length)
        console.log('down', downvote.length)

    }
    function UpVote() {
        let ref = firebase.database().ref('forum/' + forum.id + '/upvotes')
        var users = []
        ref.on('value', snapshot => {
            snapshot.forEach(function (childSnapshot) {
                users.push(childSnapshot.val())
            })
        })
        if (users.includes(userUID)) {
            ref.delete().then(console.log(success))
        } else if (!ref.inclued(userUID)) {
            users.push(firebase.auth().currentUser.uid)
        }
    }

    function DownVote() {
        var ref = firebase.database().ref('forum/' + forum.id + '/downvotes')
        var users = []
        ref.on('value', snapsho => {
            snapshot.forEach(function (childSnapshot) {
                users.push(childSnapshot.val())
            })
        })
        if (users.includes(userUID)) {
            ref.delete()
        }
    }


    const getPosts = async (cat) => {
        firebase.database().ref('forum/').on('value', snapshot => {
            var posts = []
            snapshot.forEach(function (childSnapshot) {
                let item = childSnapshot.val()
                item['id'] = childSnapshot.key
                //console.log(item["id"])
                if (cat == 'all') {
                    //let item = childSnapshot.val()
                    //console.log('all')
                    posts.push(item)
                } else {
                    //console.log(cat)
                    // console.log(cat)
                    if (item.category === cat) {
                        posts.push(item)
                    }
                }
            })
            setPostData(posts)
        })
    }
    function getUser() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snapshot => {
            setUser(snapshot.val())
        })
    }
    function selectCategory(cat) {
        setCategory(cat)
        getPosts(cat)
    }
    if (user == null) {
        return null
    }
    if (create) {
        return <EditForum user={user} exit={() => { setCreate(false) }} />
    }
    if (comment) {
        //console.log(forum)
        return <CommentForum user={user} forumPost={forum} exit={() => { setComment(false) }} />
    }
    //console.log(category)
    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => setCreate(true)} color="#4293f5" labelStyle={{ color: 'white', fontSize: 17 }} style={{ margin: 10, marginTop: 20 }}>+ Create</Button>
            <CategoryPicker style={styles.categoryPicker} selectedCategory={category} onClick={selectCategory} />
            <ScrollView>
                {postData.map(item => (
                    <Card key={item.id} style={{ margin: 15 }}>
                        <Text style={{ marginHorizontal: 17, marginTop: 17 }}>{item.category}</Text>
                        <Card.Title title={item.title} subtitle={"by " + item.postedby} />
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Content style={{ margin: 10 }}>
                            <Text>
                                {item.post.substring(0, 400)}...
                    </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button labelStyle={styles.cardButtons} onPress={() => { setForum(item), Votes('down') }} icon="arrow-down"></Button>
                            <Button labelStyle={styles.cardButtons} onPress={() => { setForum(item), Votes('up') }} icon="arrow-up"></Button>
                            <Button onPress={() => { setForum(item), setComment(true) }} labelStyle={styles.cardButtons} icon="comment"></Button>
                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>




        </View >
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardButtons: {
        color: 'black'
    },
    categoryPicker: {
        padding: 5,
        marginVertical: 7,
        elevation: 3,
    },
})