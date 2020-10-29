import firebase from 'firebase'; // 4.8.1

class Fire {
  constructor(group) {
    this.state={group:group}

  }

  get uid() {
    
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase.database().ref('messages/'+this.state.group);
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
export default Fire;
