import React, { useEffect, useState } from 'react';
//import { render } from 'react-dom';
import { ScrollView, View, Linking, Dimensions, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
import { Button, Title, Caption, Chip, IconButton, Provider, Portal, Text, Badge, Modal, TextInput, Subheading } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function Home(props) {
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
    const [members, setMembers] = useState([])
    const [description,setDescription]  = useState("")
    const [invites, setInvites] = useState([])
    const [userQuery, setUserQuery] = useState("")
    const [filteredUsers, setFilteredUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [viewInvites, setViewInvites] = useState(false)
    const [user, setUser] = useState(null)
    useEffect(() => {
        firebase.database().ref('groups/').on('value', snapshot => {
            var list = []
            snapshot.forEach(item => {

                var i = item.val()
                if (i.members && i.members.some(e => e === firebase.auth().currentUser.uid)) {
                    i["id"] = item.key
                    list.push(i)
                }

            })
            setGroups(list)
        })
        getInvites()
    }, [])
    function getInvites(){
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snap => {
            setUser(snap.val())
            var item =snap.val().invites||[]
            setInvites(item)
            if(item.length==0){
                setViewInvites(false)
            }
    })
        
    }
    useEffect(()=>{
        firebase.database().ref('users/').on('value', snap => {
            var list = []
            snap.forEach(function(user){
                let item = user.val()
                item["id"] =user.key

        
                if(group&&!group.members.some(e=>e==user.key)&&item.username.toLowerCase().startsWith(userQuery.toLowerCase())){
                    list.push(item)
                }
                
            })
            setFilteredUsers(list)


            
            })
    },[userQuery])
    function sendInvite(){
        setUserQuery("")
        if(group.pending&&group.pending.includes(selectedUser.id))
{
    removePending(selectedUser.id)
    joinGroup(selectedUser.id)

}

else{
        firebase.database().ref('users/'+ selectedUser.id).once('value',snap=>{
            let invites = snap.val().invites||[]
            invites.push(group.id)
            firebase.database().ref('users/'+ selectedUser.id).update({
                invites
            }).then(()=>{
                setSelectedUser(null)
            })
        })
    }
        
    }
    function leaveGroup(c) {
        Alert.alert(
            "Leave Group",
        "Are you sure you want to leave this group?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "LEAVE", onPress: () =>  firebase.database().ref('groups/' + c.id).once('value', snapshot => {
                var members = snapshot.val().members
                members = members.filter(e => e != firebase.auth().currentUser.uid)
    
                firebase.database().ref('groups/' + c.id).update({
                    members
                })
            }) }
            ],
            { cancelable: false }
          );
      
       
    }

    function joinGroup(c) {
        firebase.database().ref('groups/' + group.id).once('value', snapshot => {
            var members = snapshot.val().members || []
            members.push(c)
            firebase.database().ref('groups/' + group.id).update({
                members
            }).then(() => {
                setGroup(null)
            })
        })

    }

    function removePending(c) {
       
        firebase.database().ref('groups/' + group.id).once('value', snapshot => {
            var pending = snapshot.val().pending || []
            pending = pending.filter(e => e != c)
            firebase.database().ref('groups/' + group.id).update({
                pending
            }).then(() => {
                setGroup(null)
            })
        })
    }
    
    return (
        <View style={{ height: Dimensions.get('screen').height, }}>
            <ScrollView style={{ padding: 15 }}>
                {invites.length>0&&<Badge style={{ alignSelf: 'flex-start' }} onPress={()=>setViewInvites(true)}>{invites.length} NEW INVITES</Badge>}

                <View style={{ flex: 1, flexDirection: 'row', margin: 5, justifyContent: 'space-between' }}>
                    <Title>My Study Groups</Title>

                    <Button color="#003152" mode="contained" onPress={() => props.navigation.navigate('CreateGroup')}>+ Create</Button>

                </View>

                {groups.map(group => (
                    <View key={group.id}>
                        <TouchableOpacity onPress={()=>{setMembers(group.members), setDescription(group.description)}} style={{ flexDirection: 'row', alignSelf: 'flex-end', marginHorizontal: 20 }}>
                            {group.members.map(c => (
                                <User key={c} user={c} type="profile" />
                            ))}
                        </TouchableOpacity>
                        <View key={group.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 5, padding: 15, backgroundColor: 'white', borderRadius: 10, marginTop: -15, zIndex:-1 }}>


                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon size={40} name="group" style={{ marginRight: 10 }} />
                                <View style={{ flexDirection: 'column' }}>
                                    <Title>{group.name}</Title>
                                    <Chip icon="information">{group.subject}</Chip></View></View>
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton icon="settings" style={{ backgroundColor: '#003152' }} onPress={() => setGroup(group)} color="white"></IconButton>

                                <IconButton icon="chat" style={{ backgroundColor: '#003152' }} onPress={() => props.navigation.navigate('Chat', { group: group.name })} color="white"></IconButton>
                                <IconButton icon="close" style={{ backgroundColor: '#003152' }} onPress={() => leaveGroup(group)} color="white"></IconButton>

                            </View>
                        </View></View>





                ))}
                {user&&user.verified&&user.verified.map((c,index)=>(
                    <View key={index}>
                    <Title>Because you like {c}</Title>
                    <Courses course={c}/>
                    
                    </View>
                ))}
                
            </ScrollView>
            <Provider>
                <Portal>
                    <Modal visible={members.length > 0} onDismiss={() => {setMembers([]),setDescription("")}} contentContainerStyle={{ backgroundColor: 'white', padding: 20, marginHorizontal:30, marginBottom:'auto' }}>
                        <Title>Group Members</Title>
                        {members.map(c=>(
                            <User key={c} type="both" user={c}/>
                        ))}
                        <Subheading>Group Description: {description}</Subheading>
                    </Modal>
                    <Modal visible={group} onDismiss={() => setGroup(null)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, marginHorizontal: 30,marginBottom:'auto'  }}>
                        
                        {group && group.pending && <View>
                            <Title style={{ marginTop: 10 }}>Pending</Title>
                            {group.pending.map(c => (
                                <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={c}>
                                    <User user={c} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <IconButton icon="check" color="green" onPress={() => { removePending(c); joinGroup(c) }}></IconButton>
                                        <IconButton onPress={() => { removePending(c) }} icon="close" color="red"></IconButton>
                                    </View>
                                </View>
                        ))}</View>}

                            <Title>Invite Member</Title>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                            {!selectedUser?<TextInput style={{flex:1, }} onChangeText={text=>setUserQuery(text)} value={userQuery} placeholder="Invite member..."/>:
                            <View style={{flex:1}}><TouchableOpacity style={{padding:10,backgroundColor:'#eee'}} onPress={()=>setSelectedUser(null)}><Text>{selectedUser.username}</Text></TouchableOpacity></View>}
                            

                            {selectedUser&&<IconButton onPress={sendInvite} style={{backgroundColor:'#003152'}} color="white" icon="send"/>}
                            </View>
                            {!selectedUser&&filteredUsers.map(e=>(
                                <TouchableOpacity key={e.id} onPress={()=>setSelectedUser(e)} style={{flexDirection:'row', alignItems:'center'}}><Image source={{ uri: e.profile_picture }} style={{ borderRadius: 50, height: 50, width: 50, borderColor: 'white', borderWidth: 1,marginRight:10 }} /><View style={{flexDirection:'column'}}><Title>{e.username}</Title><Caption>{e.school.item} {e.grade}</Caption></View></TouchableOpacity>
                            ))}
                            
                    </Modal>
                    <Modal visible={viewInvites} onDismiss={() => setViewInvites(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, marginHorizontal:30, marginBottom:'auto' }}>
                                {invites.map(c=>(
                                    <Invite reload={getInvites} key={c} id={c}/>
                                ))}
                    </Modal>
                </Portal></Provider></View>

    );


}
function Courses({course}){
    const [courses, setCourses]=useState([])
    useEffect(()=>{
        getRecommendedCourses(course)
    },[])
    async function getRecommendedCourses(name){
        const response = await fetch('https://us-central1-coursehelp-8d1c8.cloudfunctions.net/courseFinder',{
            subject:name,
            method:'POST'
        })
        let res = await response.json()
        setCourses(res)
    }
    return courses.map((course,index)=>(
        <TouchableOpacity containerStyle={{backgroundColor:'white', padding:10, marginBottom:5}} key={index}  onPress={()=>Linking.openURL(course.link)}>
        <Subheading style={{textDecorationLine:'underline'}}>{course.name}</Subheading>
        <Caption>Course Difficulty: {course.difficulty} </Caption>
        <Text>{course.rating}/5 by {course.teacher}</Text>
        <View style={{alignSelf:'flex-end',  backgroundColor:'#300052', borderRadius:10, padding:2}}><Text style={{color:'white'}}>CourseEra</Text></View>
        </TouchableOpacity>
    ))
}
function User({ user, type }) {
    const [cur, setCur] = useState(null)
    useEffect(() => {
        firebase.database().ref('users/' + user).once('value', snap => [
            setCur(snap.val())
        ])
    }, [])
    if (!cur) {
        return null
    }
    if(type==="both"){
        return <View style={{flexDirection:'row', alignItems:'center'}}><Image source={{ uri: cur.profile_picture }} style={{ borderRadius: 50, height: 50, width: 50, borderColor: 'white', borderWidth: 1,marginRight:10 }} /><View style={{flexDirection:'column'}}><Title>{cur.username}</Title><Caption>{cur.school.item} {cur.grade}</Caption></View></View>
    }
    if (type === "profile") {
        return <Image source={{ uri: cur.profile_picture }} style={{ borderRadius: 50, height: 30, width: 30, borderColor: 'white', borderWidth: 1 }} />
    }
    /*   if(type==="username"){ */
    return <Text>{cur.username}</Text>
    /*  }
     else{
         return <Image src={}
     } */

}
function Invite({id,reload}){
    const [group, setGroup] = useState(null)
    useEffect(()=>{
        firebase.database().ref('groups/'+id).once('value',s=>{
            setGroup(s.val())
        })
    },[])
    function joinGroup(){
        firebase.database().ref('groups/'+id).once('value',s=>{
            var members = s.val().members||[]
            members.push(firebase.auth().currentUser.uid)
            firebase.database().ref('groups/' + id).update({
                members
            }).then(() => {
            })
        })
        dismiss()
    }
    function dismiss(){
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snap => {
            var invites=snap.val().invites
            invites=invites.filter(e=>e!=id)
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
                invites
            }).then(()=>{
                reload()
            })

            
    })
    }
    if(!group){
        return null
    }

    return <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1}}><Subheading>{group.name.substr(0,3)}</Subheading><Chip icon="information">{group.subject}</Chip><View style={{flexDirection:'row'}}><IconButton icon="check" color="green" onPress={joinGroup}/><IconButton color="red" icon="close" onPress={dismiss}/></View></View>

}