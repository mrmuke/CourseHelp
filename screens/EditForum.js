import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import * as firebase from 'firebase'
import { Button, IconButton, Title, Appbar } from 'react-native-paper'
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
    const [category, setCategory] = useState('all')
    const [showCategory, setShowCategory] = useState(true)
    const categories = ['Science', 'Math', 'History', 'English', 'Art', 'Language', 'Technology']
    const userUID = firebase.auth().currentUser.uid
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
            category: category,
            uid: userUID
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
        if (uploaded && postText.length > 0 && postTitle.length > 0) {
            post()
        } else {
            Alert.alert('Fill in all fields!')
        }
    }
    if (!user) {
        return null
    }

    return (
        <View>
            <Appbar.Header style={{ backgroundColor: '#64b0a8', height: 44 }}>
                <Appbar.BackAction onPress={() => { exit(), revert() }} size={10} color='white' />
                <Appbar.Content titleStyle={{ color: 'white', fontWeight: 'bold' }} title="Create" />
            </Appbar.Header>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={{ marginTop: 20 }}>
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
                                style={{ marginHorizontal: 20, flex: 1, height: 275 }}
                                placeholder="Your text post"
                                multiline={true}
                                onChangeText={postText => setPostText(postText)}
                                underlineColor="#36485f"
                                autoCorrect={true}

                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ height: 420 }}>
                        <Title style={{ margin: 20, marginTop: 20, alignSelf: 'center' }}>Category</Title>
                        <TouchableOpacity style={{ margin: 5 }} onPress={() => setShowCategory(!showCategory)}>
                            <Button mode="text" contentStyle={{ padding: 10 }} color='#36485f' labelStyle={{ fontWeight: 'normal', fontSize: 15, color: 'black' }} style={{ borderColor: '#dcdde1', borderWidth: 1 }}>{category}</Button>
                        </TouchableOpacity>
                        {showCategory && <>{categories.map(category =>
                            <Button key={category} color='#36485f' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={styles.selector} mode="text" color="black" onPress={() => { setCategory(category) }}>{category}</Button>
                        )}</>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {uploaded ?
                            <Title style={{ margin: 20, marginTop: 15 }}>IMAGE UPLOADED</Title> : <Title style={{ margin: 20, marginTop: 15, }}>Upload Image</Title>}
                        {loading ?
                            <ActivityIndicator size='large' marginRight={0} marginVertical={18} /> :
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
        </View>
    )


}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    selector: {
        fontSize: 15,
        padding: 5,
        marginVertical: 2,
        textAlign: 'center'
    },
})