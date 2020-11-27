import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Caption } from 'react-native-paper'
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'
//import styles from "./style";
import { Keyboard, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class LoginScreen extends Component {
    constructor(props) {
        super(props)

        this.state = ({
            email: '',
            password: '',
            signUp: false
        })
    }

    signUpUser = (email, password) => {
        try {
            if (this.state.password.length < 6) {
                alert("Password should be at least 6 characters")
                return;
            }
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!reg.test(this.state.email)) {
                alert("Invalid email...")
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(result => {
                    firebase
                        .database()
                        .ref('users/' + result.user.uid)
                        .set({
                            email: result.user.email,
                            profile_picture: "https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg",
                            username: 'HS Survivor',
                            bio: 'Hello!',
                            school: 'None',
                            grade: 'FRESHMAN',
                            //last_name: result.additionalUserInfo.profile.family_name,
                            created_at: Date.now()
                        })
                })
                .catch(() => {
                    alert("Email already exists!")
                })

        }
        catch (error) {
            console.log(error.toString())
        }
    }

    loginUser = (email, password) => {
        try {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
                firebase.database().ref('users/' + result.user.uid).update({
                    last_logged_in: Date.now(),

                })
            }).catch(e => {
                alert("Invalid login")
            })
        }
        catch (error) {
            console.log(error.toString())
        }
    }
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
            //console.log(firebaseUser)
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
                                .ref('users/' + result.user.uid)
                                .set({
                                    email: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    username: result.additionalUserInfo.profile.given_name,
                                    bio: 'Hello!',
                                    school: 'None',
                                    grade: 'FRESHMAN',
                                    //last_name: result.additionalUserInfo.profile.family_name,
                                    created_at: Date.now()
                                })
                                .then(function (snapshot) {
                                    //console.log('Snapshot', snapshot)
                                })
                        }
                        else {
                            firebase.database().ref('users/' + result.user.uid).update({
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
                androidClientId: '451006353013-r826qrrdbgavd6bdj5v9bhh6le1iqnjk.apps.googleusercontent.com',
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
                            <TextInput placeholder="Email" placeholderTextColor="#36485f" style={styles.textInput} onChangeText={text => this.setState({ email: text })} />
                            <TextInput placeholder="Password" placeholderTextColor="#36485f" style={styles.textInput} secureTextEntry={true} onChangeText={text => this.setState({ password: text })} />
                            {this.state.signUp ? <Button
                                onPress={() => this.signUpUser(this.state.email, this.state.password)}
                                style={{ marginLeft: 15, marginRight: 15, padding: 8, borderColor: 'white', borderWidth: 1 }}
                                color="white"

                                style={{ marginLeft: 15, marginRight: 15, padding: 8, borderWidth: 1 }}
                                color="#36485f"

                                mode="contained"
                                icon="email"

                            >
                                <View />
                                <Text>signup with email</Text>
                            </Button> : <Button

                                style={{ marginLeft: 15, marginRight: 15, padding: 8, borderColor: '#36485f', borderWidth: 1 }}
                                color="#36485f"

                                icon="email"
                                onPress={() => this.loginUser(this.state.email, this.state.password)}
                            >
                                    <View />
                                    <Text>login with email</Text>
                                </Button>}
                            <Text style={styles.txt}>or</Text>
                            <Button

                                style={{ marginLeft: 15, marginRight: 15, padding: 8 }}
                                color="#36485f"
                                mode="contained"
                                icon="google"
                                onPress={() => this.signInWithGoogleAsync()}>
                                <View />
                                <Text>continue with google</Text>
                            </Button>
                            <TouchableOpacity onPress={() => this.setState({ signUp: !this.state.signUp })}><Caption style={{ textAlign: 'center', color: '#36485f', fontSize: 15, padding: 5 }} >{this.state.signUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}</Caption></TouchableOpacity>


                        </View>
                    </View >
                </TouchableWithoutFeedback >
            </KeyboardAvoidingView >
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

