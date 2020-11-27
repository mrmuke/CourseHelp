import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import * as firebase from 'firebase'
import { Button} from 'react-native-paper'
import EditProfile from './EditProfile';;
import VerifyQuiz from './verifyQuiz'

export default function Profile(props) {
    const [user, setUser] = useState(null)
    const [edit, setEdit] = useState(false)
    var [verify, setVerify] = useState(false);

    useEffect(() => {
        getUser();
    }, [])

    function getUser() {
 
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snapshot => {
            setUser(snapshot.val())
        })
    }

    if (user == null) {
        
        return null
    }

    if (edit) {
        return <EditProfile user={user} exit={() => { setEdit(false); getUser() }} />
    }

    if(verify){
        return <VerifyQuiz exit={()=> {setVerify(false)} }/>
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={{ uri: user.profile_picture }} />
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{user.username}</Text>
                        <Text style={styles.school}>{user.school["item"]}</Text>
                        <Text style={styles.class}>{user.grade.toUpperCase()}</Text>
                        <Text style={styles.description}>{user.bio}</Text>
                        <View style={styles.button}>
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Button mode='outlined' color='#5b59fb' contentStyle={{padding:5}} style={styles.buttonContainer} onPress={() => setEdit(true)}>Edit Profile</Button>
                                </View>
                                <View>
                                    <Button mode="outlined" color='#5b59fb' contentStyle={{padding:5}} style={styles.buttonContainer} onPress={() => setVerify(true)}>Verify Account</Button>
                                </View>
                            </View>
                            <Button mode="outlined" color='#5b59fb' contentStyle={{padding:2}} style={styles.buttonSignOut} onPress={() => firebase.auth().signOut()}>Sign Out</Button>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        backgroundColor: "#5b59fb",
        height: 150,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: "white",
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 80
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    school: {
        fontSize: 19,
        color: "#707070",
        marginTop: 30,
    },
    class: {
        fontSize: 19,
        color: "#707070",
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: "#707070",
        marginTop:30,
    },
    buttonContainer: {
        margin: 5,
        width:Dimensions.get('screen').width/2 - 10
    },
    buttonSignOut:{
        margin:5
    },
    button: {
        marginTop: 60,
        width:Dimensions.get('screen').width,
    }

})