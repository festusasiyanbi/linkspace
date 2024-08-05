/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../context/ThemeProvider';
import {useAuth} from '../../context/AuthProvider';
import TabNavigator from '../../navigation/TabNavigator';
import LandingPage from '../intro/LandingPage';

const HomeScreen = () => {
  const {theme} = useTheme();
  const {currentUser} = useAuth();
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      {currentUser ? <TabNavigator /> : <LandingPage />}
    </View>
  );
};

export default HomeScreen;
