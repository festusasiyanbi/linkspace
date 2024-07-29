import {View, StyleSheet} from 'react-native';
import React from 'react';
import {
  IconDefinition,
  faAddressCard,
  faBoltLightning,
  faBriefcase,
  faCalendarAlt,
  faEnvelope,
  faLanguage,
  faLocationDot,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from '../../context/ThemeProvider';
import useFetchUserById from '../../hooks/useFetchUserById';
import Icon from '../../utils/Icon';
import CustomText from '../../utils/CustomText';

type AboutProp = {
  userId: string;
  isCurrentUser: boolean;
};
const UserAbouts: React.FC<AboutProp> = ({userId, isCurrentUser}) => {
  const {theme} = useTheme();
  const {userData, loading, error} = useFetchUserById(userId);
  const getKeyInitial = (key: string) => {
    const words = key.split(' ');
    const capitalizedWords = words.map(
      word => word.charAt(0).toUpperCase() + word.slice(1),
    );
    return capitalizedWords.join(' ');
  };

  const getIcon = (icon: string) => {
    let iconName: IconDefinition | null = null;

    switch (icon.toLowerCase()) {
      case 'name':
      case 'gender':
        iconName = faUser;
        break;
      case 'birthdate':
        iconName = faCalendarAlt;
        break;
      case 'languages':
        iconName = faLanguage;
        break;
      case 'phone':
        iconName = faPhone;
        break;
      case 'email':
        iconName = faEnvelope;
        break;
      case 'address':
        iconName = faLocationDot;
        break;
      case 'about':
        iconName = faAddressCard;
        break;
      case 'interests':
        iconName = faBoltLightning;
        break;
      case 'achievements':
        iconName = faBriefcase;
        break;
      default:
        return '';
    }
    return <Icon name={iconName} color={theme.primary} />;
  };

  if (loading) {
    return (
      <View>
        <CustomText>Loading...</CustomText>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <CustomText>error occured</CustomText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {userData ? (
        Object.entries(userData.userInfo).map(([category, details]) => (
          <View key={category}>
            <CustomText style={styles.titleTxt}>{details.title}</CustomText>
            {Object.entries(details).map(([key, value]) => (
              <View key={key} style={styles.infoView}>
                {key !== 'title' &&
                  (isCurrentUser || (key !== 'email' && key !== 'phone')) && (
                    <View style={styles.infoContainer}>
                      <View style={styles.infoWrapper}>
                        <View style={styles.iconView}>
                          <CustomText>{getIcon(key)}</CustomText>
                        </View>
                        <View style={styles.keyValueView}>
                          <CustomText style={styles.keyTxt}>
                            {getKeyInitial(key)}
                          </CustomText>
                          <CustomText>
                            {Array.isArray(value)
                              ? value.length > 0
                                ? value.join(', ')
                                : ('None yet' as any)
                              : value
                              ? value
                              : ('None yet' as any)}
                          </CustomText>
                        </View>
                      </View>
                    </View>
                  )}
              </View>
            ))}
          </View>
        ))
      ) : (
        <View>
          <CustomText>Nothing to display.</CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  titleTxt: {
    marginVertical: 10,
    fontWeight: '400',
  },
  infoView: {
    width: '100%',
    rowGap: 10,
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderColor: '#dddadd',
  },
  infoWrapper: {
    width: '68%',
    flexDirection: 'row',
    columnGap: 30,
    paddingLeft: 10,
  },
  iconView: {
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: '#dedbf9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyValueView: {
    width: '100%',
    rowGap: 5,
    marginVertical: 5,
  },
  keyTxt: {
    fontSize: 12,
    color: '#888888',
  },
  textInputStyle: {
    width: '100%',
    height: 30,
    borderWidth: 1,
    marginTop: 1,
    paddingVertical: 1,
    fontSize: 12,
  },
});
export default UserAbouts;
