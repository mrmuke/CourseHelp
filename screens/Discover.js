import React, { useEffect, useState } from 'react';
//import { render } from 'react-dom';
import { View, StyleSheet, Text, Group } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Searchbar, Button, Caption, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from 'firebase'

export default function Discover() {
    const [publicity, setPublicity] = useState("public")

    const [subject, setSubject] = useState("All")
    const [keyword, setKeyword] = useState("")
    const [showSubjects, setShowSubjects] = useState(false)
    const subjects = ["Science", "Economics", "Math", "History", "Physics", "All"]
    const [subjectFilter, setSubjectFilter] = useState("")
    const [showOptions, setShowOptions] = useState(false)

    const [filteredGroups, setFilteredGroups] = useState([])
    useEffect(() => {
        firebase.database().ref('groups/').on('value', snapshot => {
            var list = []
            snapshot.forEach(item => {
                var i = item.val()
                i["id"] = item.key
                if(i.name.includes(keyword)){
                    list.push(i)
                }

            })
            if(showOptions){
                list=list.filter(e=>e.publicity===publicity&&e.subject===subject)
            }
            list.reverse()
            setFilteredGroups(list)
        })
    }, [publicity, subject, keyword,showOptions])
    useEffect(()=>{
        getSuggestedGroups()
    },[])
    function getSuggestedGroups(){
        firebase.database().ref('groups/').on('value',snap=>{
            var suggested = []
            snap.forEach(item=async()=>{
                let cur = item.val()
                cur["similarity"]=0.0
                for(var i =0;i<cur.members.length;i++){
                   /*  console.log(await getUser(cur.members[i])) */
                }
            })
        })
    }
    function similarity(self, person) {
        let userArr = self["bio"].split(" ");
        let userArrCount = [];
        for (let word in userArr) {
            var skip = false;
            for (let obj in userArrCount) {
                if (userArrCount[obj].word == userArr[word]) {
                    userArrCount[obj].count++;
                    skip = true;
                    break;
                }
            }
            if (!skip) {
                userArrCount.push({
                    word: userArr[word].toLowerCase(),
                    count: 1
                })
            }
        }
        let school = 0;
        let grade = 0;
        if (self["grade"] == person["grade"]) {
            grade = 1;
        }
        if (self["school"]["item"] == person["school"]["item"]) {
            school = 1;
        }
        let arr = person["bio"].split(" ");
        let arrCount = [];
        for (let word in arr) {
            var skip = false;
            for (let obj in arrCount) {
                if (arrCount[obj].word == arr[word]) {
                    arrCount[obj].count++;
                    skip = true;
                    break;
                }
            }
            if (!skip) {
                arrCount.push({
                    word: arr[word].toLowerCase(),
                    count: 1
                })
            }
        }
        let countTop = 0;
        let countBottom1 = 0;
        let countBottom2 = 0;
        for (let obj in userArrCount) {
            for (let obj1 in arrCount) {
                countBottom1 += (arrCount[obj1].count) * (arrCount[obj1].count)
                if (userArrCount[obj].word == arrCount[obj1].word) {
                    countTop += (userArrCount[obj].count * arrCount[obj1].count)
                }
            }
            countBottom2 += (userArrCount[obj].count) * (userArrCount[obj].count)
        }
        countBottom2 = countBottom2 / userArrCount.length;
        countBottom1 = Math.sqrt(countBottom1);
        countBottom2 = Math.sqrt(countBottom2);
        let cosineSimilarity = countTop / (countBottom1) * (countBottom2);
        let similarity = (cosineSimilarity * 0.3) + (0.4 * school) + (0.3 * grade);
        return similarity;
    }
    function getUser(id){
        firebase.database().ref('users/'+id).once('value',snap=>{
            let item = snap.val()
            item["uid"]=snap.key
            return item
        })
    }
    function joinGroup(c){
        firebase.database().ref('groups/'+c.id).once('value',snapshot=>{
            var members=snapshot.val().members||[]
            members.push(firebase.auth().currentUser.uid)
            firebase.database().ref('groups/'+c.id).update({
                members
            })
        })
        
    }
    function leaveGroup(c){
        firebase.database().ref('groups/'+c.id).once('value',snapshot=>{
            var members=snapshot.val().members
            members=members.filter(e=>e!=firebase.auth().currentUser.uid)
            firebase.database().ref('groups/'+c.id).update({
                members
            })
        })
    }
    function applyGroup(c){
        firebase.database().ref('groups/'+c.id).once('value',snapshot=>{
            var pending=snapshot.val().pending||[]
            pending.push(firebase.auth().currentUser.uid)
            firebase.database().ref('groups/'+c.id).update({
                pending
            })
        })
    }
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#003152', padding: 10, borderRadius: 10, diplsya: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Searchbar style={{ flex: 1 }} placeholder="Discover..." onChangeText={text => setKeyword(text)} />
                <View style={{ backgroundColor: 'white', borderRadius: 50, marginLeft: 5 }}><Icon onPress={() => setShowOptions(!showOptions)} name="expand-more" size={30} /></View></View>
            {showOptions &&
                <>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                        <Button onPress={() => setPublicity("public")} style={{ flex: 1 }} contentStyle={{ padding: 10 }} color="#fff" mode="contained" icon={publicity === "public" && "check"} ><Caption>Public</Caption></Button>

                        <Button onPress={() => setPublicity("private")} style={{ flex: 1 }} contentStyle={{ padding: 10 }} color="#fff" mode="contained" icon={publicity === "private" && "check"}><Caption>Private</Caption></Button>
                    </View>

                    <Button onPress={() => setShowSubjects(!showSubjects)} contentStyle={{ padding: 10, borderRadius: 10 }} color="#fff" mode="contained" ><Caption style={{ fontSize: 15 }}>Selected Subject: {subject}</Caption></Button>
                    {showSubjects && <><Searchbar onChangeText={text => setSubjectFilter(text)} />{subjects.filter(subject => subject.toLowerCase().includes(subjectFilter.toLowerCase())).map(subject =>
                        <Button key={subject} style={{ display: 'flex' }} mode="contained" color="white" onPress={() => { setSubject(subject); setShowSubjects(false) }}>{subject}</Button>
                    )}</>}</>}
            <ScrollView>
                {filteredGroups.map((c) => (
                    <Card style={{ margin: 5 }} key={c.id}>
                        <Card.Title title={c.name} subtitle={"Surviving " +c.subject} left={props => <Icon name="group" {...props} />} />
                        <Card.Content>
                            <Caption style={{ marginBottom: 10 }}>{c.description}</Caption>
                        </Card.Content>
                        <Card.Actions>
                            {c.members&&c.members.some(e=>e===firebase.auth().currentUser.uid)?<Button style={{ flex: 1 }} mode="contained" color="#003152" onPress={()=>leaveGroup(c)}>Leave</Button>:c.publicity==="public"?<Button onPress={()=>joinGroup(c)} style={{ flex: 1 }} mode="contained" color="#003152">Join</Button>:c.pending&&c.pending.some(e=>e==firebase.auth().currentUser.uid)?<Button style={{ flex: 1 }} mode="contained" color="#003152">Awaiting Approval</Button>:<Button onPress={()=>applyGroup(c)} style={{ flex: 1 }} mode="contained" color="#003152">Apply</Button>}

                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>

        </View>


    );


}


const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})