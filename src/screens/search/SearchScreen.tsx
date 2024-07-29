import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import useFetchAllUsers from '../../hooks/useFetchAllUsers';
import {useTheme} from '../../context/ThemeProvider';
import useCustomNavigation from '../../hooks/useCustomNavigation';
import Icon from '../../utils/Icon';
import {faMagnifyingGlass, faTimes} from '@fortawesome/free-solid-svg-icons';
import CustomText from '../../utils/CustomText';
import {CleanDigitOutput} from '../../utils/CleanDigitOutput';
import {RefreshControl} from 'react-native-gesture-handler';
import useRefresh from '../../hooks/useRefresh';

const SearchScreen = () => {
  const navigate = useCustomNavigation();
  const {theme} = useTheme();
  const [text, setText] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const {users, refetch} = useFetchAllUsers();
  const {refreshing, handleRefresh} = useRefresh(refetch);

  const handleInputChange = (value: string) => {
    setText(value);
  };

  const filteredUsers = () => {
    return users.filter(user =>
      user.username.toLowerCase().includes(text.toLowerCase()),
    );
  };
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };
  const navigateToUserProfile = (userId: string) => {
    navigate('UserProfile', {userId: userId});
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside} accessible={false}>
      <SafeAreaView
        style={[styles.safeAreaView, {backgroundColor: theme.background}]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <View style={styles.container}>
            <View style={styles.inputView}>
              <Icon name={faMagnifyingGlass} />
              <TextInput
                style={[
                  styles.input,
                  isFocused && styles.inputFocused,
                  {color: theme.text},
                ]}
                placeholder="Search for any user"
                placeholderTextColor={theme.text}
                autoCapitalize="none"
                autoCorrect={false}
                value={text}
                onChangeText={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {text && (
                <TouchableOpacity onPress={() => setText('')}>
                  <Icon name={faTimes} />
                </TouchableOpacity>
              )}
            </View>
            {Boolean(text) &&
              Array.isArray(filteredUsers()) &&
              filteredUsers().length > 0 && (
                <View style={styles.userListView}>
                  {filteredUsers().map(user => (
                    <TouchableOpacity
                      key={user.userId}
                      style={styles.userList}
                      onPress={() => navigateToUserProfile(user.userId)}>
                      <Image
                        source={
                          user?.userAvatar
                            ? {uri: user?.userAvatar}
                            : require('../../assets/images/placeholder.png')
                        }
                        style={styles.userAvatarStyle}
                      />
                      <View>
                        <CustomText>{user.username}</CustomText>
                        <CustomText style={styles.bioTxt}>
                          {user.userBio.length === 0
                            ? 'Bio'
                            : user.userBio.length > 10
                            ? user.userBio.slice(0, 10) + '...'
                            : user.userBio}{' '}
                          &middot;{' '}
                          {CleanDigitOutput(
                            user.followers.length === 0
                              ? 0
                              : user.followers.length,
                          )}{' '}
                          followers
                        </CustomText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            {Boolean(text) &&
              (!filteredUsers() || filteredUsers().length === 0) && (
                <View>
                  <CustomText style={styles.noUserTxt}>
                    No user found.
                  </CustomText>
                </View>
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  inputView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dddadd',
  },
  input: {
    height: 40,
    width: '90%',
    fontSize: 12,
    paddingLeft: 10,
  },
  inputFocused: {},
  userListView: {
    width: '100%',
    rowGap: 5,
  },
  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  userAvatarStyle: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  bioTxt: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  noUserTxt: {
    color: 'red',
  },
});
export default SearchScreen;
