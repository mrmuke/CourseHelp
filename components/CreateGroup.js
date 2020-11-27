
import React, { useState } from 'react';
//import { render } from 'react-dom';
import { View } from 'react-native';
import firebase from 'firebase'
import { Button, Searchbar, Caption, TextInput } from 'react-native-paper';
export default function CreateGroup(props){
    const [subject, setSubject] = useState("All")
    const [subjectFilter, setSubjectFilter]= useState("")
    const [showSubjects, setShowSubjects] = useState(false)
    const subjects = ["Science", "Economics", "Math", "History", "Physics", "All"]
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [publicity, setPublicity]=useState("public")
    function createGroup(){
        firebase.database().ref('groups/').push({
            subject,
            description,
            name,
            publicity
        }).then(result=>{
            props.navigation.navigate('Home')
        })
    }
    return <View style={{padding:20}}>
        <Button onPress={()=>setShowSubjects(!showSubjects)} style={{marginBottom:5}} contentStyle={{ padding:10, borderRadius:10}} color="#e6e6e3" mode="contained" ><Caption style={{fontSize:15}}>Selected Subject: {subject}</Caption></Button>
                {showSubjects&&<><Searchbar onChangeText={text=>setSubjectFilter(text)}/>{subjects.filter(subject=>subject.toLowerCase().startsWith(subjectFilter.toLowerCase())).map(subject=>
                    <Button key={subject} style={{display:'flex'}} mode="contained" color="white" onPress={()=>{setSubject(subject);setShowSubjects(false)}}>{subject}</Button>
                )}</>}
                <TextInput placeholder="Group name..." onChangeText={text=>setName(text)}/>
                <TextInput style={{marginTop:5}} placeholder="Group description..." onChangeText={text=>setDescription(text)}/>
                <View style={{marginTop:5, display:'flex', flexDirection:'row'}}>
                <Button onPress={()=>setPublicity("public")} style={{flex:1}} contentStyle={{ padding:10}} color="#eee" mode="contained" icon={publicity==="public"&&"check"} ><Caption>Public</Caption></Button>

                <Button onPress={()=>setPublicity("private")} style={{flex:1}} contentStyle={{ padding:10}} color="#eee" mode="contained" icon={publicity==="private"&&"check"}><Caption>Private</Caption></Button>
                </View>
                <Button onPress={createGroup}  icon="cake" contentStyle={{padding:20}} style={{marginTop:10}} color="#003152" mode="contained">Survive HS Now!</Button>

            </View>
}