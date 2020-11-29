import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper'
import * as firebase from 'firebase'
import { Button, IconButton, Dialog, Provider, Portal } from 'react-native-paper'
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
    const data = schoolNames
    const [filteredData, setFilteredData] = useState([])
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    const userID = firebase.auth().currentUser.uid
    const [selectGrade, setSelectGrade] = useState(false)

    const searchData = async (text) => {
        let textUpper = text.toUpperCase()
        let array = data.filter(name => name["A"].startsWith(textUpper)).map(item => item["A"])

        setFilteredData(array.slice(0, 10));
    }
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

    }
    async function uploadUsername() {
        await firebase.database().ref("users/" + userID).update({
            username: username
        })
    }
    async function uploadSchool() {
        await firebase.database().ref("users/" + userID).update({
            school: school
        })
    }
    async function uploadGrade() {
        await firebase.database().ref("users/" + userID).update({
            grade: grade
        })
    }
    async function uploadBio() {
        await firebase.database().ref("users/" + userID).update({
            bio: bio
        })
    }
    async function uploadData() {
        await uploadSchool()
        await uploadUsername()
        await uploadGrade()
        await uploadBio()
    }
    if (!user) {
        return null
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
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
                <View style={{ padding: 15, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 15, width: 80 }}> Username </Text>
                        <TextInput
                            style={{ flex: 1, height: 40 }}
                            placeholder="Username"
                            value={username}
                            maxLength={18}
                            onChangeText={username => setUsername(username)}
                            underlineColor="#003152"
                            autoCorrect={false}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, width: 80, fontSize: 15 }}> Bio </Text>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Bio (Max 150 Char.)"
                            value={bio}
                            maxLength={150}
                            multiline={true}
                            onChangeText={bio => setBio(bio)}
                            underlineColor="#36485f"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, width: 80, fontSize: 15 }}> School </Text>
                        <TouchableOpacity onPress={showDialog} containerStyle={{ flex: 1 }}>
                            <Button mode="text" color='#003152' contentStyle={{ padding: 10 }} labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={{ borderColor: '#dcdde1', borderWidth: 1 }}>{school["item"]}</Button>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, width: 80, fontSize: 15 }}> Grade </Text>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => setSelectGrade(true)}>
                                <Button mode="text" contentStyle={{ padding: 10 }} color='#003152' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={{ borderColor: '#dcdde1', borderWidth: 1 }}>{grade}</Button>
                            </TouchableOpacity>

                        </View >
                    </View>
                </View>
                <Button onPress={async() => { await uploadData(); exit(); }} mode="text" color='#003152' labelStyle={{ fontWeight: 'normal', fontSize: 15, color: 'black' }} >Save</Button>

            </ScrollView>
            <Provider>
                <Portal>
                    <Dialog style={{ backgroundColor: "white" }} visible={visible}>
                        <Dialog.Title style={{ color: 'black' }}>School</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                inputStyle={{ color: 'black', fontSize: 13 }}
                                style={{ margin: 5, height: 40, borderBottomColor: '#dcdde1', borderBottomWidth: 1 }}
                                iconColor='black'
                                onChangeText={(query) => { setQuery(query); searchData(query); }}
                                value={query}
                                placeholder="Search for your School" />
                            {filteredData.map(item => (
                                <Button key={item} color='#003152' mode='outlined' labelStyle={{ fontSize: 10, color: 'black' }} contentStyle={{ height: 30 }} onPress={() => { setSchool({ item }), setQuery({ item }["item"]), setFilteredData([]) }}>{item}</Button>
                            ))}

                            <Dialog.Actions>
                                <Button color='#003152' labelStyle={{ fontWeight: 'bold', fontSize: 15, color: 'black' }} onPress={() => { setQuery('') }, hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                    <Dialog style={{ backgroundColor: "white" }} visible={selectGrade}>
                        <Dialog.Title style={{ color: 'black' }}>Grade</Dialog.Title>
                        <Dialog.Content>

                            <TouchableOpacity style={{ margin: 5 }} onPress={() => setShowGrade(!showGrade)}>
                                <Button mode="text" contentStyle={{ padding: 10 }} color='#003152' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={{ borderColor: '#dcdde1', borderWidth: 1 }}>{grade}</Button>
                            </TouchableOpacity>
                            {showGrade && <>{grades.map(grade =>
                                <Button key={grade} color='#003152' labelStyle={{ fontWeight: 'normal', fontSize: 10, color: 'black' }} style={styles.selector} mode="text" color="black" onPress={() => { setGrade(grade); setShowGrade(false) }}>{grade}</Button>
                            )}</>}
                            <Dialog.Actions>
                                <Button color='#003152' labelStyle={{ fontWeight: 'bold', fontSize: 15, color: 'black' }} onPress={() => setSelectGrade(false)}>Done</Button>
                            </Dialog.Actions>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </Provider>
        </View >
    );

}
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#003152",
        height: 150,
    },
    title: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    },
    selector: {
        fontSize: 15,
        padding: 5,
        marginVertical: 2,
        textAlign: 'center'
    },
    edit: {
        marginLeft: 'auto',
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
    }

})


