import React, { useState, useEffect } from 'react';
//import { render } from 'react-dom';
import { Text, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import EditForum from './EditForum';
import CommentForum from './CommentForum'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function Forum() {
    const [postData, setPostData] = useState(null)
    const [category, setCategory] = useState('All')
    const [user, setUser] = useState(null)
    const [create, setCreate] = useState(false)
    const [comment, setComment] = useState(false)
    const [forum, setForum] = useState(null)
    const userID = firebase.auth().currentUser.uid

    useEffect(() => {
        getPosts()
        getUser()
    }, [])

    function getPosts() {
        var posts = []
        firebase.database().ref('forum/').once('value', snapshot => {
            snapshot.forEach(function (childSnapshot) {
                posts.push(childSnapshot.val())
            })
            setPostData(posts)
        })
        //console.log(postData)
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

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={() => setCreate(true)} color="#4293f5" labelStyle={{ color: 'white', fontSize: 17 }} style={{ margin: 10, marginTop: 20 }}>+ Create</Button>
            <FlatList
                data={postData}
                keyExtractor={(item) => uuidv4()}
                renderItem={({ item, index }) => (
                    <Card style={{ margin: 15 }}>
                        <Card.Title title={item.title} subtitle={"by " + item.postedby} />
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Content style={{ margin: 10 }}>
                            <Text>
                                {item.post.substring(0, 1000)}...
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button labelStyle={styles.cardButtons} icon="arrow-down"></Button>
                            <Button labelStyle={styles.cardButtons} icon="arrow-up"></Button>
                            <Button onPress={() => { setForum(item), setComment(true) }} labelStyle={styles.cardButtons} icon="comment"></Button>
                        </Card.Actions>
                    </Card>
                )

                }


            />



        </View >
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardButtons: {
        color: '#666666'
    }


})