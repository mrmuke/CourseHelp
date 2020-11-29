import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import firebase from 'firebase'
import { Button, Menu, Provider, Card, RadioButton, Paragraph, Title, Subheading } from 'react-native-paper';
import QuestionComponent from '../components/question';

export default function VerifyQuiz({ exit }) {
    var [visible, setVisible] = useState(false);
    var [menuText, setMenuText] = useState('Pick a class');
    var [courses, setCourses] = useState(null);
    var [questionList, setQuestionList] = useState([]);
    var [answer, setAnswer] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
    });
    var ItemList = [];

    useEffect(() => {
        firebase.database().ref('verify/').once('value').then((snapshot) => {
            setCourses(snapshot.val());
        });
    }, []);

    useEffect(() => {
        let item = [];
        var index = 1;
        if (menuText != "Pick a class") {
            for (let each of courses[menuText]) {
                if (each) {
                    item.push(<QuestionComponent key={"A:" + index} courses={each} index={index} pickAnswer={(key, index) => {
                        var newObj = answer;
                        newObj[index] = key;
                        setAnswer(newObj);
                    }} menuText={menuText} />);
                    index++;
                }
            }
            setQuestionList(item);
        }
        setAnswer({
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0
        })
    }, [menuText]);
    for (let each in courses) {
        
        ItemList.push(<Menu.Item key={each} onPress={() => { setMenuText(each); setVisible(false); }} titleStyle={{ color: 'black' }} style={{ flex: 1 }} title={each} />);
    }

    function checkAnswers() {
        var correct = 0;
        for (let i = 1; i < 11; i++) {
            if (answer[i] == courses[menuText][i]['correct']) {
                correct++;
            }
        }
        exit('check', menuText, correct);
    }
    console.log(courses)
    return (
        <Provider>
            <ScrollView>
                <View><Menu
                    visible={visible}
                    onDismiss={() => { setVisible(false) }}
                    style={{ marginTop: 90 }}
                    anchor={<Button contentStyle={{ padding: 30 }} mode="contained" color="black" onPress={() => { setVisible(true); }}>{menuText}</Button>}>
                    {ItemList}
                </Menu></View>
                {questionList}
                {(() => {
                    if (questionList.length > 0) {
                        return <Button mode="contained" onPress={() => {
                            checkAnswers();
                        }} labelStyle={{ color: 'white' }} style={{ backgroundColor: '#003152', marginHorizontal: 30,marginTop:30, padding: 5 }}>Submit</Button>;
                    }
                })()}
                <Button mode="contained" onPress={() => {
                    exit('back', null, null);
                }} color="#003152" labelStyle={{ color: 'white' }} style={{ margin:30,padding: 5, backgroundColor: 'lightblue' }}>BACK</Button>
            </ScrollView>
        </Provider>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        flex: 1
    }
});
//Michael - end cleanup suggested groups
//Aaron -select answer  click on user in home and forum