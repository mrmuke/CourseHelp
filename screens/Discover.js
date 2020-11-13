import React, { useState } from 'react';
//import { render } from 'react-dom';
import { View,StyleSheet, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Searchbar, Button, Caption, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'


export default function Discover(){
    const [anyone, setAnyone] = useState(true);
    const [invite, setInvite] = useState(true);
    const [subject, setSubject] = useState("All")
    const [keyword, setKeyword] = useState("")
    const [showSubjects, setShowSubjects] = useState(false)
    const subjects = ["Science", "Economics", "Math", "History", "Physics", "All"]
    const [subjectFilter, setSubjectFilter] =useState("")
    const [showOptions, setShowOptions]=useState(false)
        return (
            <View style={styles.container}>
                <View style={{backgroundColor:'#59A8FB', padding:10, borderRadius:10,diplsya:'flex',flexDirection:'row', alignItems:'center'}}>
                <Searchbar style={{flex:1}} placeholder="Discover..." onChangeText={text=>setKeyword(text)}/>
                <View style={{backgroundColor:'white', borderRadius:50, marginLeft:5}}><Icon onPress={()=>setShowOptions(!showOptions)} name="expand-more" size={30} /></View></View>
            {showOptions&&
            <>
                <View style={{display:'flex', flexDirection:'row', marginTop:10}}>
                <Button color="black" icon={anyone&&"check"} mode={anyone?"contained":"outlined"} onPress={()=>setAnyone(!anyone)}>public group </Button>
                <Button color="black" icon={invite&&"check"} mode={invite?"contained":"outlined"} onPress={()=>setInvite(!invite)}>invite only</Button>
            </View>
            
            <Button onPress={()=>setShowSubjects(!showSubjects)} style={{margin:5}} contentStyle={{ padding:10, borderRadius:10}} color="#e6e6e3" mode="contained" ><Caption style={{fontSize:15}}>Selected Subject: {subject}</Caption></Button>
                {showSubjects&&<><Searchbar onChangeText={text=>setSubjectFilter(text)}/>{subjects.filter(subject=>subject.toLowerCase().includes(subjectFilter.toLowerCase())).map(subject=>
                    <Button key={subject} style={{display:'flex'}} mode="contained" color="white" onPress={()=>{setSubject(subject);setShowSubjects(false)}}>{subject}</Button>
                )}</>}</>}
                <ScrollView>
                <Card style={{margin:5}}>
                    <Card.Title title="AP Physics C" subtitle="Physics Conquerers" left={props=><Icon name="group" {...props}/>} />
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
                </Card></ScrollView>
                
            </View>

       
        );
    

}


const styles = StyleSheet.create({
    container:{
        padding:20
    }
})