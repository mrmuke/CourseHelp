import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as firebase from 'firebase'
import { TextInput, Button, IconButton, Caption, Searchbar, Title } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
//import { Constants, Permissions } from 'expo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditProfile from './EditProfile';

export default function Profile(props) {
    const [image, setImage] = useState(null)
    const [user, setUser] = useState(null)
    const [edit, setEdit] = useState(false)
    //setURL('gs://coursehelp-8d1c8.appspot.com/profileimages/defaultprofilepic.jpg')
    useEffect(() => {
        getUser()
    }, [])

    function getUser() {

        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snapshot => {
            setUser(snapshot.val())
            console.log(snapshot.val())
        })

    }
    if (user == null) {
        return null
    }
    if (edit) {
        return <EditProfile user={user} exit={() => { setEdit(false); getUser() }} />
    }
    return (
        <View style={styles.container}>
            <Button style={styles.button} mode="contained" color='#36485f' onPress={() => setEdit(true)}>
                Edit Profile
            </Button>
            <Image
                style={styles.profileImage}
                source={{ uri: user.profile_picture }}
            />
            <Title style={styles.text} >Username: {user.username}</Title>
            <Title style={styles.text}>School: {user.school}</Title>
            <Title style={styles.text}>Grade: {user.grade}</Title>
            <Title style={styles.text}>Bio: {user.bio}</Title>
            <Button onPress={() => firebase.auth().signOut()}>
                Sign Out
            </Button>

        </View >

    );



}



const styles = StyleSheet.create({
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        margin: 10
    },
    button: {
        margin: 50,

    },
    text: {
        color: 'black'
    }
})