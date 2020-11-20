import React, { Component, useState } from 'react';
//import { render } from 'react-dom';
import { Text, ScrollView, View, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Avatar, Button, Card, Title, Paragraph, Searchbar, Caption, TextInput, RadioButton } from 'react-native-paper';
export default function Home(props) {
   
    function leftContent (props){return <Icon {...props} name="group" />}
    

        return (
            <ScrollView style={{padding:15}}>
                
                
                <View style={{flex:1, flexDirection:'row', margin:10, justifyContent:'space-between'}}>
                <Title>My Study Groups</Title>
                <Button color="#59d0fb" mode="contained" onPress={()=>props.navigation.navigate('CreateGroup')}>+ Create</Button>
                
                </View>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" subtitle="Physics Conquerers" left={leftContent} />
                    <Card.Content>
                    <Title>Surviving AP Physics</Title>
                    <Caption style={{marginBottom:10}}>Short Description of group.Short Description of group.Short Description of group.Short Description of group.Short Description of group.</Caption>
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Actions>
                    <Button onPress={()=>this.props.navigation.navigate('Chat', {group:"Surviving AP Chem"})}>Chat</Button>
                    <Button onPress={()=>Linking.openURL('http://meet.google.com/new')}>Call</Button>
                    <Button>Leave</Button>

                    </Card.Actions>
                </Card>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" subtitle="Physics Conquerers" left={leftContent} />
                    <Card.Content>
                    <Title>Surviving AP Physics</Title>
                    <Caption style={{marginBottom:10}}>Short Description of group.Short Description of group.Short Description of group.Short Description of group.Short Description of group.</Caption>
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Actions>
                    <Button>Chat</Button>
                    <Button onPress={()=>Linking.openURL('http://meet.google.com/new')}>Call</Button>
                    <Button>Leave</Button>

                    </Card.Actions>
                </Card>
            </ScrollView>
            
        );
    

}
