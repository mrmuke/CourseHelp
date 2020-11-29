import React, { useState, useEffect } from 'react';
//import { render } from 'react-dom';
import { Text, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Appbar, Title } from 'react-native-paper';
import EditForum from './EditForum';
import CommentForum from './CommentForum'
import 'react-native-get-random-values';
import CategoryPicker from '../components/CategoryPicker'



export default function Forum() {
    const [postData, setPostData] = useState([])
    const [user, setUser] = useState(null)
    const [create, setCreate] = useState(false)
    const [comment, setComment] = useState(false)
    const [forum, setForum] = useState(null)
    const [votes, setVotes] = useState(0)
    const [category, setCategory] = React.useState('all')
    const userUID = firebase.auth().currentUser.uid
    useEffect(() => {
        getPosts('all')
        getUser()
    }, [])

    function getVoters(item) {
        let ref = firebase.database().ref('forum/' + item.id)
        var upVoters = []
        var downVoters = []
        ref.once('value', snapshot => {
            upVoters = snapshot.val().upvotes || []
            downVoters = snapshot.val().downvotes || []
        })
        return [upVoters, downVoters, ref]
    }

    function getVote(item) {
        let voters = getVoters(item)
        var upVoters = voters[0]
        var downVoters = voters[1]
        return upVoters.length - downVoters.length
    }

    function isVoted(item) {
        let voters = getVoters(item)
        var upVoters = voters[0]
        var downVoters = voters[1]
        if (upVoters.includes(userUID)) {
            return 'up'
        } else if (downVoters.includes(userUID)) {
            return 'down'
        } else {
            return 'none'
        }

    }

    function Votes(type, forum) {
        let voters = getVoters(forum)
        var upVoters = voters[0]
        var downVoters = voters[1]
        var ref = voters[2]

        if (type == 'up') {
            if (upVoters.includes(userUID) && !downVoters.includes(userUID)) {
                upVoters.splice(upVoters.indexOf(userUID), 1)
            } else if (!upVoters.includes(userUID) && !downVoters.includes(userUID)) {
                upVoters.push(userUID)
            } else if (!upVoters.includes(userUID) && downVoters.includes(userUID)) {
                upVoters.push(userUID)
                downVoters.splice(downVoters.indexOf(userUID), 1)
            }
        } else if (type == 'down') {
            if (downVoters.includes(userUID) && !upVoters.includes(userUID)) {
                downVoters.splice(downVoters.indexOf(userUID), 1)
            } else if (!downVoters.includes(userUID) && !upVoters.includes(userUID)) {
                downVoters.push(userUID)
            } else if (!downVoters.includes(userUID) && upVoters.includes(userUID)) {
                downVoters.push(userUID)
                upVoters.splice(upVoters.indexOf(userUID), 1)
            }
        }

        //setUpvote(upVoters)
        //setDownvote(downVoters)        ref.update({ upvotes: upVoters })
        ref.update({ downvotes: downVoters })
        ref.update({ upvotes: upVoters })
        //console..length, upVoters)
        // console.log('down', downVoters.length, downVoters)
    }

    const getPosts = (cat) => {
        firebase.database().ref('forum/').on('value', snapshot => {
            var posts = []
            snapshot.forEach(function (childSnapshot) {
                let item = childSnapshot.val()
                item['id'] = childSnapshot.key
                if (cat == 'all') {
                    posts.push(item)
                } else if (cat == 'My Posts') {
                    if (item.uid == userUID) {
                        posts.push(item)
                    }
                } else {
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
        getPosts(cat, true)
    }
    if (user == null) {
        return null
    }
    if (create) {
        return <EditForum user={user} exit={() => { setCreate(false) }} />
    }
    if (comment) {
        return <CommentForum user={user} forumPost={forum} exit={() => { setComment(false) }} />
    }
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#64b0a8', height: 44 }}>
                <Appbar.Content titleStyle={{ color: 'white', fontWeight: 'bold' }} title="Forum" />
            </Appbar.Header>
            <Button mode="contained" onPress={() => setCreate(true)} color="#64b0a8" labelStyle={{ color: 'white', fontSize: 17 }} style={{ margin: 10, marginTop: 20 }}>+ Create</Button>
            <View style={{ backgroundColor: '#003152', height: 75, justifyContent: 'flex-end' }}><Title style={{ textAlign: 'center', color: 'white', }}>Course Discussion Forum</Title></View>

            <Button mode="contained" onPress={() => setCreate(true)} color="#4293f5" labelStyle={{ color: 'white', fontSize: 17 }} style={{ margin: 10, marginTop: 20 }}>+ Create</Button>
            <CategoryPicker style={styles.categoryPicker} selectedCategory={category} onClick={selectCategory} />
            <ScrollView>
                {postData.map(item => (
                    <Card key={item.id} style={{ margin: 15 }}>
                        <Text style={{ marginHorizontal: 17, marginTop: 17 }}>{item.category}</Text>
                        <Card.Title title={item.title} subtitle={"by " + item.postedby} />
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Content style={{ margin: 10 }}>
                            <Text>{item.post.substring(0, 400)}...</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button labelStyle={{ color: isVoted(item) == 'up' ? '#64b0a8' : 'black' }} onPress={() => { Votes('up', item) }} color="#64b0a8" icon="arrow-up"></Button>
                            <Text>{getVote(item)}</Text>
                            <Button labelStyle={{ color: isVoted(item) == 'down' ? '#64b0a8' : 'black' }} onPress={() => { Votes('down', item) }} color="#64b0a8" icon="arrow-down"></Button>
                            <Button onPress={() => { setForum(item), setComment(true) }} color='#64b0a8' labelStyle={{ color: 'black' }} icon="comment"></Button>
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
    categoryPicker: {
        padding: 5,
        marginVertical: 7,
        elevation: 3,
    },
})