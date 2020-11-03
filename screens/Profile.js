import React, { useState, useEffect } from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import * as firebase from 'firebase'
import { TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { Constants, Permissions } from 'expo';
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

export default function Profile() {
    //const [image, setImage] = useState(null)

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        //let result = await ImagePicker.launchImageLibraryAsync();
        console.log(result)
        if (!result.cancelled) {
            uploadImage(result.uri)
            console.log('success')
        }
    }

    const uploadImage = async (uri) => {

        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref("/Profileimages/" + uri);

        return ref.put(blob);


    }
    const [text, setText] = React.useState('');

    return (

        <View style={styles.container}>
            <Text style={styles.topBar}>
                Edit Profile
            </Text>
            <TextInput
                style={styles.inputbox}
                mode='outlined'
                label="Username"
                dense="true"
                value={text}
                onChangeText={text => setText(text)}
                underlineColor="#36485f"
            />
            <TextInput
                style={styles.inputbox}
                mode='outlined'
                label="School"
                dense="true"
                value={text}
                onChangeText={text => setText(text)}
                underlineColor="#36485f"
            />
            <Button title='Upload Pic' onPress={pickImage} />
            <Button title="Sign out" onPress={() => firebase.auth().signOut()} />


        </View >
    );



}


const styles = StyleSheet.create({
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
        padding: 13,
        paddingTop: 30,
        marginBottom: 100,
        fontSize: 18,
        fontWeight: '700',
        backgroundColor: '#36485f',
        textAlign: 'center'
    },
})