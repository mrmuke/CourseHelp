// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'firebase'
import Fire from '../Fire';
import { View } from 'react-native';



class Chat extends React.Component {
  state = {
    database:new Fire(this.props.route.params.group),
    messages: [],
    user:null
  };
  
  get user() {
    const {user} = this.state
    if(!user){
      return null
    }
    return {
      
      name: user.username,
      avatar:user.profile_picture,
      _id: this.state.database.uid,
    }
  }
  

  render() {
    return (
      
      
                        
      <View style={{flex:1}}>
      <GiftedChat
      renderUsernameOnMessage={true}
        messages={this.state.messages}
        onSend={this.state.database.send}
        user={this.user}
      /></View>
    );
  }

  componentDidMount() {
    firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value',snap=>{
      this.setState({user:snap.val()})
    })
    this.state.database.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
}

export default Chat;
