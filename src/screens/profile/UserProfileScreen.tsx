import React, {useState} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import useFetchUserById from '../../hooks/useFetchUserById';
import {useTheme} from '../../context/ThemeProvider';
import CustomText from '../../utils/CustomText';
import {getCurrentUserUid} from '../../firebase/Firebase';
import UserPosts from '../../components/profile/UserPosts';
import UserAbouts from '../../components/profile/UserAbouts';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileCategory from '../../components/profile/ProfileCategory';
import ProfileStats from '../../components/profile/ProfileStats';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/Navigation';
import {ScrollView} from 'react-native-virtualized-view';
import useFetchPosts from '../../hooks/UseFetchPosts';
import useRefresh from '../../hooks/useRefresh';

type ProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'UserProfile'>;
  navigation: StackNavigationProp<RootStackParamList, 'UserProfile'>;
};

const UserProfileScreen: React.FC<ProfileScreenProps> = ({route}) => {
  const {theme} = useTheme();
  const [category, setCategory] = useState<string>('posts');
  const {userId} = route.params || {};
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const userToFetch = userId || fireAuthCurrentUserUid;
  const {userData, loading, error} = useFetchUserById(userToFetch);
  const isCurrentUser = userToFetch === fireAuthCurrentUserUid;
  const {refetch} = useFetchPosts({
    userId: userData?.userId,
    followingIds: userData?.following,
  });
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
              userId={userId}
              isCurrentUser={isCurrentUser}
            />
            <ProfileStats
              userId={userToFetch}
              theme={theme}
              userData={userData}
            />
            <ProfileCategory category={category} setCategory={setCategory} />
            {category === 'posts' ? (
              <UserPosts userId={userToFetch} />
            ) : category === 'about' ? (
              <UserAbouts userId={userToFetch} isCurrentUser={isCurrentUser} />
            ) : null}
          </View>
        ) : (
          <View style={styles.voidInfoView}>
            <CustomText>Nothing to display.</CustomText>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;

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
  voidInfoView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
