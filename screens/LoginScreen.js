import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'
//import styles from "./style";
import { Keyboard, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';



class LoginScreen extends Component {
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true;
                }
            }
        }
        return false;
    }
    onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            console.log(firebaseUser)
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken);


                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential)
                    .then(result => {
                        console.log("User signed in...")

                        if (result.additionalUserInfo.isNewUser) {
                            firebase
                                .database()
                                .ref('/users/' + result.user.uid)
                                .set({
                                    gmail: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    locale: result.additionalUserInfo.profile.locale,
                                    first_name: result.additionalUserInfo.profile.given_name,
                                    last_name: result.additionalUserInfo.profile.family_name,

                                    created_at: Date.now()
                                })
                                .then(function (snapshot) {
                                    //console.log('Snapshot', snapshot)
                                })
                        }
                        else {
                            firebase.database().ref('/users/' + result.user.uid).update({
                                last_logged_in: Date.now(),

                            })
                        }

                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                    });
            } else {
                console.log('User already signed-in Firebase.');
            }
        }.bind(this));
    }
    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                /* behavior: 'web', */
                /*  androidClientId: YOUR_CLIENT_ID_HERE, */
                iosClientId: '451006353013-ot4fj9fg8ijfrro6o7vj5l474205vtff.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result)
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <View style={styles.regform}>
                            <Text style={styles.logoText}>CourseHelp</Text>
                            <TextInput placeholder="Email" placeholderTextColor="#36485f" style={styles.textInput} />
                            <TextInput placeholder="Password" placeholderTextColor="#36485f" style={styles.textInput} secureTextEntry={true} />
                            <Button

                                style={{ marginLeft: 15, marginRight: 15, padding: 8, borderWidth: 1 }}
                                color="#36485f"
                                mode="contained"
                                icon="email"

                            >
                                <View />
                                <Text>login with email</Text>
                            </Button>
                            <Text style={styles.txt}>or</Text>
                            <Button

                                style={{ marginLeft: 15, marginRight: 15, padding: 8 }}
                                color="white"
                                mode="contained"
                                icon="google"
                                onPress={() => this.signInWithGoogleAsync()}>
                                <View />
                                <Text>continue with google</Text>
                            </Button>


                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

}

export default LoginScreen;

const styles = StyleSheet.create({
    textInput: {
        color: '#36485f',
        height: 40,
        marginBottom: 50,
        borderBottomColor: '#36485f',
        borderBottomWidth: 1,
        marginLeft: 30,
        marginRight: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 30,
        paddingRight: 30,
    },
    regform: {
        alignSelf: 'stretch'
    },
    containerView: {
        flex: 1,
    },

    loginScreenContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoText: {
        fontSize: 40,
        color: '#36485f',
        fontWeight: "900",
        marginBottom: 50,
        textAlign: 'center',
    },
    loginFormView: {
        flex: 1
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 15,

    },

    txt: {
        color: '#36485f',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 15,

    }
})

