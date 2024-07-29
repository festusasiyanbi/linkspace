import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomText from '../../utils/CustomText';
import {CleanDigitOutput} from '../../utils/CleanDigitOutput';
import {ThemeColors} from '../../types/Theme';
import {User} from '../../types/Auth';

interface StatProps {
  userId: any;
  theme: ThemeColors;
  userData: User;
}

const ProfileStats: React.FC<StatProps> = ({theme, userData}) => {
  return (
    <View style={[styles.profileActivitiesView, {borderColor: theme.border}]}>
      <View style={styles.activityWrapper}>
        <View style={styles.activityDetailsView}>
          <CustomText>
            {CleanDigitOutput(
              userData?.posts?.length ? userData?.posts?.length : 0,
            )}
          </CustomText>
          <CustomText style={styles.activityTypeTxt}>
            {`Post${userData?.posts?.length === 1 ? '' : 's'}`}
          </CustomText>
        </View>
      </View>
      <View style={styles.activityWrapper}>
        <View style={styles.activityDetailsView}>
          <CustomText>
            {CleanDigitOutput(
              userData?.followers?.length ? userData?.followers?.length : 0,
            )}
          </CustomText>
          <CustomText style={styles.activityTypeTxt}>
            Follower{userData?.followers?.length === 1 ? '' : 's'}
          </CustomText>
        </View>
      </View>
      <View style={styles.activityWrapper}>
        <View style={styles.activityDetailsView}>
          <CustomText>
            {CleanDigitOutput(
              userData?.following?.length ? userData?.following?.length : 0,
            )}
          </CustomText>
          <CustomText style={styles.activityTypeTxt}>Following</CustomText>
        </View>
      </View>
    </View>
  );
};

export default ProfileStats;

const styles = StyleSheet.create({
  profileActivitiesView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    paddingVertical: 7,
    marginVertical: 8,
  },
  activityWrapper: {
    width: '33%',
  },
  activityDetailsView: {
    alignItems: 'center',
  },
  activityTypeTxt: {
    fontSize: 10,
    color: '#888888',
  },
});
