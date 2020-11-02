import React, { useState } from 'react';
//import { render } from 'react-dom';
import { View,StyleSheet, Text, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Searchbar, Button, Caption, TextInput } from 'react-native-paper';
import { sub } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

export default function Discover(){
    const [anyone, setAnyone] = useState(true);
    const [invite, setInvite] = useState(true);
    const [subject, setSubject] = useState("All")
    const [keyword, setKeyword] = useState("")
    const [showSubjects, setShowSubjects] = useState(false)
    const subjects = ["Science", "Economics", "Math", "History", "Physics"]
    const [subjectFilter, setSubjectFilter] =useState("")
        return (
            <View style={styles.container}>
                <View style={{backgroundColor:'#59A8FB', padding:10, borderRadius:10}}>
                <Searchbar placeholder="Discover..." onChangeText={text=>setKeyword(text)}/></View>
                <View style={{display:'flex', flexDirection:'row', marginTop:10}}>
                <Button color="black" icon={anyone&&"check"} mode={anyone?"contained":"outlined"} onPress={()=>setAnyone(!anyone)}>public group </Button>
                <Button color="black" icon={invite&&"check"} mode={invite?"contained":"outlined"} onPress={()=>setInvite(!invite)}>invite only</Button>
            </View>
                <TouchableOpacity onPress={()=>setShowSubjects(!showSubjects)} style={{alignSelf:'center', padding:5, margin:5,borderWidth:1}} ><Caption style={{fontSize:15}}>Selected Subject: {subject}</Caption></TouchableOpacity>
                {showSubjects&&<><Searchbar onChangeText={text=>setSubjectFilter(text)}/>{subjects.filter(subject=>subject.toLowerCase().includes(subjectFilter.toLowerCase())).map(subject=>
                    <Button key={subject} style={{display:'flex'}} mode="contained" color="white" onPress={()=>{setSubject(subject);setShowSubjects(false)}}>{subject}</Button>
                )}</>}
                
            </View>

       
        );
    

}


const styles = StyleSheet.create({
    container:{
        padding:20
    }
})