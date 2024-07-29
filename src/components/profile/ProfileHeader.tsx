import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import CustomText from '../../utils/CustomText';
import ReadMore from '../../utils/ReadMore';
import Icon from '../../utils/Icon';
import {
  faAngleLeft,
  faBars,
  faCircleCheck,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons';
import {User} from '../../types/Auth';
import {ThemeColors} from '../../types/Theme';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import UpdateProfileImages from './UpdateProfileImages';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import useFollowUser from '../../hooks/useFollowUser';
import {getCurrentUserUid} from '../../firebase/Firebase';

interface HeaderProps {
  theme: ThemeColors;
  userData: User;
  isCurrentUser: boolean;
  userId?: string;
}

const ProfileHeader: React.FC<HeaderProps> = ({
  theme,
  userData,
  isCurrentUser,
  userId,
}) => {
  const navigation = useNavigation();
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const [isUpdateImageActive, setIsUpdateImageActive] = useState<string>('');
  const {isFollower, followUser, unfollowUser} = useFollowUser({
    userId: fireAuthCurrentUserUid,
    userToFollowId: userId ? userId : '',
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['30%', '30%', '25%'], []);

  const handlePresentModalPress = useCallback((type: string) => {
    setIsUpdateImageActive(type);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    setIsUpdateImageActive('');
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleFollow = () => {
    if (isFollower) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => handlePresentModalPress('cover')}>
          <Image
            source={
              userData?.userCoverImage
                ? {uri: userData?.userCoverImage}
                : require('../../assets/images/placeholder.png')
            }
            style={styles.coverImageStyle}
          />
        </TouchableOpacity>

        {isCurrentUser ? (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={[
              styles.arrowAndBarBtns,
              styles.barBtn,
              {backgroundColor: theme.overlay},
            ]}>
            <Icon name={faBars} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.arrowAndBarBtns,
              styles.arrowBtn,
              {backgroundColor: theme.overlay},
            ]}>
            <Icon name={faAngleLeft} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.avatarBioView}>
        <View style={styles.avatarImageView}>
          <TouchableOpacity onPress={() => handlePresentModalPress('avatar')}>
            <Image
              source={
                userData?.userAvatar
                  ? {uri: userData?.userAvatar}
                  : require('../../assets/images/placeholder.png')
              }
              style={styles.avatarImageStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.usernameView}>
          <CustomText style={styles.usernameTxt}>
            {userData.username}
          </CustomText>
          <Icon name={faCircleCheck} color={theme.primary} />
        </View>
        <View>
          <ReadMore
            caption={
              userData.userBio
                ? userData.userBio
                : 'Let your friends know about you.'
            }
          />
        </View>
        <View style={styles.editShareView}>
          {isCurrentUser ? (
            <TouchableOpacity
              style={[styles.followBtnStyle, {backgroundColor: theme.primary}]}>
              <CustomText style={styles.editProfileBtnTxt}>
                Edit Profile
              </CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.followBtnStyle,
                {backgroundColor: theme.primary},
                isFollower && {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={handleFollow}>
              <CustomText
                style={[
                  styles.editProfileBtnTxt,
                  isFollower && {color: theme.text},
                ]}>
                {isFollower ? 'Following' : 'Follow'}
              </CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.shareBtnStyle, {backgroundColor: theme.primary}]}>
            <Icon name={faShareNodes} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {isUpdateImageActive && isUpdateImageActive !== '' && (
        <UpdateProfileImages
          isUpdateImageActive={isUpdateImageActive}
          setIsUpdateImageActive={setIsUpdateImageActive}
          snapPoints={snapPoints}
          bottomSheetModalRef={bottomSheetModalRef}
          handleDismissModalPress={handleDismissModalPress}
        />
      )}
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  coverImageStyle: {
    height: 200,
    width: '105%',
    top: 80,
    marginHorizontal: -10,
  },
  barBtn: {
    right: 0,
  },
  arrowAndBarBtns: {
    height: 30,
    width: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '55%',
  },
  arrowBtn: {
    left: 0,
  },
  avatarImageView: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  avatarBioView: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
  },
  usernameTxt: {
    alignItems: 'center',
    fontSize: 12,
  },
  followBtnStyle: {
    borderColor: '#dddadd',
    borderWidth: 0.5,
    borderRadius: 5,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileBtnTxt: {
    color: '#fff',
    fontSize: 12,
  },
  editShareView: {
    height: 50,
    width: '35%',
    flexDirection: 'row',
    paddingVertical: 7,
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareBtnStyle: {
    width: 35,
    height: 35,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activityDetailsView: {
    alignItems: 'center',
  },
  activityTypeTxt: {
    fontSize: 10,
    color: '#888888',
  },
  usernameView: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
