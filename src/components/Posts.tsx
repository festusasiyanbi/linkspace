import {FlatList, StyleSheet, View} from 'react-native';
import useFetchUserById from '../hooks/useFetchUserById';
import {getCurrentUserUid} from '../firebase/Firebase';
import useFetchPosts from '../hooks/UseFetchPosts';
import CustomText from '../utils/CustomText';
import {Post} from '../types/Post';
import PostItem from './PostItem';
import React, {useMemo} from 'react';

const Posts = () => {
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const {userData} = useFetchUserById(fireAuthCurrentUserUid);
  const {posts, loading, error} = useFetchPosts({
    userId: userData?.userId,
    followingIds: userData?.following,
  });
  const MemoizedPostItem = React.memo(PostItem);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a: Post, b: Post) => {
      if (typeof a.date === 'number' && typeof b.date === 'number') {
        return b.date - a.date;
      }
      if (a.date instanceof Date && b.date instanceof Date) {
        return b.date.getTime() - a.date.getTime();
      }
      if (typeof a.date === 'string' && typeof b.date === 'string') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [posts]);

  if (error) {
    return (
      <View>
        <CustomText>{error}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <CustomText>Loading posts...</CustomText>
      ) : !loading && posts.length === 0 ? (
        <CustomText>No posts found.</CustomText>
      ) : (
        <FlatList
          data={sortedPosts}
          renderItem={({item}) => <MemoizedPostItem item={item} />}
          keyExtractor={(item: Post) => item.postId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default Posts;
