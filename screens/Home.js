import React, { Component } from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet } from 'react-native';
class Home extends Component {

    render() {
        
        return (
            <View style={styles.container}>
                <Text>Home</Text>
            </View>
        );
    }

}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})