/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../context/ThemeProvider';
import {useAuth} from '../../context/AuthProvider';
import TabNavigator from '../../navigation/TabNavigator';
import LoginScreen from '../login/LoginScreen';

const HomeScreen = () => {
  const {theme} = useTheme();
  const {currentUser} = useAuth();
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      {currentUser ? <TabNavigator /> : <LoginScreen />}
    </View>
  );
};

export default HomeScreen;
