import React, { useEffect, useState } from 'react';
//import { render } from 'react-dom';
import { ScrollView, View, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import { Button, Card, Title, Caption } from 'react-native-paper';
export default function Home(props) {
    const [groups, setGroups] = useState([])
   useEffect(()=>{
        firebase.database().ref('groups/').on('value', snapshot=>{
            var list= []
            snapshot.forEach(item=>{
                
                var i = item.val()
                if(i.members&&i.members.some(e=>e===firebase.auth().currentUser.uid)){
                    i["id"] = item.key
                list.push(i)
                }
                
            })
            setGroups(list)
        })
   },[])
   function leaveGroup(c){
    firebase.database().ref('groups/'+c.id).once('value',snapshot=>{
        var members=snapshot.val().members
        members=members.filter(e=>e!=firebase.auth().currentUser.uid)

        firebase.database().ref('groups/'+c.id).update({
            members
        })
    })
}
    function leftContent (props){return <Icon {...props} name="group" />}
    

        return (
            <ScrollView style={{padding:15}}>
                
                
                <View style={{flex:1, flexDirection:'row', margin:10, justifyContent:'space-between'}}>
                <Title>My Study Groups</Title>
                <Button color="#59d0fb" mode="contained" onPress={()=>props.navigation.navigate('CreateGroup')}>+ Create</Button>
                
                </View>
                {groups.map(group=>(
                    <Card style={{margin:5}} key={group.id}>
                        <Card.Title title={group.name + "-Surviving " + group.subject} left={leftContent} />
                        <Card.Content>
                        <Caption style={{marginBottom:10}}>{group.description}</Caption>
                        </Card.Content>
                        <Card.Actions>
                        <Button style={{ flex: 1 }} mode="contained" color="#003152" onPress={()=>props.navigation.navigate('Chat', {group:group.name})}>Chat</Button>
                        {/* <Button onPress={()=>Linking.openURL('http://meet.google.com/new')}>Call</Button> */}
                        <Button style={{ flex: 1 }} mode="contained" color="#003152" onPress={()=>leaveGroup(group)}>Leave</Button>

                        </Card.Actions>
                    </Card>
                ))}
                
                
            </ScrollView>
            
        );
    

}
