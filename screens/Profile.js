import React, { Component } from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase'
class Profile extends Component {

    render() {
        
        return (
            <View style={styles.container}>
                <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
            </View>
        );
    }

}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})