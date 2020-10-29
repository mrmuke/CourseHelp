// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase, { database } from 'firebase'
import Fire from '../Fire';
import { TextInput } from 'react-native-paper';
import { View } from 'react-native';



class Chat extends React.Component {
  state = {
    database:new Fire(this.props.route.params.group),
    messages: [],
  };
  
  get user() {
    
    
    return {
      
      name: firebase.auth().currentUser.displayName,
      _id: this.state.database.uid,
    }
  }
  

  render() {
    return (
      
      
                        
      <View style={{flex:1}}>
      <GiftedChat
        messages={this.state.messages}
        onSend={this.state.database.send}
        user={this.user}
      /></View>
    );
  }

  componentDidMount() {
    this.state.database.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
}

export default Chat;
