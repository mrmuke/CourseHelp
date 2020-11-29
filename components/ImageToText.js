import { ActivityIndicator, Button, TextInput, Title } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Clipboard, Dimensions, Text } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ImageToText({ exit }) {
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
                const url = await uploadImageAsync(pickerResult['uri']);
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

    async function submitToGoogle(url) {
        try {

            let body = JSON.stringify({
                requests: [
                    {
                        features: [

                            { type: "TEXT_DETECTION", maxResults: 5 },
                        ],
                        image: {
                            source: {
                                imageUri:/*  url */"https://s29843.pcdn.co/blog/wp-content/uploads/sites/2/2020/11/TechSmith-Blog-ExtractText.png"
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
            console.log(responseJson)
            let returnText = responseJson["responses"][0]["textAnnotations"][0]["description"].replaceAll("\n","\n-")
            setText(returnText);
        } catch (e) {
            console.log(e);
        }
    }
    if (uploading) {
        return <View style={{ flex: 1, justifyContent: 'center', }}><ActivityIndicator style={{ margin: 'auto' }} /></View>
    }
    return (
        <View style={{ alignItems: 'center', flexDirection: "column", justifyContent: "center", height: Dimensions.get('screen').height - 142 }}>
            {(() => {
                if (text.length > 0) {
                    return (<View style={{ alignItems: "center" }}>
                        <Title style={{ textAlign: 'center', marginBottom: 20 }}>Notes:</Title>
                        <TextInput multiline={true} onChangeText={text=>setText(text)} value={text} style={{ width: Dimensions.get('screen').width - 50, height: Dimensions.get('screen').height * 0.3 }} />
                        <Button color="black" icon="pencil" onPress={() => Clipboard.setString(text)}>Copy</Button>
                        <Button mode="outlined" style={{ marginTop: 30, width: Dimensions.get("screen").width - 200, backgroundColor: "#003152" }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} onPress={() => {
                            setText('');
                        }}><Text>New Photo</Text></Button>
                    </View>
                    )
                } else {
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={CameraPhoto}><Icon size={100} name="party-mode" style={{ color: '#003152' }} /><Text style={{ color: '#003152', textAlign: "center" }}>Take Photo</Text></TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto}><Icon size={100} name="get-app" style={{ color: '#003152' }} /><Text style={{ color: '#003152', textAlign: "center" }}>Upload Photo</Text></TouchableOpacity>
                        </View>
                    )
                }
            })()}
            <Button mode="contained" style={{ marginTop: 20, width: Dimensions.get("screen").width - 200, backgroundColor: "#003152" }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} onPress={() => {
                exit();
            }}><Text>Back</Text></Button>
        </View>

    );
}
