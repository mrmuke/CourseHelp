import React, { useEffect, useState } from 'react';
//import { render } from 'react-dom';
import { View, StyleSheet, Text, Group, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Searchbar, Button, Caption, Card, Title, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from 'firebase'

export default function Discover() {
    const [publicity, setPublicity] = useState("public")

    const [subject, setSubject] = useState("All")
    const [keyword, setKeyword] = useState("")
    const [showSubjects, setShowSubjects] = useState(false)
    const subjects = ["All", "Science", "Math", "History", "English", "Art", "Language", "Technology"]
    const [subjectFilter, setSubjectFilter] = useState("")
    const [showOptions, setShowOptions] = useState(false)
    const [suggested,setSuggested]=useState([])
    const [filteredGroups, setFilteredGroups] = useState([])
    useEffect(() => {
        firebase.database().ref('groups/').on('value', snapshot => {
            var list = []
            snapshot.forEach(item => {
                var i = item.val()
                i["id"] = item.key
                if (i.name.includes(keyword)) {
                    list.push(i)
                }
            })
            if (showOptions) {
                list = list.filter(e => e.publicity === publicity && e.subject === subject)
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
            /* snap.forEach(item=async()=>{
                let cur = item.val()
                cur["similarity"]=0.0
                for(var i =0;i<cur.members.length;i++){
                     console.log(await getUser(cur.members[i])) 
                }
            }) */
            snap.forEach(item=>{
                let cur = item.val()
                console.log(cur)
                suggested.push(cur)
                
            })
            setSuggested(suggested)
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
            firebase.database().ref('groups/' + c.id).update({
                members
            })
        })

    }
    function leaveGroup(c) {
        firebase.database().ref('groups/' + c.id).once('value', snapshot => {
            var members = snapshot.val().members
            members = members.filter(e => e != firebase.auth().currentUser.uid)
            firebase.database().ref('groups/' + c.id).update({
                members
            })
        })
    }
    function applyGroup(c) {
        firebase.database().ref('groups/' + c.id).once('value', snapshot => {
            var pending = snapshot.val().pending || []
            pending.push(firebase.auth().currentUser.uid)
            firebase.database().ref('groups/' + c.id).update({
                pending
            })
        })
    }
    return (
        <View>
            <Appbar.Header style={{ backgroundColor: '#003152', height: 44 }}>
                <Appbar.Content titleStyle={{ fontWeight: 'bold' }} title="Discover" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={{ backgroundColor: '#003152', padding: 10, borderRadius: 10, diplay: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Searchbar style={{ flex: 1 }} placeholder="Discover..." onChangeText={text => setKeyword(text)} />
                    
                    <View style={{ backgroundColor: 'white', borderRadius: 50, marginLeft: 5 }}><Icon onPress={() => setShowOptions(!showOptions)} name="expand-more" size={30} /></View></View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', backgroundColor:'white', padding:10, borderRadius:10, paddingHorizontal:30, margin:10, borderWidth:3, borderColor:'grey'}}>
                        
                        {suggested.map(c=>(
                            <View style={{flexDirection:'column', borderRadius:50, alignItems:'center',}}>
                                    <UserPic  user={c.members[0]}/>
                            
                            </View>
                        ))}
                        
                    </View>
                {showOptions &&
                    <>
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <Button onPress={() => setPublicity("public")} style={{ flex: 1 }} contentStyle={{ padding: 10 }} color="#eee" mode="contained" icon={publicity === "public" && "check"} ><Caption>Public</Caption></Button>

                            <Button onPress={() => setPublicity("private")} style={{ flex: 1 }} contentStyle={{ padding: 10 }} color="#eee" mode="contained" icon={publicity === "private" && "check"}><Caption>Private</Caption></Button>
                        </View>

                        <Button onPress={() => setShowSubjects(!showSubjects)} contentStyle={{ padding: 10, borderRadius: 10 }} color="#eee" mode="contained" ><Caption style={{ fontSize: 15 }}>Selected Subject: {subject}</Caption></Button>
                        {showSubjects && <><Searchbar onChangeText={text => setSubjectFilter(text)} />{subjects.filter(subject => subject.toLowerCase().includes(subjectFilter.toLowerCase())).map(subject =>
                            <Button key={subject} style={{ display: 'flex' }} mode="contained" color="white" onPress={() => { setSubject(subject); setShowSubjects(false) }}>{subject}</Button>
                        )}</>}</>}
                <ScrollView >
                    {filteredGroups.map((c) => (
                        <Card style={{ margin: 5, marginBottom: 10, backgroundColor: '#eee' }} key={c.id}>
                            <Card.Title style={{ color: '#003152' }} title={c.name} subtitle={"Surviving " + c.subject} left={props => <Icon name="group" {...props} />} />
                            <Card.Content>
                                <Caption style={{ marginBottom: 10 }}>{c.description}</Caption>
                            </Card.Content>
                            <Card.Actions>
                                {c.members && c.members.some(e => e === firebase.auth().currentUser.uid) ? <Button labelStyle={{ color: "white" }} style={{ flex: 1 }} mode="contained" color="#003152" onPress={() => leaveGroup(c)}>Leave</Button> : c.publicity === "public" ? <Button labelStyle={{ color: "white" }} onPress={() => joinGroup(c)} style={{ flex: 1 }} mode="contained" color="#003152">Join</Button> : c.pending && c.pending.some(e => e == firebase.auth().currentUser.uid) ? <Button labelStyle={{ color: "white" }} style={{ flex: 1 }} mode="contained" color="#003152">Awaiting Approval</Button> : <Button labelStyle={{ color: "white" }} onPress={() => applyGroup(c)} style={{ flex: 1 }} mode="contained" color="#003152">Apply</Button>}

                            </Card.Actions>
                        </Card>
                    ))}
                </ScrollView>
            </View>
        </View>


    );


}


const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})

function UserPic({user}) {
    const [cur, setCur] = useState(null)
    useEffect(() => {
        firebase.database().ref('users/' + user).once('value', snap => [
            setCur(snap.val())
        ])
    }, [])
    if (!cur) {
        return null
    }

        return <Image source={{ uri: cur.profile_picture }} style={{ borderRadius: 50, height: 50, width: 50}} />


}