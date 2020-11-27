import { ActivityIndicator, Button, TextInput, Title } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Clipboard } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ImageToText() {
    const [uploading, setUploading] = useState(false);
    const [text, setText] = useState('');

    async function takePhoto() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        handleImagePicked(result);
    }

    async function CameraPhoto() {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        handleImagePicked(result);
    }

    async function handleImagePicked(pickerResult) {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                var url = await uploadImageAsync(pickerResult['uri']);
                console.log(url);
                await submitToGoogle(url);
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            setUploading(false);
        }
    };

    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child('googleVision')
            .child(uuidv4());
        const snapshot = await ref.put(blob);
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    async function submitToGoogle(uri) {
        try {
            console.log(uri)
            let image = uri;
            let body = JSON.stringify({
                requests: [
                    {
                        features: [

                            { type: "TEXT_DETECTION", maxResults: 5 },
                        ],
                        image: {
                            source: {
                                imageUri: image
                            }
                        }
                    }
                ]
            });
            let response = await fetch(
                "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAK1pRxa4qnSN1An_xUDuVvuzfabdWAuyQ",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: body
                }
            );
            let responseJson = await response.json();
            console.log(responseJson);
            console.log(responseJson["responses"][0]["textAnnotations"][0]["description"]);
            let returnText = responseJson["responses"][0]["textAnnotations"][0]["description"]
            setText(returnText);
        } catch (e) {
            console.log(e);
        }
    }
    console.log(text)
if(uploading){
    return <ActivityIndicator/>
}
    return (
            <View style={{padding:15}}>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity onPress={CameraPhoto}><Icon size={100} name="camera" /></TouchableOpacity>

                <TouchableOpacity onPress={takePhoto}><Icon size={100} name="upload" /></TouchableOpacity>
 
                </View>
                 
                {text.length>0&&<View><Title style={{textAlign:'center'}}>Notes:</Title><TextInput multiline={true} value={text}/><Button color="black" icon="pencil" onPress={() => Clipboard.setString(text)}>Copy</Button></View>}
            </View>
            

    );
}
