import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from '@fortawesome/free-regular-svg-icons';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons/faEllipsis';

import useFetchUserById from '../hooks/useFetchUserById';
import {Post} from '../types/Post';
import {useTheme} from '../context/ThemeProvider';
import CustomText from '../utils/CustomText';
import Icon from '../utils/Icon';
import FormatDateAndTime from '../utils/FormatDateAndTime';
import ImageCarousel from '../utils/ImageCarousels';
import ReadMore from '../utils/ReadMore';

type PostItemProps = {
  item: Post;
};

const PostItem: React.FC<PostItemProps> = ({item}: PostItemProps) => {
  const {theme} = useTheme();
  const {userData} = useFetchUserById(item.userId);
  return (
    <View style={[styles.postView, {borderColor: theme.border}]}>
      <View style={[styles.postContainer, {borderColor: theme.border}]}>
        <View style={styles.wrapper}>
          <View style={styles.postTopInfoView}>
            <View style={styles.avatarNameView}>
              <Image
                source={
                  userData?.userAvatar
                    ? {uri: userData?.userAvatar}
                    : require('../assets/images/placeholder.png')
                }
                style={styles.avatarStyle}
              />
              <View style={styles.nameDateView}>
                <View style={styles.usernameView}>
                  <CustomText>{item.username}</CustomText>
                  {item.isVerifiedUser ? (
                    <Icon name={faCircleCheck} color={theme.primary} />
                  ) : (
                    ''
                  )}
                </View>
                <CustomText style={styles.dateTxt}>
                  {FormatDateAndTime(item.date)} ago
                </CustomText>
              </View>
            </View>
            <Icon name={faEllipsis} style={styles.iconStyle} />
          </View>
          <View style={styles.captionView}>
            <ReadMore caption={item.caption} />
          </View>
          {item.images.length !== 0 && (
            <ImageCarousel images={item?.images ?? []} />
          )}
          <View style={styles.operationIconsView}>
            <View style={styles.iconStyleView}>
              <Icon name={faComment} style={styles.iconStyle} />
              <CustomText>{item.commentCount}</CustomText>
            </View>
            <View style={styles.iconStyleView}>
              <Icon name={faHeart} style={styles.iconStyle} />
              <CustomText>{item.likeCount}</CustomText>
            </View>
            <View style={styles.iconStyleView}>
              <Icon name={faBookmark} style={styles.iconStyle} />
              <CustomText>{item.bookmarkCount}</CustomText>
            </View>
            <View style={styles.iconStyleView}>
              <Icon name={faPaperPlane} style={styles.iconStyle} />
              <CustomText>{item.shareCount}</CustomText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  postView: {
    width: '100%',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginTop: 15,
    paddingVertical: 10,
  },
  postContainer: {
    height: '70%',
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  iconStyle: {
    fontWeight: '700',
  },
  postTopInfoView: {
    width: '100%',
    height: '10%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarNameView: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  nameDateView: {
    paddingLeft: 15,
  },
  avatarStyle: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  captionView: {
    marginVertical: 10,
  },
  operationIconsView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconStyleView: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
  },
  usernameView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5,
  },
  dateTxt: {
    fontSize: 11,
  },
});

export default PostItem;
