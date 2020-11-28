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
            setFilteredGroups(list)
        })
    }, [publicity, subject, keyword,showOptions])
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