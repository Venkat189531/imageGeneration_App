import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fontFamily } from '../theme'
import ImageCard from '../ImageCard'
import api from '../../utils/api'

const DiscoverScreen = () => {
  const [refreshing,setRefreshing]=useState(false);
  const [images,setImages]=useState([]);
  const [isLoading,setsLoading]=useState(false);
  const [hasNextPage,setHasNextPage]=useState(true);
  const [page,setPage]=useState<number>(1);
  useEffect(()=>{
    handleFetchImage()
  },[page])
  const handleFetchImage=async()=>{
    try{
      setsLoading(true)
      const response=await api.get("/discover-image",{params:{
        page
      }});
      if(page==1){
        setImages(response.data.images);
      }
      else{
        setImages((prevImages)=>[...prevImages,...response.data.images]);
      }
      setHasNextPage(response.data.totalPages>response.data.currentPage?true:false)
      setsLoading(false)

    }catch(error){
      setsLoading(false)
      ToastAndroid.show("something went wrong",ToastAndroid.SHORT)
    }
  }
  const handleLoadMoreImages=()=>{
    if(hasNextPage){
      setPage(page+1);
    }
  }

  const onRefresh=()=>{
    setRefreshing(true);
    setPage(1);
    // i will make api
    setRefreshing(false);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      
      <FlatList data={images} renderItem={({item,index})=>{
        return(
          <ImageCard item={item}></ImageCard>
        )
      }}
      keyExtractor={(item)=>item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
        tintColor={"#3B82F6"}
        ></RefreshControl>
      }
      ListFooterComponent={
        isLoading?<ActivityIndicator size={"large"} color={"#3BB2F6"}></ActivityIndicator>:null
      }
      onEndReached={handleLoadMoreImages}
      ></FlatList>
    </View>
  )
}

export default DiscoverScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#1E1E1E",
    paddingHorizontal:20,
  },
  title:{
    color:"#fff",
    fontFamily:fontFamily.bold,
    textAlign:"center",
    fontSize:28,
    marginVertical:20,
  },
  listContainer:{
    paddingBottom:50,
  }
})