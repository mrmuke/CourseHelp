import React, { useState, useEffect } from 'react'
import { Image, Text, StyleSheet, View, KeyboardAvoidingView, Keyboard, TextInput, Alert } from 'react-native';
import * as firebase from 'firebase'
import { FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
export default function CommentForum({ user, forumPost, exit }) {
    const [forum, setForum] = useState(forumPost)
    const [comment, setComment] = useState('')
    const [commentRender, setCommentRender] = useState(false)
    const [forumKey, setForumKey] = useState(null)

    useEffect(() => {
        getForumKey()
    }, [])

    function getForumKey() {
        var ref = firebase.database().ref("forum/")
        ref.orderByChild('image').equalTo(forum.image).on("value", function (snapshot) {
            snapshot.forEach((function (child) {
                setForumKey(child.key)
            }))
        })
    }


    //console.log(forum.comments)

    const commentMessage = async () => {
        var ref = firebase.database().ref("forum/" + forumKey + "/comments/")
        var commentKey = ref.push({
            comment: comment
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
            <View style={{ height: 500 }}>
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
                                style={{ margin: 20, paddingVertical: 15, width: 300, borderBottomColor: "#dcdde1", borderBottomWidth: 1 }}
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
                                <Button onPress={() => commentMessage()} style={{ backgroundColor: '#525252' }} mode="contained">Comment</Button></View>
                            : <View>
                            </View>}
                    </View>
                </KeyboardAvoidingView>
            </View >
            <View>
                <FlatList
                    data={forum.comments}
                    renderItem={(item) => (
                        <Text>{item.comment}</Text>
                    )

                    }
                />
            </View>
        </ScrollView>



    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})