import firebase from 'firebase'; // 4.8.1

class Fire {
  constructor() {
    if(!firebase.apps.length){
      this.init();
      
    }
    
    
  }

  init = () =>
    firebase.initializeApp({
    apiKey: "AIzaSyDCDTPo7A7CxdLK6_G947zHclZC10ZgPh0",
    authDomain: "coursehelp-8d1c8.firebaseapp.com",
    databaseURL: "https://coursehelp-8d1c8.firebaseio.com",
    projectId: "coursehelp-8d1c8",
    storageBucket: "coursehelp-8d1c8.appspot.com",
    messagingSenderId: "192738333169",
    appId: "1:192738333169:web:c84d0a5d65eae21425f450",
    measurementId: "G-8KE4X2NY85"
  })

  get uid() {
    
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { timestamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const message = {
      _id,
      createdAt:timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
}

Fire.shared = new Fire();
export default Fire;
