/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../context/ThemeProvider';
import useCustomNavigation from '../hooks/useCustomNavigation';
import {faHomeAlt, faSearch} from '@fortawesome/free-solid-svg-icons';
import {RootStackParamList} from '../types/Navigation';
import Icon from '../utils/Icon';
import CustomText from '../utils/CustomText';
import UploadPostScreen from '../screens/post/UploadPostScreen';
import SearchScreen from '../screens/search/SearchScreen';
import Notification from '../screens/notification/Notification';
import Feed from '../screens/feed/Feed';
import {
  faBell,
  faPlusSquare,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons';
import DrawerNavigator from './DrawerNavigator';
import {useAuth} from '../context/AuthProvider';

const TabNavigator = () => {
  const {theme} = useTheme();
  const {currentUser} = useAuth();
  const navigate = useCustomNavigation();
  const Tab = createBottomTabNavigator<RootStackParamList>();
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}: {focused: boolean}) => {
          let icon;
          switch (route.name) {
            case 'Feed':
              icon = faHomeAlt;
              break;
            case 'Search':
              icon = faSearch;
              break;
            case 'UploadPostScreen':
              icon = faPlusSquare;
              break;
            case 'Notification':
              icon = faBell;
              break;
            case 'Drawer':
              icon = faUserCircle;
              break;
            default:
              icon = faPlusSquare;
          }
          return (
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigate(route.name)}
                style={styles.postBtn}>
                <Icon
                  name={icon}
                  color={focused ? theme.primary : ''}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
              {route.name === 'Notification' && (
                <View style={styles.notifierView}>
                  <CustomText>{''}</CustomText>
                </View>
              )}
              {focused && <Text style={styles.focusedBox} />}
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          borderTopColor: theme.border,
          borderTopWidth: 0.2,
          backgroundColor: theme.background,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="UploadPostScreen" component={UploadPostScreen} />
      <Tab.Screen name="Notification" component={Notification} />
      {currentUser && <Tab.Screen name="Drawer" component={DrawerNavigator} />}
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  iconWrapper: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  focusedBox: {
    width: 15,
    height: 2,
    backgroundColor: '#8971e1',
  },
  iconStyle: {
    marginBottom: 10,
  },
  postBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifierView: {
    position: 'absolute',
    top: 10,
    right: 0,
    height: 7,
    width: 7,
    borderRadius: 50,
    backgroundColor: '#e64545',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
