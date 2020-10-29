import React, { Component } from 'react';
//import { render } from 'react-dom';
import { Text, ScrollView, View, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Avatar, Button, Card, Title, Paragraph, Searchbar, Caption } from 'react-native-paper';
import firebase from 'firebase'
class Home extends Component {
    state={showSearch:false}
    LeftContent = props => <Icon {...props} name="group" />
    render() {
        
        return (
            <ScrollView style={{padding:15}}>
                <View style={{backgroundColor:'#59A8FB', padding:10, borderRadius:10}}>
                <Searchbar onFocus={()=>this.setState({showSearch:true})} onBlur={()=>this.setState({showSearch:false})} placeholder={this.state.showSearch?"Optional Keyword...":"Discover..."}/></View>
                {this.state.showSearch&&<View><Button>hi</Button></View>}
                <View style={{flex:1, flexDirection:'row', margin:10, justifyContent:'space-between'}}>
                <Title>My Study Groups</Title>
                <Button color="#59d0fb" mode="contained">+ Create</Button>
                
                </View>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" subtitle="Physics Conquerers" left={this.LeftContent} />
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
                    <Card.Title title="AP Physics C" subtitle="Physics Conquerers" left={this.LeftContent} />
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

}

export default Home;

