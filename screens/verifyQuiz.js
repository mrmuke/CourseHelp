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
    var [answer, setAnswer] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    var ItemList = [];

    useEffect(() => {
        firebase.database().ref('verify').once('value').then((snapshot) => {
            setCourses(snapshot.val());
        });
    }, []);

    useEffect(()=>{
        let item = [];
        var index = 1;
        if(menuText != "Pick a class"){
            for (let each of courses[menuText]) {
                if(each != undefined){
                    item.push(<QuestionComponent courses={each} index={index} pickAnswer={(key, index)=>{
                        var newArr = [...answer];
                        newArr[index] = key;
                        console.log(newArr);
                        setAnswer(newArr);
                    }}/>);
                    index++;
                }
            }
            setQuestionList(item);
        }
    }, [menuText]);

    for (let each in courses) {
        ItemList.push(<Menu.Item key={each} onPress={() => { setMenuText(each); setVisible(false); }} style={styles.menuItem} title={each} />);
    }

    function checkAnswers() {
        setQuestionList([]);
    }
    return (
        <Provider>
            <ScrollView>
                <Menu
                    visible={visible}
                    onDismiss={() => { setVisible(false) }}
                    style={{ width: Dimensions.get('screen').width - 15, }}
                    anchor={<Button style={{ marginTop: 30 }} onPress={() => { setVisible(true); }}>{menuText}</Button>}>
                    {ItemList}
                </Menu>
                {questionList}
                {(() => {
                    if (questionList.length > 0) {
                        return <Button mode="contained" onPress={() => {
                            checkAnswers();
                        }} color="#5b59fb" style={{ margin: 10, padding: 5 }}>Submit</Button>;
                    }
                })()}
                <Button mode="contained" onPress={() => {
                    exit();
                }} color="#5b59fb" style={{ margin: 10, padding: 5 }}>BACK</Button>
            </ScrollView>
        </Provider>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        width: Dimensions.get('screen').width
    }
});