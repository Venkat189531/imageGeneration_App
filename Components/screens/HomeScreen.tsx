import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, fontFamily } from '../theme'
import Entypo from 'react-native-vector-icons/Entypo';
import ImageCard from '../ImageCard';
import api from '../../utils/api';

const HomeScreen = () => {
    const [prompt,setPrompt]=useState("")
    const [isLoading,setsLoading]=useState(false);
    const [image,setImage]=useState("");
    const handelOpenLink=()=>{
        const url="";
        Linking.openURL(url).catch((error)=>{
            console.log(error);
        })
    }
    const handelGenerateImage = async () => {
        if (prompt.trim().length === 0) {
            ToastAndroid.show("Please enter a prompt to generate an image", ToastAndroid.SHORT);
            return;
        }
        setsLoading(true);
        try {
            const response = await api.post("/generate-image", { prompt });
            if (response.data.imageUrl) {
                setImage(response.data.imageUrl);
                ToastAndroid.show("Image generated successfully!", ToastAndroid.SHORT);
            } else {
                throw new Error("No image received");
            }
        } catch (error) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
            console.error(error);
        }
        setsLoading(false);
    };
    
  return (
   <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.appLogo}>
        <Text style={styles.appName}>vAI</Text>
        <TouchableOpacity onPress={handelOpenLink}>
            <Text style={styles.made}>Made by {" "}
                <Text style={styles.made,
                    {textDecorationLine:"underline"}
                }>Venkat</Text>
            </Text>
        </TouchableOpacity>
    </View>
    {/* input  */}
    <View style={styles.textInputWrapper}>
        <View style={styles.textInputContainer}>
            <TextInput placeholder='Enter your prompt..' placeholderTextColor={"#808080"} multiline style={styles.textInput} value={prompt}
            onChangeText={setPrompt}
            ></TextInput>
            {
                prompt?(
                    <TouchableOpacity style={styles.clear} onPress={() => setPrompt("")}>
                        <Entypo name={"cross"} size={24} color={"#fff"}></Entypo>
                       
                    </TouchableOpacity>
                ):null
            }
        </View>
    </View>
    {/* button */}
    <TouchableOpacity style={styles.generateButton} onPress={handelGenerateImage}>
        {
            isLoading?(<ActivityIndicator size={"small"} color={"#fff"}></ActivityIndicator>):
            <Text style={styles.generateText}>Generate</Text>
        }
    </TouchableOpacity>
    {
        !image&&<Text style={styles.description}>
        Generate image in real-time. Enter a prompt and generate images.Powered By vAI.
        </Text>
    }
    {
        image&&(
            <View style={styles.images}>
                <ImageCard item={{imageUrl:image, prompt:"Generate Image"}}></ImageCard>
            </View>
        )
    }
   </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        backgroundColor:"#1E1E1E",
        paddingHorizontal:20,
        justifyContent:"space-between",
        paddingBottom:30,
    },
    appLogo:{
        alignItems:"center",
        marginTop:30,
    },
    appName:{
        color:"#fff",
        fontFamily:fontFamily.bold,
        fontSize:32,
        textAlign:"center",
    },
    made:{
        color:"#808080",
        fontFamily:fontFamily.regular,
        fontSize:13,
        marginTop:5,
    },
    textInputWrapper:{
        marginTop:20,
    },
    textInputContainer:{
        position:"relative",
    },
    textInput:{
        width:"100%",
        height:120,
        borderWidth:2,
        borderColor:"#565656",
        borderRadius:10,
        backgroundColor:"#222",
        color:"#fff",
        paddingHorizontal:15,
        paddingVertical:10,
        fontFamily:fontFamily.regular,
        fontSize:15,
    },
    clear:{
        position:"absolute",
        right:10,
        top:10,
    },
    generateButton:{
        marginTop:10,
        backgroundColor:"#000",
        paddingVertical:15,
        paddingHorizontal:30,
        alignItems:"center",
        borderRadius:2,
        // borderBottomWidth:10,
        borderColor:"#f8f2f2",

    },
    generateText:{
        color:"#fff",
        fontFamily:fontFamily.semiBold,
        fontSize:20,
    },
    description:{
        color:"#808080",
        fontFamily:fontFamily.regular,
        fontSize:14,
        textAlign:"center",
        marginTop:20,
    },
    images:{
        marginTop:20,
        alignItems:"center",
    }
})