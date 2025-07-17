import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCard from '../ImageCard';
import { LikeImagesContext } from '../context/LikeImageContext';
import { colors } from '../theme';

const LikeScreen = () => {
  const { likedImages } = useContext(LikeImagesContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Images</Text>
      <FlatList
        data={likedImages} // Fixed the array issue
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ImageCard item={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          likedImages.length === 0 && styles.emptyListContainer, // Fixed the condition
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyStateContainer}>
            <AntDesign name="hearto" size={80} color="#D3D3D3" />
            <Text style={styles.emptyStateText}>You haven't liked any images</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LikeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
});
