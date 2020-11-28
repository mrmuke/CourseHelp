import React, { useState, useEffect } from 'react'
import { Image, Text, StyleSheet, View, KeyboardAvoidingView, Keyboard, TextInput, Alert } from 'react-native';
import * as firebase from 'firebase'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Card, Title } from 'react-native-paper';
export default function CommentForum({ user, forumPost, exit }) {
    const [forum, setForum] = useState(forumPost)
    const [comment, setComment] = useState('')
    const [commentRender, setCommentRender] = useState(false)

    //upvote downvote and select answer
    //free response
    //improve chat features
    //vreify dropdown ui
    //tools js ui
    //my questions
    //notifications page
    //user profiles images chat
    //suggested groups based on school
    //machine learning
    //video claling
    //timer
    //take a break kahoot

    function timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    const commentMessage = async () => {
        var ref = firebase.database().ref("forum/" + forumPost.id + "/comments/")
        await ref.push({
            comment: comment,
            time_added: Date.now(),
            commentedBy: user.username,
            profile_picture: user.profile_picture
        })
        firebase.database().ref('forum/' + forumPost.id).once('value', snapshot => {
            setForum(snapshot.val())
        })
    }
    return (

        <ScrollView style={styles.container}>
            <View>
                <Button icon="arrow-left" onPress={() => exit()} color='#36485f'
                    labelStyle={{ color: 'black' }}
                    style={{ marginTop: 10, alignSelf: 'left' }} >Back</Button>
            </View>
            <View style={{ margin: 15 }}>
                <Card>
                    <Card.Title title={forum.title} subtitle={"by " + forum.postedby} />

                    <Card.Cover source={{ uri: forum.image }} />
                    <Card.Content style={{ margin: 10 }}>
                        <Text>
                            {forum.post}
                        </Text>
                    </Card.Content>
                </Card>
            </View>
            <View>
                <Title style={{ borderBottomColor: "#dcdde1", borderBottomWidth: 1, margin: 20, marginTop: 20 }}>Comments</Title>
                <KeyboardAvoidingView behavior='padding'>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                width: 30,
                                height: 30,
                                borderRadius: 60,
                                marginVertical: 20,
                                marginLeft: 10
                            }} source={{ uri: user.profile_picture }} />
                            <TextInput
                                style={{ margin: 20, paddingVertical: 15, flex: 1, borderBottomColor: "#dcdde1", borderBottomWidth: 1 }}
                                placeholder="Add a public comment..."
                                mode='flat'
                                multiline={true}
                                onChangeText={comment => setComment(comment)}
                                underlineColor="#36485f"
                                autoCorrect={false}
                                onFocus={() => {
                                    setCommentRender(true);
                                }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        {commentRender ?
                            <View style={{ flexDirection: 'row', marginLeft: 'auto', marginHorizontal: 20 }}>
                                <Button onPress={() => setCommentRender(false)} color='black' labelStyle={{ color: '#525252' }}>Cancel</Button>
                                <Button onPress={() => { commentMessage() }} style={{ backgroundColor: '#525252' }} mode="contained">Comment</Button></View>
                            : <View>
                            </View>}
                    </View>
                </KeyboardAvoidingView>

            </View >
            {forum.comments && Object.values(forum.comments).reverse().length > 0 && Object.values(forum.comments).reverse().map(c => (
                <View style={{
                    paddingLeft: 19,
                    paddingRight: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }}
                    key={c.id}>
                    <Image style={{
                        width: 45,
                        height: 45,
                        borderRadius: 20,

                    }} source={{ uri: c.profile_picture }} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <TouchableOpacity onPress={() => { }}>

                        </TouchableOpacity>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 6
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}>{c.commentedBy}</Text>
                            <Text style={{
                                fontSize: 11,
                                color: "#808080",
                            }}>
                                {timeDifference(Date.now(), c.time_added)}
                            </Text>
                        </View>
                        <Text>{c.comment}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})