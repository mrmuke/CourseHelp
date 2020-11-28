import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, RadioButton, Title, Subheading } from 'react-native-paper';

export default function QuestionComponent({courses, index, pickAnswer}) {
    var [checked, setChecked] = useState(0);

    useEffect(()=>{
        pickAnswer(checked, index);
    },[checked])

    return (
        <Card>
            <Card.Content>
                <Title>{(() => {
                    return courses["question"];
                })()}</Title>
                <Subheading style={{ marginBottom: 20, marginTop: 10 }}>Question {index}</Subheading>
                <View style={{ flexDirection: "row" }}>
                    <RadioButton
                        value="HELLO"
                        status={checked == 1 ? 'checked' : 'unchecked'}
                        onPress={()=>{setChecked(1)}}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][0];
                    })()}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <RadioButton
                        value="HELLO"
                        status={checked == 2 ? 'checked' : 'unchecked'}
                        onPress={()=>{setChecked(2)}}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][1];
                    })()}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <RadioButton
                        value="HELLO"
                        status={checked == 3 ? 'checked' : 'unchecked'}
                        onPress={()=>{setChecked(3)}}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][2];
                    })()}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <RadioButton
                        value="HELLO"
                        status={checked == 4 ? 'checked' : 'unchecked'}
                        onPress={()=>{setChecked(4)}}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][3];
                    })()}</Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    answers: {
        fontSize: 18,
        paddingTop: 4
    }
})