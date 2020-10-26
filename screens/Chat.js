// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'firebase'
import Fire from '../Fire';
import { View, Button } from 'react-native';



class Chat extends React.Component {

  state = {
    messages: [],
  };
  
  get user() {
    
    
    return {
      
      name: firebase.auth().currentUser.displayName,
      _id: Fire.shared.uid,
    }
  }
  

  render() {

    return (
      
                        

      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
}

export default Chat;
