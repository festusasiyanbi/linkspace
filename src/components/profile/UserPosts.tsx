import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Post} from '../../types/Post';
import useFetchUserById from '../../hooks/useFetchUserById';

type UserPostsProps = {
  userId: string;
};
const {width} = Dimensions.get('window');

const RenderItem: React.FC<{item: Post}> = ({item}) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={{
          uri: item.images
            ? item.images[0]
            : require('../../assets/images/placeholder.png'),
        }}
      />
    </View>
  );
};

const UserPosts: React.FC<UserPostsProps> = ({userId}) => {
  const {userData, loading, error} = useFetchUserById(userId);

  if (loading) {
    return (
      <View style={styles.infoView}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  if (userData?.posts.length === 0) {
    return (
      <View style={styles.infoView}>
        <Text>No posts yet</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.infoView}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userData?.posts}
        renderItem={({item}) => <RenderItem item={item} />}
        keyExtractor={(item: Post) => item.postId}
        numColumns={3}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default UserPosts;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    marginVertical: 7,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    margin: width * 0.01,
  },
  image: {
    width: width * 0.3,
    height: 100,
    borderRadius: 10,
  },
  infoView: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
