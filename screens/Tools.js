import React, { useState } from 'react';
//import { render } from 'react-dom';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Permissions from 'expo-permissions'
import { Audio } from 'expo-av';
import { ActivityIndicator } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';

export default function Tools() {
    const [isRecording, setIsRecording] = useState(false)
    const [recording, setRecording] = useState(null)
    const [loading,setLoading]=useState(false)
    const [notes, setNotes] = useState("")
const recordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  }
  async function deleteRecordingFile() {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI())
      await FileSystem.deleteAsync(info.uri)
    } catch (error) {
      console.log('There was an error deleting recorded file', error)
    }
  }

  
  
  async function getTranscription() {
    setLoading(true)
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
        // could be anything 
        name: Platform.OS === 'ios' ? `${Date.now()}.wav` :`${Date.now()}.m4a`,
      });
      const response = await fetch("http://localhost:3005/speech", {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setNotes(data.transcript)
    } catch(error) {
      console.log('There was an error', error);
      stopRecording()
      resetRecording()
    }
    setLoading(false)
  }
  async function startRecording(){
    // request permissions to record audio
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    // if the user doesn't allow us to do so - return as we can't do anything further :(
    if (status !== 'granted') return
    // when status is granted - setting up our state
    setIsRecording(true)
  
    // basic settings before we start recording,
    // you can read more about each of them in expo documentation on Audio
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })
    const recording = new Audio.Recording()
    try {
      // here we pass our recording options
      await recording.prepareToRecordAsync(recordingOptions)
      // and finally start the record
      await recording.startAsync()
    } catch (error) {
      console.log(error)
      // we will take a closer look at stopRecording function further in this article
     stopRecording()
    }
  
    // if recording was successful we store the result in variable, 
    // so we can refer to it from other functions of our component
    setRecording(recording)
  }
  async function stopRecording() {
    // set our state to false, so the UI knows that we've stopped the recording
    setIsRecording(false)
    try {
      // stop the recording
      await recording.stopAndUnloadAsync()
    } catch (error) {
      console.log(error)
    }
  }
  function resetRecording(){
    deleteRecordingFile()
    setRecording(null)
  }
  console.log(notes)
        return (
            <View style={styles.container}>
                {loading?<ActivityIndicator/>:
                !isRecording?<TouchableOpacity onPress={startRecording}><Icon size={100} name="microphone"/></TouchableOpacity>:<TouchableOpacity onPress={()=>{stopRecording();getTranscription()}} style={{backgroundColor:'red', borderRadius:50, padding:20}}><Icon size={100} color="white" name="microphone-slash"/></TouchableOpacity>}
            </View>
        );
    

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})