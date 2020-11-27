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
    const [vote, setVote] = useState(null)
    const [disableVotes, setDisableVotes] = useState(false)
    const [category, setCategory] = React.useState('all')

    useEffect(() => {
        getPosts('all')
        getUser()
    }, [])


    function upvote(item) {
        var ref = firebase.database().ref('forum/' + forum.id)
        var v = 0
        ref.on('value', snapshot => {
            v = snapshot.val().vote
            //console.log(snapshot.val().vote)
        })
        ref.update({
            vote: v + 1
        })
        //+(v)
    }

    function downvote(item) {
        if (item.vote != 0) {
            var ref = firebase.database().ref('forum/' + forum.id)
            var v = 0
            ref.on('value', snapshot => {
                v = snapshot.val().vote
                //console.log(snapshot.val().vote)
            })
            ref.update({
                vote: v - 1
            })
        }
    }

    const getPosts = async () => {
        firebase.database().ref('forum/').on('value', snapshot => {
            var posts = []
            snapshot.forEach(function (childSnapshot) {
                let item = childSnapshot.val()
                item['id'] = childSnapshot.key
                if (category == 'all') {
                    //let item = childSnapshot.val()
                    //console.log('all')
                    posts.push(item)
                } else {
                    //console.log(category)
                    if (item.category == category) {
                        posts.push(item)
                    }
                }
            })
            setPostData(posts)
            //console.log(postData)
        })
    }
    function getUser() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snapshot => {
            setUser(snapshot.val())
        })
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
            <CategoryPicker style={styles.categoryPicker} selectedCategory={category} onClick={setCategory} onPress={() => getPosts} />
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
                            <Button labelStyle={styles.cardButtons} icon="arrow-down"></Button>
                            <Button labelStyle={styles.cardButtons} icon="arrow-up"></Button>
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