import React, { useState } from 'react';
import { View, StyleSheet, Platform, Dimensions, Clipboard, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Permissions from 'expo-permissions'
import { Audio } from 'expo-av';
import { ActivityIndicator, Button, TextInput, Title } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import ImageToText from './../components/ImageToText';

export default function Tools() {
  const [visibleRecording, setVisibleRecording] = useState(false);
  const [visiblePhoto, setVisiblePhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState(null)
  const [loading, setLoading] = useState(false)
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
      console.log(uri)
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
        // could be anything 
        name: Platform.OS === 'ios' ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
      });
      const response = await fetch("https://us-central1-coursehelp-8d1c8.cloudfunctions.net/audioToText", {
        method: 'POST',
        body/* body */: formData,
        /* headers: {ss
          'Content-Type': 'multipart/form-data',
        }, */
      });

      const data = await response.json();
      setNotes("-"+data.transcript.substr(0,data.transcript.length-1).replaceAll(". ","\n-").replaceAll("? ", "?\n-"))
    } catch (error) {
      console.log('There was an error', error);
      resetRecording()
    }
    setLoading(false)
  }
  async function startRecording() {
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
    const reco = new Audio.Recording()
    try {
      // here we pass our recording options
      await reco.prepareToRecordAsync(recordingOptions)
      // and finally start the record
      await reco.startAsync()
    } catch (error) {
      // we will take a closer look at stopRecording function further in this article
      stopRecording()
    }

    // if recording was successful we store the result in variable, 
    // so we can refer to it from other functions of our component
    setRecording(reco)

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
  function resetRecording() {
    deleteRecordingFile()
    setRecording(null)
  }
  const copyToClipboard = () => {
    Clipboard.setString(notes)
  }
  return (
    <ScrollView>
            <View style={{backgroundColor:'#003152', height:75, justifyContent:'flex-end'}}><Title style={{textAlign:'center', color:'white',}}>Study Tools</Title></View>

      <View style={styles.container}>
      {(() => {
        if (visibleRecording) {
          if (notes.length > 0) {
            return (
              <View style={{ alignItems: 'center', flexDirection: "column", justifyContent: "center", height: Dimensions.get('screen').height - 142 }}>
                <Title style={{ marginBottom: 20 }}>Notes:</Title>
                <TextInput multiline={true} style={{ width: Dimensions.get('screen').width - 50, height: Dimensions.get('screen').height * 0.35 }} value={notes} onChangeText={text => setNotes(text)} />
                <Button color="black" icon="pencil" onPress={() => copyToClipboard()}>Copy</Button>
                <Button mode="outlined" style={{ marginTop: 30, width: Dimensions.get("screen").width - 200 }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} color="#59a8fb" onPress={() => {
                  setNotes("");
                }}><Text>New Recording</Text></Button>
                <Button mode="contained" style={{ marginTop: 20, width: Dimensions.get("screen").width - 200 }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} color="#59a8fb" onPress={() => {
                  setVisibleRecording(false);
                  setNotes("");
                }}><Text style={{ color: "#fff" }}>Back</Text></Button>
              </View>
            )
          } else {
            return (
              <View style={{ alignItems: 'center', flexDirection: "column", justifyContent: "center", height: Dimensions.get('screen').height - 142 }}>
                {loading ? <><ActivityIndicator /></> :
                  !isRecording ? <TouchableOpacity onPress={startRecording}><Icon size={100} name="microphone" /></TouchableOpacity> : <TouchableOpacity onPress={() => { stopRecording(); getTranscription() }} style={{ backgroundColor: 'red', borderRadius: 50, padding: 20 }}><Icon size={100} color="white" name="microphone-slash" /></TouchableOpacity>}
                {(() => {
                  if (isRecording) {
                    return (
                      <Button disabled={true} mode="contained" style={{ marginTop: 20, width: Dimensions.get("screen").width - 200 }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} color="#59a8fb" onPress={() => {
                        setVisibleRecording(false);
                        setNotes("");
                      }}><Text>Back</Text></Button>
                    )
                  } else {
                    return (
                      <Button mode="contained" style={{ marginTop: 20, width: Dimensions.get("screen").width - 200 }} contentStyle={{ paddingTop: 10, paddingBottom: 10 }} color="#59a8fb" onPress={() => {
                        setVisibleRecording(false);
                        setNotes("");
                      }}><Text>Back</Text></Button>
                    )
                  }
                })()}
              </View>)
          }
        }else if(visiblePhoto){
          return <ImageToText exit={()=>{ setVisiblePhoto(false) }}/>
        } else {
          return (
            <View style={{ alignItems: 'center', flexDirection: "column", justifyContent: "center", height: Dimensions.get('screen').height - 142 }}>
              <Button style={styles.microphoneButton} color="#59a8fb" mode="contained" contentStyle={{ padding: 40 }} onPress={() => {
                setVisibleRecording(true);
              }}>
                  <Icon color="#fff" size={50} name="microphone" />
              </Button>
              <Title style={{fontSize:15, marginTop: 3, color: "black"}}>Lecture to Notes</Title>
              <Button style={styles.imageButton} color="#59a8fb" mode="contained" contentStyle={{ paddingLeft: 30, paddingRight: 30, paddingTop: 40, paddingBottom:40 }} onPress={() => {
                setVisiblePhoto(true);
              }}><Icon color="#fff" size={50} name="camera" /></Button>
              <Title style={{fontSize:15, marginTop: 3, color: "black"}}>Image to Notes</Title>
            </View>
          )
        }
      })()}
    </View></ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20

  },
  microphoneButton: {
    borderRadius: 30,
  },
  imageButton: {
    borderRadius: 30,
    marginTop: 50,
  }
})