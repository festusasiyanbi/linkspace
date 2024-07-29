import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import CustomText from '../../utils/CustomText';
import {useTheme} from '../../context/ThemeProvider';
import {fireAuth} from '../../firebase/Firebase';
import Icon from '../../utils/Icon';
import {
  faCog,
  faUserEdit,
  faUserFriends,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import useCustomNavigation from '../../hooks/useCustomNavigation';
import {CreateTwoButtonAlert} from '../../utils/CreateTwoAlerts';
import {useAuth} from '../../context/AuthProvider';

const DrawerContent = (props: any) => {
  const {theme} = useTheme();
  const navigate = useCustomNavigation();
  const {currentUser} = useAuth();
  const menuItems = [
    {
      icon: <Icon name={faUserEdit} color={theme.tertiary} />,
      name: 'Edit Profile',
      screen: 'EditUserProfile',
    },
    {
      icon: <Icon name={faCog} color={theme.tertiary} />,
      name: 'Settings',
      screen: 'Settings',
    },
    {
      icon: <Icon name={faUsers} color={theme.tertiary} />,
      name: 'My Followers',
      screen: 'Followers',
    },
    {
      icon: <Icon name={faUserFriends} color={theme.tertiary} />,
      name: 'My Following',
      screen: 'Following',
    },
  ];
  const handleSignOut = async () => {
    if (currentUser) {
      try {
        await fireAuth.signOut();
        navigate('Login');
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    }
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawerContentContainer,
        {backgroundColor: theme.background},
      ]}>
      <View style={styles.menuBtnView}>
        {menuItems.map((menuItem, index) => (
          <TouchableOpacity style={styles.menuBtn} key={index}>
            {menuItem.icon}
            <CustomText>{menuItem.name}</CustomText>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.logoutBtn, {backgroundColor: theme.primary}]}
        onPress={() =>
          CreateTwoButtonAlert({
            title: 'Sign out of account',
            message: 'Are you sure you want to sign out?',
            text1: 'No',
            text2: 'Yes',
            myAlertFunc: handleSignOut,
          })
        }>
        <Text style={{color: '#fff'}}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutBtn: {
    width: '95%',
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  menuBtnView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: '95%',
    height: 35,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    paddingLeft: 10,
  },
});
export default DrawerContent;
