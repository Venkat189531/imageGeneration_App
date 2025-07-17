import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

export const LikeImagesContext = createContext(null);

export const LikeImagesProvider = ({ children }) => {
    const [likedImages, setLikedImages] = useState([]);

    useEffect(() => {
        loadLikedImages();
    }, []);

    const loadLikedImages = async () => {
        try {
            let images = await AsyncStorage.getItem("likedImages");
            setLikedImages(images ? JSON.parse(images) : []);
        } catch (error) {
            console.error("Error loading liked images:", error);
        }
    };

    const toggleLikeImage = async (image) => {
        try {
            let storedImages = await AsyncStorage.getItem("likedImages");
            let likedImages = storedImages ? JSON.parse(storedImages) : [];

            const imageExist = likedImages.some((item) => item._id === image._id);

            if (imageExist) {
                likedImages = likedImages.filter((item) => item._id !== image._id);
                ToastAndroid.show("Image removed successfully", ToastAndroid.SHORT);
            } else {
                likedImages.push(image);
                ToastAndroid.show("Image liked successfully", ToastAndroid.SHORT);
            }

            setLikedImages(likedImages);
            await AsyncStorage.setItem("likedImages", JSON.stringify(likedImages));
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <LikeImagesContext.Provider value={{ likedImages, toggleLikeImage }}>
            {children}
        </LikeImagesContext.Provider>
    );
};
