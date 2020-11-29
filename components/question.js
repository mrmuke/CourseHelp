import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, RadioButton, Title, Subheading } from 'react-native-paper';

export default function QuestionComponent({ courses, index, pickAnswer, menuText }) {
    var [checked, setChecked] = useState(0);

    useEffect(() => {
        setChecked(0);
    }, [menuText])

    useEffect(() => {
        pickAnswer(checked, index);
    }, [checked]);

    return (
        <Card style={{ backgroundColor: 'white', marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
            <Card.Content>
                <Title style={{ color: 'black', marginTop: 20 }}>{(() => {
                    return courses["question"];
                })()}</Title>
                <Subheading style={{ marginBottom: 40, color: "#003152" }}>Question {index}</Subheading>
                <View style={styles.viewAnswer}>
                    <RadioButton
                        color="#5b59fb"
                        value="HELLO"
                        status={checked == 1 ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked(1) }}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][0];
                    })()}</Text>
                </View>
                <View style={styles.viewAnswer}>
                    <RadioButton
                        color="#5b59fb"
                        value="HELLO"
                        status={checked == 2 ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked(2) }}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][1];
                    })()}</Text>
                </View>
                <View style={styles.viewAnswer}>
                    <RadioButton
                        color="#5b59fb"
                        value="HELLO"
                        status={checked == 3 ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked(3) }}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][2];
                    })()}</Text>
                </View>
                <View style={styles.viewAnswer}>
                    <RadioButton
                        color="#5b59fb"
                        value="HELLO"
                        status={checked == 4 ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked(4) }}
                    /><Text style={styles.answers}>{(() => {
                        return courses["answers"][3];
                    })()}</Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    viewAnswer: {
        flexDirection: "row",
        marginBottom: 15,
    },
    answers: {
        fontSize: 18,
        paddingTop: 4
    }
})