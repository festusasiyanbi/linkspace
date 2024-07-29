import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import Story from '../../components/Story';
import Header from '../../components/Header';
import {useTheme} from '../../context/ThemeProvider';
import Posts from '../../components/Posts';
import {ScrollView} from 'react-native-virtualized-view';
import useFetchUserById from '../../hooks/useFetchUserById';
import {getCurrentUserUid} from '../../firebase/Firebase';
import useFetchPosts from '../../hooks/UseFetchPosts';
import useRefresh from '../../hooks/useRefresh';

const Feed = () => {
  const {theme} = useTheme();
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const {userData} = useFetchUserById(fireAuthCurrentUserUid);
  const {refetch} = useFetchPosts({
    userId: userData?.userId,
    followingIds: userData?.following,
  });
  const {refreshing, handleRefresh} = useRefresh(refetch);
  return (
    <SafeAreaView
      style={[styles.safeareaView, {backgroundColor: theme.background}]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={[styles.container, {backgroundColor: theme.background}]}>
          <Header />
          <Story />
          <Posts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
});
export default Feed;
