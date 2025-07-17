import { Alert, Image, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { cache, useContext, useState } from 'react'
import { fontFamily } from './theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from "react-native-vector-icons/Feather";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { requestWriteStoragePermission } from '../utils';


import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import { LikeImagesContext } from './context/LikeImageContext';

const ImageCard = ({item}) => {
  const context = useContext(LikeImagesContext);
  const [isDownloading,setIsDownloading]=useState(false)
  const [downloadProgress,setDownloadProgress]=useState(0);
  const [isProcessing,setIsProcessing]=useState(false);
  const handleDownload= async()=>{
    const isGrant=requestWriteStoragePermission();
    if(!isGrant){
      return;
    }
    const imageUrl=item.imageUrl;
    let PictureDir=ReactNativeBlobUtil.fs.dirs.PictureDir;
    console.log(PictureDir);
    const filePath=`${PictureDir}/download_image_${Date.now()}.png`;
    setIsDownloading(true);
    ReactNativeBlobUtil.config({
      path:filePath,
      appendExt:"png",
      fileCache:true,
      addAndroidDownloads:{
        useDownloadManager:true,
        notification:true,
        path:filePath,
        description:"Downloading image",
        mime:"image/png",
        mediaScannable:true,
      }
    }).fetch("GET",imageUrl).progress({interval:100},(received,total)=>{
      let precentage=Math.floor((received/total)*100);
      setDownloadProgress(precentage)
      //add the state
    }).then((res)=>{
      copyMediaToStorage(filePath,filePath);
      setIsDownloading(false);
      setDownloadProgress(0);
      ToastAndroid.show("Image Downloaded Successsfully",ToastAndroid.SHORT)
    }).catch((error)=>{
      console.log("error",error);
      setIsDownloading(false);
    })
  }
  //copy internal storage into media storage
  const copyMediaToStorage= async(filePath:string,fileName:string)=>{
    try{
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
        name:fileName,
        parentFolder:"vAI",
        mimeType:"image/png",
      },
      "Download",
      filePath
    )
    }catch(error){
      console.log("Failed to copy Media Storage");
    }
  }

  const processImageToShare= async()=>{
    const isGrant=requestWriteStoragePermission();
    if(!isGrant){
      return;
    }
    const imageUrl=item.imageUrl;
    let PictureDir=ReactNativeBlobUtil.fs.dirs.PictureDir;
    console.log(PictureDir);
    const filePath=`${PictureDir}/download_image_${Date.now()}.png`;
    setIsProcessing(true);
    ReactNativeBlobUtil.config({
      path:filePath,
      appendExt:"png",
      fileCache:true,
    }).fetch("GET",imageUrl).progress({interval:100},(received,total)=>{
      let precentage=Math.floor((received/total)*100);
      setDownloadProgress(precentage)
      //add the state
    }).then((res)=>{
      setIsProcessing(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      const base64Data = res.data;
      if(!base64Data){
        ToastAndroid.show("No Image to share",ToastAndroid.SHORT)
        return;
      }
      const options={
        title:"Share Image",
        url:`file://${base64Data}`,
        massage:"Chechout this image",
      }
      Share.open(options)
        .then((res) => {
           console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
      });
    }).catch((error)=>{
      console.log("error",error);
      setIsDownloading(false);
      setIsProcessing(false);
    })
  }

  const handleShare=async ()=>{
    //you have to download the file
    const base64Data=await processImageToShare();
    // then get base64 data format
    //share the file
  }

  const handleCopy=()=>{
    const imageUrl=item.imageUrl;
    //here you have to write the logic 
    Clipboard.setString(imageUrl);
    ToastAndroid.show("Image coped successfully",ToastAndroid.SHORT)


  }
  const { likedImages, toggleLikeImage } = context;
    const handleLikeImage = () => toggleLikeImage(item);

      const isLiked = likedImages?.some((likeImage) => likeImage._id === item._id);
    
  // const isLiked=likedImages.some((likeImage)=>{likeImage._id==item._id})
  return (
    <View style={styles.imageCard}>
      <Image source={{uri:item.imageUrl}} style={styles.image}
      resizeMode='cover'></Image>
      <Text style={styles.promptText}>{item?.prompt||"No Prompt"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Ionicons name="download-outline" color="#fff" size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-social" color="#fff" size={25} />

        </TouchableOpacity><TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Feather name="copy" color="#fff" size={25} />
        </TouchableOpacity><TouchableOpacity style={styles.actionButton} onPress={handleLikeImage}>
            <AntDesign name={isLiked?"heart":"hearto"} color={isLiked?"#ec0808":"#fff"} size={25} />
        </TouchableOpacity>
      </View>
      <Modal transparent={true} animationType='fade' visible={isDownloading||isProcessing}>
        <View style={styles.overlay}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>
              {isProcessing?"Processing ":"Downloading"} Image
            </Text>
            <Text style={styles.progressText}>{downloadProgress}%</Text>
            <Text style={styles.progressDescription}>
              Please wait while we {isProcessing?"Processing ":"Downloading"} your image.
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[
                styles.progressBar,
                {width:`${downloadProgress}%`}
              ]}></View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ImageCard

const styles = StyleSheet.create({
    imageCard:{
        width:"100%",
        padding:15,
        backgroundColor:"#333",
        marginBottom:20,
        borderRadius:8,
    },
    image:{
        width:"100%",
        height:300,
        borderRadius:8,
    },
    promptText:{
        marginTop:10,
        color:"#fff",
        fontSize:16,
        fontFamily:fontFamily.regular,
        textAlign:"center",
    },
    buttonContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:10,

    },
    actionButton:{
        padding:10,
        backgroundColor:"#444",
        borderRadius:50,
        alignItems:"center",
    },
    overlay:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.7)",
    },
    progressContainer:{
      width:"80%",
      backgroundColor:"#222",
      padding:20,
      borderRadius:10,
      alignItems:"center",
    },
    progressBar:{
      height:10,
      backgroundColor:"#76c7c0",
      borderRadius:5,
    },
    progressTitle:{
      fontSize:18,
      color:"#fff",
      fontFamily:fontFamily.bold,
      marginBottom:10,
    },
    progressText:{
      fontSize:24,
      color:"#fff",
      fontFamily:fontFamily.bold,
      marginBottom:10,
    },
    progressDescription:{
      fontSize:14,
      color:"#fff",
      fontFamily:fontFamily.regular,
      textAlign:"center",
      marginTop:10,
    },
    progressBarContainer:{
      width:"100%",
      height:10,
      backgroundColor:"#444",
      borderRadius:5,
      marginTop:10
    }
})