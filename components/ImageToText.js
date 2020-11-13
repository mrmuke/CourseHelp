import { Button } from 'react-native-paper';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

export default function ImageToText() {
    const [imageState, setImageState] = useState('');
    const [uploading, setUploading] = useState(false);
    const [googleState, setGoogleState] = useState(null);
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
                await submitToGoogle(await uploadImageAsync(pickerResult['uri']));
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

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    async function submitToGoogle(uri) {
        try {
            setUploading(true);
            let image = uri;
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            //{ type: "LABEL_DETECTION", maxResults: 10 },
                            //{ type: "LANDMARK_DETECTION", maxResults: 5 },
                            //{ type: "FACE_DETECTION", maxResults: 5 },
                            //{ type: "LOGO_DETECTION", maxResults: 5 },
                            { type: "TEXT_DETECTION", maxResults: 5 },
                            //{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                            //{ type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                            //{ type: "IMAGE_PROPERTIES", maxResults: 5 },
                            //{ type: "CROP_HINTS", maxResults: 5 },
                            //{ type: "WEB_DETECTION", maxResults: 5 }
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
                "https://vision.googleapis.com/v1/images:annotate?key=" + 'AIzaSyAK1pRxa4qnSN1An_xUDuVvuzfabdWAuyQ',
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
            setGoogleState(responseJson);
            let returnText = responseJson["responses"][0]["textAnnotations"][0]["description"];
            setText(returnText);
            setUploading(false);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{
                height: 120,
                flexDirection: 'row',
            }}>
                <Button
                    onPress={() => CameraPhoto()}
                    title="Analyze!"
                    style={styles.button}
                    color='white'
                >Take Photo</Button>
                <Button
                    onPress={() => takePhoto()}
                    title="Analyze!"
                    style={{
                        backgroundColor: '#59a8fb',
                        marginTop: 30,
                        marginLeft: 40,
                        marginBottom: 30,
                        width: Dimensions.get('screen').width * 0.3333,
                        justifyContent: 'center'
                    }}
                    color='white'
                >Submit Photo</Button>
            </View>
            <View style={{ height: Dimensions.get('screen').height * 0.4 }}>
                <WebView
                    source={{ html: `<textArea style="width:100%; height:100%;">${text}</textArea>` }}
                    style={{
                        width: Dimensions.get('screen').width * 0.8,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#59a8fb',
        marginTop: 30,
        marginBottom: 30,
        width: Dimensions.get('screen').width * 0.3333,
        justifyContent: 'center'
    }
})