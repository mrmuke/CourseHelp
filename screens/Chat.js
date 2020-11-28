// @flow
import React from 'react';
import { Actions, GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import firebase from 'firebase'
import Fire from '../Fire';
import { Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Button, IconButton, Modal, Portal, Provider, TextInput, Title } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';
import Profile from './Profile';


class Chat extends React.Component {
  
  constructor(props) {
    
    super(props);
    
    this.state = {
      database: new Fire(this.props.route.params.group),
      messages: [],
      user: null,
      createQuestion: false,
      question: "",
      answers: [],
      correct:-1,
      uploading:false,
      userID:null
    };

    this.renderActions = this.renderActions.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.handleImagePicked=this.handleImagePicked.bind(this);
    this.navigateProfile=this.navigateProfile.bind(this)
  }



  renderActions() {

    return (

      <View style={{ flexDirection: 'row' }}>
        <Icon name="upload" size={40} onPress={this.uploadPhoto} />
        <Icon onPress={() => this.setState({ createQuestion: true })} name="comment-question" size={40} />
      </View>

    )
  }
  get user() {
    const { user } = this.state
    if (!user) {
      return null
    }
    return {

      name: user.username,
      avatar: user.profile_picture,
      _id: this.state.database.uid,
    }
  }
  uploadPhoto= async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
    this.handleImagePicked(result);
}
  handleImagePicked=async(pickerResult)=> {
  try {
    this.setState({uploading:true})
      if (!pickerResult.cancelled) {
          var url = await this.uploadImageAsync(pickerResult['uri']);
          console.log(url);
          await this.sendImage(url)
      }
  } catch (e) {
      console.log(e);
      Alert.alert('Upload failed, sorry :(');
  } finally {
    this.setState({uploading:false})
  }
};

uploadImageAsync=async(uri)=> {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
          resolve(xhr.response);
      };
      xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
  });

  const ref = firebase
      .storage()
      .ref()
      .child('groupChat/'+Date.now())
  const snapshot = await ref.put(blob);
  blob.close();

  return await snapshot.ref.getDownloadURL();
}
sendImage(url){
  firebase.database().ref('messages/'+this.props.route.params.group).push({
    text:this.state.question,
    user:this.user,
    timestamp:firebase.database.ServerValue.TIMESTAMP,
    image:url
  })
}
  sendQuestion() {
    if(this.state.question.length==0||this.state.answers.some(e=>e.length==0)||this.state.correct==-1){
      Alert.alert("Please fill out all fields and select the correct answer")
      return;
    }
    
    firebase.database().ref('messages/'+this.props.route.params.group).push({
      text:this.state.question,
      user:this.user,
      timestamp:firebase.database.ServerValue.TIMESTAMP,
      quickReplies: {
        type: 'radio', // or 'checkbox',
        keepIt: true,
        values: 
          this.state.answers.map((c,index)=>(
            {title:c, value:index===this.state.correct?"Correct":"Incorrect"}
          ))

        ,
      },
    }).then(()=>{
      this.setState({question:"", answer:[],correct:-1,createQuestion:false})
    })


  }
  onQuickReply(reply){
    Alert.alert(reply[0].value)
  }
  navigateProfile(user){
   this.setState({userID:user._id})
  }
  render() {
    if(this.state.userID){
      return <View style={{flex:1}}><Button onPress={()=>this.setState({userID:null})} icon="arrow-left">Back</Button><Profile userID={this.state.userID}/></View>
    }
    return (



      <View style={{ flex: 1 }}>
        {this.state.createQuestion ?
          <View style={{ padding: 20 }}>
            <Title style={{ textAlign: 'center' }}>Create Question</Title>
            <TextInput placeholder="Input quiz question..." value={this.state.question} onChangeText={text => this.setState({ question: text })} />
            <Button style={{ alignSelf: 'flex-end' }} icon="plus" color="black" onPress={() => this.setState({ answers: this.state.answers.concat("") })}>Add Answer</Button>
            {this.state.answers.map((c, index) => (
              <View style={{flexDirection:'row', alignItems:'center'}}><IconButton icon={this.state.correct==index?"circle":"circle-outline"} onPress={()=>this.setState({correct:index})}/><TextInput key={index} style={{ marginTop: 5, flex:1 }} placeholder={`Answer ${index + 1}:`} value={c} onChangeText={text => {
                const copy = [...this.state.answers ]
                copy[index] = text
                this.setState({ answers: copy })}
              }/></View>
            ))}
            <Button style={{ marginTop: 5 }} onPress={this.sendQuestion} contentStyle={{ padding: 15 }} color="black" mode="contained">Send to Group</Button>
          </View>
          :
          this.state.uploading?
          <View style={{justifyContent:'center', flex:1}}>
          <ActivityIndicator style={{margin:'auto'}}/></View>
          :
          <GiftedChat
            renderUsernameOnMessage={true}
            messages={this.state.messages}
            renderActions={this.renderActions}
            onSend={this.state.database.send}
            user={this.user}
            onQuickReply={this.onQuickReply}
            placeholder="Learn together..."
            onPressAvatar={this.navigateProfile}
        
            

          />}

      </View>
    );
  }

  componentDidMount() {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snap => {
      this.setState({ user: snap.val() })
    })
    this.state.database.on(message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }

    );
  }
}

export default Chat;
