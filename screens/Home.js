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
                list.push(item.val())
            })
            setGroups(list)
            console.log(list)
        })
   },[])
    function leftContent (props){return <Icon {...props} name="group" />}
    

        return (
            <ScrollView style={{padding:15}}>
                
                
                <View style={{flex:1, flexDirection:'row', margin:10, justifyContent:'space-between'}}>
                <Title>My Study Groups</Title>
                <Button color="#59d0fb" mode="contained" onPress={()=>props.navigation.navigate('CreateGroup')}>+ Create</Button>
                
                </View>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" left={leftContent} />
                    <Card.Content>
                    <Title>Surviving AP Physics</Title>
                    <Caption style={{marginBottom:10}}>Short Description of group.Short Description of group.Short Description of group.Short Description of group.Short Description of group.</Caption>
                    </Card.Content>
                    <Card.Actions>
                    <Button onPress={()=>this.props.navigation.navigate('Chat', {group:"Surviving AP Chem"})}>Chat</Button>
                    <Button onPress={()=>Linking.openURL('http://meet.google.com/new')}>Call</Button>
                    <Button>Leave</Button>

                    </Card.Actions>
                </Card>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" left={leftContent} />
                    <Card.Content>
                    <Title>Surviving AP Physics</Title>
                    <Caption style={{marginBottom:10}}>Short Description of group.Short Description of group.Short Description of group.Short Description of group.Short Description of group.</Caption>
                    </Card.Content>
                    <Card.Actions>
                    <Button>Chat</Button>
                    <Button onPress={()=>Linking.openURL('http://meet.google.com/new')}>Call</Button>
                    <Button>Leave</Button>

                    </Card.Actions>
                </Card>
            </ScrollView>
            
        );
    

}
