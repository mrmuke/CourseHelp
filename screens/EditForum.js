import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import * as firebase from 'firebase'
import { Button, IconButton, Title } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function EditForum({ user, exit }) {
    const [postText, setPostText] = useState("")
    const [postTitle, setPostTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState(null)
    const [uploaded, setUploaded] = useState(false)
    const [postKey, setPostKey] = useState(uuidv4())

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            uploadImage(result.uri)
        }
    }
    const uploadImage = async (uri) => {
        setLoading(true)
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref("forumimages/" + postKey);
        const downloadURL = await (await ref.put(blob)).ref.getDownloadURL()
        setUrl(downloadURL)
        setLoading(false)
        setUploaded(true)

    }
    //console.log(url)
    const post = async () => {
        firebase.database().ref("forum/" + postKey).set({
            title: postTitle,
            post: postText,
            postedby: user.username,
            image: url,
            
        })
        exit()
    }
    const revert = async () => {
        //console.log(uploaded)
        if (uploaded) {
            let ref = firebase.storage().ref("forumimages/" + postKey)
            ref.delete().then(console.log('success'))
            setUrl(null)
        }
    }
    function check() {
        if (uploaded&&postText.length>0&&postTitle.length>0) {
            post()
        } else {
            Alert.alert('Fill in all fields!')
        }
    }
    if (!user) {
        return null
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <View>
                    <Button icon="arrow-left" onPress={() => { exit(), revert() }} color='#36485f'
                        labelStyle={{ color: 'black' }}
                        style={{ marginTop: 10, alignSelf: 'left' }} >Back</Button>
                    <Title style={{ margin: 20, marginBottom: 20 }}>CREATE A POST</Title>
                </View>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false} >
                    <View style={{ borderBottomColor: '#dcdde1', borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: '#dcdde1' }}>
                        <TextInput
                            style={{ flex: 1, margin: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#dcdde1" }}
                            placeholder="Post Title (required) max 40 char. "
                            onChangeText={postTitle => setPostTitle(postTitle)}
                            underlineColor="#36485f"
                            autoCorrect={true}
                        />
                        <TextInput
                            style={{ marginLeft: 20, flex: 1, height: 275 }}
                            placeholder="Your text post"
                            multiline={true}
                            onChangeText={postText => setPostText(postText)}
                            underlineColor="#36485f"
                            autoCorrect={true}

                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ flexDirection: 'row' }}>
                    {uploaded ?
                        <Title style={{ margin: 20, marginTop: 15 }}>IMAGE UPLOADED</Title> : <Title style={{ margin: 20, marginTop: 15, }}>Upload Image</Title>}
                    {loading ?
                        <ActivityIndicator size='large' marginLeft='auto' marginRight={15} marginVertical={18} /> :
                        <IconButton icon='camera' size={40} style={{ marginLeft: 'auto' }} onPress={pickImage} />}
                </View>
                <Image
                    style={{
                        flex: 1, height: 300,
                    }}
                    source={{ uri: url }}
                />
                <Button onPress={() => { check(), post() }} mode="outlined" color='#36485f'
                    labelStyle={{ fontWeight: 'normal', fontSize: 15, color: 'black' }}
                    style={{ width: 150, alignSelf: 'center', margin: 20 }} >Post</Button>
            </KeyboardAvoidingView>
        </ScrollView>
    )


}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    }
})