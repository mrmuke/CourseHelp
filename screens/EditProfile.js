import React, { useState, useEffect, Component } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import * as firebase from 'firebase'
import { Button, IconButton, Searchbar, Dialog, Provider, Portal } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import schoolNames from '../assets/schools.json'

export default function EditProfile({ user, exit }) {
    const [grade, setGrade] = useState(user.grade)
    const [showGrade, setShowGrade] = useState(false)
    const grades = ["Freshman", "Sophomore", "Junior", "Senior"]
    const [url, setUrl] = useState(user.profile_picture)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(user.username);
    const [school, setSchool] = useState(user.school);
    const [bio, setBio] = useState(user.bio);
    const [query, setQuery] = useState('')
    const [data, setData] = useState(schoolNames)
    const [filteredData, setFilteredData] = useState([])
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    const userID = firebase.auth().currentUser.uid
    const searchData = async (text) => {
        let textUpper = text.toUpperCase()
        setFilteredData(data);
        let array = [];
        for (let names of data) {
            let j = 0
            for (let i = 0; i < textUpper.length; i++) {
                if (textUpper[i] == names["A"][i]) {
                    j++
                }
            }
            if (j == textUpper.length) {
                array.push(names["A"])
            }
        }
        setFilteredData(array.slice(0, 10));
    }
    const ItemSeparator = () => <View style={{
        height: 2,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
    }} />
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            uploadImage(result.uri)
        }
    }
    const uploadImage = async (uri) => {
        setLoading(true)
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref("profileimages/" + userID);
        const downloadURL = await (await ref.put(blob)).ref.getDownloadURL()
        setUrl(downloadURL)
        firebase.database().ref("users/" + userID).update({
            profile_picture: downloadURL
        }).then(() => {
            setLoading(false)
        })
        console.log(userID)

    }
    function uploadUsername() {
        firebase.database().ref("users/" + userID).update({
            username: username
        })
    }
    function uploadSchool() {
        firebase.database().ref("users/" + userID).update({
            school: school
        })
    }
    function uploadGrade() {
        firebase.database().ref("users/" + userID).update({
            grade: grade
        })
    }
    function uploadBio() {
        firebase.database().ref("users/" + userID).update({
            bio: bio
        })
    }
    function uploadData() {
        uploadSchool()
        uploadUsername()
        uploadGrade()
        uploadBio()
    }
    if (!user) {
        return null
    }
    return (

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Text style={styles.title} color='black'>
                    Edit Profile
                </Text>
            </View>
            <Image
                style={styles.profileImage}
                source={{ uri: url }}
            />
            <View>
                {loading ?
                    <ActivityIndicator size='large' marginLeft='auto' marginRight={15} marginVertical={18} /> :
                    <IconButton icon='camera' size={40} style={styles.edit} onPress={pickImage} />}
            </View>
            <View style={{ width: '100%', padding: 15, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 10, marginRight: 5, width: 80, height: 40, fontSize: 15 }}> Username </Text>
                    <TextInput
                        style={{ width: 250, height: 40, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}
                        label="Username"
                        value={username}
                        maxLength={18}
                        onChangeText={username => setUsername(username)}
                        underlineColor="#36485f"
                        autoCorrect={false}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, marginRight: 5, width: 80, height: 80, fontSize: 15 }}> Bio </Text>
                    <TextInput
                        style={{ margin: 5, width: 250, height: 80, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}
                        mode='flat'
                        label="Bio (Max 150 Char.)"
                        value={bio}
                        maxLength={150}
                        multiline={true}
                        onChangeText={bio => setBio(bio)}
                        underlineColor="#36485f"
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, marginRight: 5, width: 80, height: 40, fontSize: 15 }}> School </Text>
                    <Button mode="text" color='#36485f' onPress={showDialog} labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={{ marginRight: 5, width: 250, height: 40, fontSize: 15, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}>{school["item"]}</Button>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, marginRight: 5, width: 80, height: 40, fontSize: 15 }}> Grade </Text>
                    <View>
                        <TouchableOpacity onPress={() => setShowGrade(!showGrade)} >
                            <Button mode="text" color='#36485f' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={{ width: 250, height: 40, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}>{grade}</Button>
                        </TouchableOpacity>
                        {showGrade && <>{grades.map(grade =>
                            <Button key={grade} color='#36485f' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={styles.selector} mode="text" color="black" onPress={() => { setGrade(grade); setShowGrade(false) }}>{grade}</Button>
                        )}</>}
                    </View >
                </View>
            </View>
            <View>
                <Provider>
                    <Portal>
                        <Dialog style={{ marginTop: -500, width: 350, height: 400, alignSelf: "center", backgroundColor: "white" }} visible={visible} onDismiss={hideDialog}>
                            <Dialog.ScrollArea  >
                                <ScrollView>
                                    <Dialog.Title style={{ color: 'black' }}>School</Dialog.Title>
                                    <Dialog.Content>
                                        <TextInput
                                            inputStyle={{ color: 'black', fontSize: 13 }}
                                            style={{ margin: 5, width: 250, height: 40, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}
                                            iconColor='black'
                                            onChangeText={(query) => { setQuery(query), searchData(query); }}
                                            value={query}
                                            placeholder="Search for your School" />

                                        <FlatList
                                            data={filteredData}
                                            renderItem={({ item }) => {
                                                return <Button color='#36485f' mode='outlined' labelStyle={{ fontSize: 10, color: 'black' }} contentStyle={{ height: 30 }} onPress={() => { setSchool({ item }), setQuery({ item }["item"]) }}>{item}</Button>;
                                            }}
                                            keyExtractor={(item, index) => item.index}
                                        />
                                        <Dialog.Actions>
                                            <Button color='#36485f' labelStyle={{ fontWeight: 'bold', fontSize: 15, color: 'black' }} onPress={() => { setQuery('') }, hideDialog}>Done</Button>
                                        </Dialog.Actions>
                                    </Dialog.Content>
                                </ScrollView>
                            </Dialog.ScrollArea>
                        </Dialog>
                    </Portal>
                </Provider>
            </View>
            <Button onPress={() => { exit(); uploadData() }} mode="text" color='#36485f' labelStyle={{ fontWeight: 'normal', fontSize: 15, color: 'black' }} >Save</Button>

        </ScrollView >
    );

}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#5b59fb",
        height: 150,
    },
    title: {
        textAlign: 'center',
        marginTop: 25,
        fontSize: 28,
        color: "white",
        fontWeight: "600"
    },
    selector: {
        fontSize: 15,
        padding: 5,
        marginVertical: 2,
        width: 250,
        textAlign: 'center'
    },
    edit: {
        marginLeft: 'auto',
    },
    button: {
        margin: 5,
        marginTop: 200,
        height: 35,
        justifyContent: 'center',
        alignSelf: 'center',
        width: 150,
        borderRadius: 7,
        backgroundColor: "#5b59fb",
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 80
    },
    container: {
        flex: 1
    },
    text: {
        color: '#36485f',
        fontSize: 30,
        padding: 20
    },
    inputbox: {
        fontSize: 12,
        width: 160,
        marginVertical: 16,
        marginHorizontal: 10,
        height: 50,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36,
    },
})


