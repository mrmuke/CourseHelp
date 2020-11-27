import React, { useEffect, useState } from 'react';
//import { render } from 'react-dom';
import { ScrollView, View, Linking, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import { Button, Card, Title, Caption, Chip, IconButton, Provider, Portal, Dialog, Text } from 'react-native-paper';
export default function Home(props) {
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
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


        return (
            <View style={{height:Dimensions.get('screen').height}}>
            <ScrollView style={{padding:15}}>
                
                
                <View style={{flex:1, flexDirection:'row', margin:10, justifyContent:'space-between'}}>
                <Title>My Study Groups</Title>
                <Button color="#003152" mode="contained" onPress={()=>props.navigation.navigate('CreateGroup')}>+ Create</Button>
                
                </View>
                {groups.map(group=>(
                
                        <View key={group.id} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',margin:5, padding:15, backgroundColor:'white', borderRadius:10}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Icon size={40} name="group" style={{marginRight:10}}/>
                        <View style={{flexDirection:'column'}}>
                        <Title>{group.name}</Title>
                        <Chip icon="information">{group.subject}</Chip></View></View>
                        <View style={{flexDirection:'row'}}>
                        <IconButton icon="settings" style={{backgroundColor:'#003152'}} onPress={()=>setGroup(group)} color="white"></IconButton>

                        <IconButton icon="chat" style={{backgroundColor:'#003152'}} onPress={()=>props.navigation.navigate('Chat', {group:group.name})} color="white"></IconButton>
                        <IconButton icon="close" style={{backgroundColor:'#003152'}} onPress={()=>leaveGroup(group)} color="white"></IconButton>

                        </View>
                        </View>
                        

                        
                    
                    
                ))}
                
                
            </ScrollView><Provider>
                    <Portal>
                        <Dialog style={{ backgroundColor: "white" }} visible={group}>
                                    <Dialog.Title style={{ color: 'black' }}>{group&&group.name}</Dialog.Title>
                                    <Dialog.Content>
                                        <Caption>{group&&group.description}</Caption>
                                        {group&&group.pending&&<View>
                                        <Title style={{marginTop:10}}>Pending</Title>
                                        {group.pending.map(c=>(
                                            <View style={{padding:5, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <User key={c} user={c}/>
                                            <View style={{flexDirection:'row'}}>
                                            <IconButton  icon="check" color="green"></IconButton>
                                            <IconButton icon="close" color="red"></IconButton>
                                            </View>
                                            </View>
                                        ))}</View>}
                                        <Dialog.Actions>
                                            <Button color='#36485f' labelStyle={{ fontWeight: 'bold', fontSize: 15, color: 'black' }} onPress={() => setGroup(null)}>Close</Button>
                                        </Dialog.Actions>
                                    </Dialog.Content>
                        </Dialog></Portal></Provider></View>
            
        );
    

}
function User({user, type}){
    const [cur,setCur] = useState(null)
    useEffect(()=>{
        firebase.database().ref('users/'+user).once('value',snap=>[
            setCur(snap.val())
        ])
    },[])
    if(!cur){
        return null
    }
  /*   if(type==="username"){ */
        return <Text>{cur.username}</Text>
   /*  }
    else{
        return <Image src={}
    } */
    
}