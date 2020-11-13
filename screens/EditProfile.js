import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase'
import { TextInput, Button, IconButton, Caption, Searchbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
//import { Constants, Permissions } from 'expo';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function EditProfile({ user, exit }) {
    //const [image, setImage] = useState(null)
    const [grade, setGrade] = useState(user.grade)
    const [showGrade, setShowGrade] = useState(false)
    const grades = ["Freshman", "Sophomore", "Junior", "Senior"]
    const [url, setUrl] = useState(user.profile_picture)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(user.username);
    const [school, setSchool] = useState(user.school);
    const [bio, setBio] = useState(user.bio);
    //setURL('gs://coursehelp-8d1c8.appspot.com/profileimages/defaultprofilepic.jpg')
    const userID = firebase.auth().currentUser.uid
    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync();
        //let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            uploadImage(result.uri)
            //console.log(result)
        }
    }
    const uploadImage = async (uri) => {
        setLoading(true)
        const response = await fetch(uri);
        const blob = await response.blob();


        var ref = firebase.storage().ref("profileimages/" + userID);
        const downloadURL = await (await ref.put(blob)).ref.getDownloadURL()
        setUrl(downloadURL)
        firebase.database().ref("users/" + userID).update({
            profile_picture: downloadURL
        }).then(() => {
            setLoading(false)
        })
        // console.log(await (await ref.put(blob)).ref.getDownloadURL())
        console.log(userID)

    }
    function uploadUsername() {
        firebase.database().ref("users/" + userID).update({
            username: username
        })
    }
    function uploadSchool() {
        firebase.database().ref("users/" + userID).update({
            school: school
        })
    }
    function uploadGrade() {
        firebase.database().ref("users/" + userID).update({
            grade: grade
        })
    }
    function uploadBio() {
        firebase.database().ref("users/" + userID).update({
            bio: bio
        })
    }
    function uploadData() {
        uploadSchool()
        uploadUsername()
        uploadGrade()
        uploadBio()
    }
    if (!user) {
        return null
    }
    return (
        <ScrollView style={styles.container}>

            <View>
                <Image
                    style={styles.profileImage}
                    source={{ uri: url }}
                />
            </View>
            <View>
                {loading ?
                    <ActivityIndicator size='large' /> :
                    <IconButton icon='camera' size={40} style={styles.edit} onPress={pickImage} />}
            </View>

            <View style={styles.container}>

                <TouchableOpacity onPress={() => setShowGrade(!showGrade)}  >
                    <Button mode="outlined" style={{ fontSize: 15, padding: 5, margin: 15, width: 160, textAlign: 'center' }}>{grade}</Button>
                </TouchableOpacity>
                {showGrade && <>{grades.map(grade =>
                    <Button key={grade} style={styles.selector} mode="outlined" color="black" onPress={() => { setGrade(grade); setShowGrade(false) }}>{grade}</Button>
                )}</>}

            </View>

            <TextInput
                style={styles.inputbox}
                mode='outlined'
                label="Username"
                dense="true"
                value={username}
                onChangeText={username => setUsername(username)}
                underlineColor="#36485f"
            />
            <TextInput
                style={styles.inputbox}
                mode='outlined'
                label="School"
                dense="true"
                value={school}
                onChangeText={school => setSchool(school)}
                underlineColor="#36485f"
            />
            <TextInput
                style={styles.inputbox}
                mode='outlined'
                label="Bio"
                dense="true"
                value={bio}
                onChangeText={bio => setBio(bio)}
                underlineColor="#36485f"
            />

            <Button onPress={() => { exit(); uploadData() }} mode="contained" color='#36485f' style={styles.button}>Save</Button>


        </ScrollView >
    );
}



const styles = StyleSheet.create({
    selector: {
        display: 'flex',
        marginLeft: 15,
        marginRight: 200
    },
    edit: {
        marginLeft: 'auto'
    },
    button: {
        width: 150,
        fontSize: 20,
        alignSelf: 'center'
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        margin: 10
    },
    container: {
        padding: 0
    },
    text: {
        color: '#36485f',
        fontSize: 30,
        padding: 20
    },
    inputbox: {
        padding: 20,
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 12
    },
    topBar: {
        color: 'white',
        padding: 50,
        paddingTop: 30,
        fontSize: 18,
        fontWeight: '700',
        backgroundColor: '#36485f',
        textAlign: 'center'
    },
})


