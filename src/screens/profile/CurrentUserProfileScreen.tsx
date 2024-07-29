import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import useFetchUserById from '../../hooks/useFetchUserById';
import {useTheme} from '../../context/ThemeProvider';
import CustomText from '../../utils/CustomText';
import {fireAuth, getCurrentUserUid} from '../../firebase/Firebase';
import UserPosts from '../../components/profile/UserPosts';
import UserAbouts from '../../components/profile/UserAbouts';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileCategory from '../../components/profile/ProfileCategory';
import ProfileStats from '../../components/profile/ProfileStats';
import {ScrollView} from 'react-native-virtualized-view';
import useRefresh from '../../hooks/useRefresh';

const CurrentUserProfileScreen = () => {
  const {theme} = useTheme();
  const [category, setCategory] = useState<string>('posts');
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const {userData, loading, error, refetch} = useFetchUserById(
    fireAuthCurrentUserUid,
  );
  const isCurrentUser = userData?.userId === fireAuthCurrentUserUid;
  const {refreshing, handleRefresh} = useRefresh(refetch);

  if (loading) {
    return <CustomText>Loading...</CustomText>;
  }

  if (error) {
    return <CustomText>Error: {error}</CustomText>;
  }

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: theme.background}]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        {userData ? (
          <View style={styles.profileInfoView}>
            <ProfileHeader
              theme={theme}
              userData={userData}
              isCurrentUser={isCurrentUser}
            />
            <ProfileStats
              userId={userData.userId}
              theme={theme}
              userData={userData}
            />
            <ProfileCategory category={category} setCategory={setCategory} />
            {category === 'posts' ? (
              <UserPosts userId={userData.userId} />
            ) : category === 'about' ? (
              <UserAbouts
                userId={userData.userId}
                isCurrentUser={isCurrentUser}
              />
            ) : null}
          </View>
        ) : (
          <SafeAreaView>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }>
              <CustomText>Nothing to display.</CustomText>
              <TouchableOpacity onPress={() => fireAuth.signOut()}>
                <CustomText>Sign out</CustomText>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    </ScrollView>
  );
};

export default CurrentUserProfileScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  profileInfoView: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    top: -80,
  },
});
