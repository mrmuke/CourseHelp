import React, { Component } from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet } from 'react-native';
class Forum extends Component {

    render() {
        
        return (
            <View style={styles.container}>
                <Text>Ask and Answer Questions</Text>
            </View>
        );
    }

}

export default Forum;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})