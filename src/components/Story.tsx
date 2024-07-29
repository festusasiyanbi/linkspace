import {View, ScrollView, Image, StyleSheet} from 'react-native';
import React from 'react';
import {UserStory} from '../types/Story';
import CustomText from '../utils/CustomText';
import { useTheme } from '../context/ThemeProvider';

const stories: UserStory[] = [
  {
    id: 1,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'festusasiyanbi',
  },
  {
    id: 2,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'hennyharyor',
  },
  {
    id: 3,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'jenniferjude',
  },
  {
    id: 4,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'festusasiyanbi',
  },
  {
    id: 5,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'hennyharyor',
  },
  {
    id: 6,
    userAvatar: require('../assets/images/avatar.png'),
    username: 'jenniferjude',
  },
];
export default function Story({isNewStory = true}: any) {
  const {theme} = useTheme();
  return (
    <ScrollView
      style={styles.scrollView}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      {stories.map(story => (
        <View key={story.id} style={styles.storyContainer}>
          <View
            style={[
              styles.storyImageView,
              isNewStory && styles.storyBorderGradient,
              {borderColor: theme.primary}
            ]}>
            <Image source={story.userAvatar} style={styles.image} />
          </View>
          <CustomText>{story.username.slice(0, 8) + '...'}</CustomText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  storyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  storyImageView: {
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    objectFit: 'contain',
  },
  storyBorderGradient: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#8971e1',
  },
});
