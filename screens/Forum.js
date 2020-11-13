import React from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet } from 'react-native';
export default function Forum() {
        return (
            <View style={styles.container}>
                <Text>Ask and Answer Questions</Text>
            </View>
        );
    

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})