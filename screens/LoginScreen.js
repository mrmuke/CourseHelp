import React, { Component } from 'react';
import { render } from 'react-dom';
import { View, Text, StyleSheet, Button } from 'react-native';
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

    /*   iosClientId: '451006353013-ot4fj9fg8ijfrro6o7vj5l474205vtff.apps.googleusercontent.com', */
    render() {
        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>CourseHelp</Text>
                            <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
                            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} />
                            <Text style={styles.txt}>Login with Email</Text>
                            <Text style={styles.txt}>or</Text>
                            <Button
                                buttonStyle={styles.loginButton}
                                onPress={() => this.signInWithGoogleAsync()}
                                title="Continue with Google"
                            />

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

}

export default LoginScreen;

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
    },

    loginScreenContainer: {
        flex: 1,
        backgroundColor: '#59A8FB'
    },
    logoText: {
        fontSize: 40,
        color: 'white',
        fontWeight: "900",
        marginTop: 150,
        marginBottom: 30,
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
    loginButton: {
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',

    },
    txt: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 15,

    }
})

