import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useCustomNavigation from '../hooks/useCustomNavigation';
import {faBell, faEnvelope} from '@fortawesome/free-regular-svg-icons';
import CustomText from '../utils/CustomText';
import Icon from '../utils/Icon';

const Header = () => {
  const navigate = useCustomNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.logoTxt}>Connectify</Text>
      <View style={styles.notificationView}>
        <View style={styles.notifierView}>
          <CustomText> {''} </CustomText>
        </View>
        <View style={styles.iconsView}>
          <TouchableOpacity onPress={() => navigate('Notification')}>
            <Icon name={faBell} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Chats')}>
            <Icon name={faEnvelope} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoTxt: {
    fontSize: 30,
    color: '#9747FF',
    fontWeight: '700',
  },
  notificationView: {
    position: 'relative',
  },
  notifierView: {
    position: 'absolute',
    top: -2,
    right: 31,
    height: 7,
    width: 7,
    borderRadius: 50,
    backgroundColor: '#e64545',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 15,
  },
});

export default Header;
