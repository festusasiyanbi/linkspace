/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {faImage, faTimes, faVideo} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from '../../context/ThemeProvider';
import {db, getCurrentUserUid, reference} from '../../firebase/Firebase';
import useCustomNavigation from '../../hooks/useCustomNavigation';
import useFetchUserById from '../../hooks/useFetchUserById';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomText from '../../utils/CustomText';
import {CreateTwoButtonAlert} from '../../utils/CreateTwoAlerts';
import Icon from '../../utils/Icon';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import useToast from '../../hooks/useToast';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {arrayUnion} from '@react-native-firebase/firestore';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';

const UploadPostScreen = () => {
  const {theme} = useTheme();
  const {showErrorToast, showSuccessToast} = useToast();
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const {userData, loading, error} = useFetchUserById(fireAuthCurrentUserUid);
  const navigate = useCustomNavigation();
  const [text, setText] = useState<string>('');
  const [imageUris, setImageUris] = useState<(string | undefined)[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [postObj, setPostObj] = useState({
    email: userData?.email ?? '',
    name: userData?.fullName ?? '',
    username: userData?.username ?? '',
    userId: userData?.userId ?? '',
    userAvatar: userData?.userAvatar ?? '',
    date: new Date(),
    caption: text,
    commentCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    shareCount: 0,
    isVerifiedUser: userData?.isVerifiedUser ?? false,
  });

  const MAX_TEXT_LENGTH: number | null = 350;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['30%', '30%', '25%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };
  useEffect(() => {
    if (userData) {
      setPostObj(prevState => ({
        ...prevState,
        email: userData.email || '',
        name: userData.fullName || '',
        username: userData.username || '',
        userId: userData.userId || '',
        userAvatar: userData.userAvatar || '',
        isVerifiedUser: userData.isVerifiedUser || false,
      }));
    }
  }, [userData]);

  const handleInputChange = (newText: string) => {
    setText(newText);
    setPostObj(prevState => ({
      ...prevState,
      caption: newText,
    }));
  };
  const handleOpenCamera = async () => {
    const options: any = {
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: false,
    };
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      let permissionStatus = await check(permission);

      if (permissionStatus === RESULTS.DENIED) {
        permissionStatus = await request(permission);
      }

      if (
        permissionStatus === RESULTS.GRANTED ||
        permissionStatus !== RESULTS.DENIED
      ) {
        await openCamera(options);
      } else {
        handlePermissionDenied();
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert(
        'Error',
        'An error occurred while selecting images from the gallery.',
      );
    }
  };

  const handleSelectImagesFromGallery = async () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
    };

    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      let permissionStatus = await check(permission);

      if (permissionStatus !== RESULTS.GRANTED) {
        permissionStatus = await request(permission);
      }

      if (
        permissionStatus === RESULTS.GRANTED ||
        permissionStatus !== RESULTS.DENIED
      ) {
        await openGallery(options);
      } else {
        handlePermissionDenied();
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert(
        'Error',
        'An error occurred while selecting images from the gallery.',
      );
    }
  };
  const openGallery = async (options: any) => {
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('Image selection canceled.');
        return;
      } else if (response.assets) {
        const newImageUris = response.assets.map(asset => asset.uri);
        if (imageUris.length + newImageUris.length > 5) {
          Alert.alert(
            'Maximum Image Limit Reached',
            'You can only capture up to 5 images. Click on any of the images to delete them',
          );
          bottomSheetModalRef.current?.dismiss();
        } else {
          setImageUris(prevUris => [...prevUris, ...newImageUris]);
        }
      } else if (response.errorMessage) {
        console.log('Image selection error:', response.errorMessage);
        Alert.alert(
          'Image Selection Error',
          'An error occurred while accessing the image gallery.',
        );
      }
    } catch (err) {
      console.error('Error opening gallery:', err);
      Alert.alert('Error', 'An error occurred while opening the gallery.');
    }
  };
  const openCamera = async (options: any) => {
    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('Camera operation cancelled.');
        return;
      } else if (response.assets) {
        const newImageUris = response.assets.map(asset => asset.uri);
        if (imageUris.length + newImageUris.length > 5) {
          Alert.alert(
            'Maximum Image Limit Reached',
            'You can only capture up to 5 images. Click on any of the images to delete them',
          );
          bottomSheetModalRef.current?.dismiss();
        } else {
          setImageUris(prevUris => [...prevUris, ...newImageUris]);
        }
      } else if (response.errorMessage) {
        console.log('Camera error:', response.errorMessage);
        Alert.alert(
          'Camera Error',
          'An error occurred while accessing the camera.',
        );
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'An error occurred while opening the camera.');
    }
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      'Permission Denied',
      'You need to grant storage permission to access the image gallery. Would you like to go to app settings?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Permission denied, operation canceled.'),
          style: 'cancel',
        },
        {text: 'Settings', onPress: () => Linking.openSettings()},
      ],
    );
  };

  const handleDeleteImage = (imageUrl: any) => {
    const filteredImages = imageUris.filter(image => image !== imageUrl);
    setImageUris(filteredImages);
  };

  const handlePost = async () => {
    if (isPosting) {
      return;
    }
    setIsPosting(true);
    if (!fireAuthCurrentUserUid) {
      showErrorToast('Error!', 'User is not authenticated.');
      setIsPosting(false);
      return;
    }

    if (!userData) {
      showErrorToast('Error!', 'User data is not available.');
      setIsPosting(false);
      return;
    }

    if (!imageUris.length) {
      showErrorToast('Error!', 'No images selected.');
      setIsPosting(false);
      return;
    }

    try {
      let imageUrls = [];
      for (const uri of imageUris) {
        const response = await fetch(uri as any);
        const blob = await response.blob();
        const imageName = `${userData.email}-${new Date().getTime()}`;
        const ref = reference.ref().child(`post-images/${imageName}`);
        await ref.put(blob);
        const downloadUrl = await ref.getDownloadURL();
        imageUrls.push(downloadUrl);
      }

      bottomSheetModalRef.current?.dismiss();
      await saveUserPost(imageUrls);
      showSuccessToast('Success!', 'Post updated successfully!');
      navigate('Feed');
      setTimeout(() => {
        resetPostObj();
      }, 10000);
    } catch (err: any) {
      console.error(
        'Error occurred while uploading images or saving post:',
        err,
      );
      showErrorToast('Error!', 'Error occurred: ' + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const saveUserPost = async (imageUrls?: string[]) => {
    const postObject = {
      ...postObj,
      images: imageUrls,
      date: new Date(),
    };

    await db.collection('posts').add(postObject);

    const userRef = db.collection('users').doc(userData?.userId);
    await userRef.update({posts: arrayUnion(postObject)});
  };

  const resetPostObj = () => {
    setText('');
    setImageUris([]);
    setPostObj({
      email: userData?.email || '',
      name: userData?.fullName || '',
      username: userData?.username || '',
      userId: userData?.userId || '',
      userAvatar: userData?.userAvatar || '',
      date: new Date(),
      caption: '',
      commentCount: 0,
      likeCount: 0,
      bookmarkCount: 0,
      shareCount: 0,
      isVerifiedUser: userData?.isVerifiedUser || false,
    });
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
        <CustomText>Error occured: {error}</CustomText>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <TouchableWithoutFeedback onPress={handlePressOutside}>
            <View style={styles.contentContainer}>
              <View style={styles.postTopView}>
                <TouchableOpacity
                  style={styles.faTimesBtn}
                  onPress={() =>
                    CreateTwoButtonAlert({
                      title: 'Cancel upload?',
                      message: 'Are you sure you want to stop posting?',
                      text1: 'No',
                      text2: 'Discard',
                      myAlertFunc: () => navigate('Feed'),
                    })
                  }>
                  <CustomText>
                    <Icon name={faTimes} />
                  </CustomText>
                </TouchableOpacity>
                <CustomText style={styles.composeTxt}>Compose</CustomText>
                <TouchableOpacity
                  style={[
                    styles.postBtn,
                    {
                      backgroundColor: isPosting
                        ? theme.tertiary
                        : theme.primary,
                    },
                  ]}
                  onPress={handlePost}
                  disabled={isPosting}>
                  <CustomText
                    style={styles.postBtnTxt}
                    onPress={
                      imageUris.length === 0
                        ? () =>
                            CreateTwoButtonAlert({
                              title: 'No Image selected',
                              message:
                                'It seems like you have not selected any images, are you sure you want to continue?',
                              text1: 'No',
                              text2: 'Yes',
                              myAlertFunc: handlePost,
                            })
                        : handlePost
                    }>
                    {isPosting ? 'Posting...' : 'Post'}
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={styles.postWrapper}>
                <View style={styles.postView}>
                  <View style={styles.avatarView}>
                    <Image
                      source={
                        userData?.userAvatar
                          ? {uri: userData.userAvatar}
                          : require('../../assets/images/placeholder.png')
                      }
                      style={styles.avatarImage}
                    />
                    <TouchableOpacity
                      style={[
                        styles.postBtn,
                        styles.postToPublicBtn,
                        {borderColor: theme.border},
                      ]}>
                      <CustomText style={styles.postToPublicTxt}>
                        Post to Public
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.postInputView}>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={MAX_TEXT_LENGTH}
                      placeholder="What's on your mind?"
                      placeholderTextColor={theme.text}
                      value={text}
                      onChangeText={handleInputChange}
                      style={[styles.input, {color: theme.text}]}
                    />
                  </View>
                  <ScrollView
                    style={styles.postImageScrollView}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {imageUris.map((uri, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          CreateTwoButtonAlert({
                            title: 'Delete Photo?',
                            message:
                              'Are you sure you want to delete photo? You can not undo this once it is done.',
                            text1: 'Cancel',
                            text2: 'Delete',
                            myAlertFunc: () => handleDeleteImage(uri),
                          })
                        }>
                        <Image source={{uri}} style={styles.postImage} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.postOperationsView}>
                  <View style={styles.cameraView}>
                    <TouchableOpacity onPress={handlePresentModalPress}>
                      <Icon name={faImage} color={theme.secondary} />
                    </TouchableOpacity>
                    <BottomSheetModal
                      ref={bottomSheetModalRef}
                      index={0}
                      snapPoints={snapPoints}
                      style={[
                        styles.bottomSheetStyle,
                        {shadowColor: theme.border},
                      ]}
                      handleIndicatorStyle={styles.handleIndicatorStyle}
                      backgroundStyle={{
                        backgroundColor: theme.background,
                        borderTopColor: theme.border,
                      }}>
                      <BottomSheetView style={styles.bottomSheetView}>
                        <View style={styles.mediaInfoView}>
                          <CustomText style={{fontWeight: 'bold'}}>
                            Add media
                          </CustomText>
                          <CustomText style={styles.infoTxt}>
                            You can select up to 5 media attachments
                          </CustomText>
                        </View>
                        <View style={styles.mediaButtonsView}>
                          <TouchableOpacity
                            onPress={handleOpenCamera}
                            style={styles.cameraButton}>
                            <Icon name={faVideo} color={theme.secondary} />
                            <CustomText>Camera</CustomText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleSelectImagesFromGallery}
                            style={styles.galleryButton}>
                            <Icon name={faImage} color={theme.secondary} />
                            <CustomText>Media gallery</CustomText>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={styles.mediaCancelButton}
                          onPress={handleDismissModalPress}>
                          <CustomText>Cancel</CustomText>
                        </TouchableOpacity>
                      </BottomSheetView>
                    </BottomSheetModal>
                  </View>
                  <View style={styles.checkBoxView}>
                    <View>
                      <CustomText
                        style={
                          text.length >= 320 && text.length < 345
                            ? styles.orangeTxt
                            : text && text.length >= 345
                            ? styles.redTxt
                            : null
                        }>
                        {MAX_TEXT_LENGTH - text.length}
                      </CustomText>
                    </View>
                    <View>
                      <BouncyCheckbox
                        size={15}
                        fillColor={theme.primary}
                        unFillColor="transparent"
                        innerIconStyle={styles.bouncyCheckBoxInnerIconStyle}
                        isChecked={text.length >= MAX_TEXT_LENGTH}
                        disabled={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  postTopView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  faTimesBtn: {
    width: '30%',
  },
  postBtn: {
    height: 30,
    width: '20%',
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  postToPublicBtn: {
    borderWidth: 0.5,
    width: 90,
    height: 25,
  },
  postToPublicTxt: {
    fontSize: 9,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  composeTxt: {
    width: '30%',
    fontSize: 13,
  },
  postBtnTxt: {
    color: '#fff',
  },
  postWrapper: {
    width: '100%',
    height: '95%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postView: {
    width: '100%',
  },
  postOperationsView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  input: {
    fontSize: 12,
  },
  bouncyCheckBoxInnerIconStyle: {
    borderWidth: 1,
  },
  cameraView: {
    columnGap: 20,
    flexDirection: 'row',
  },
  checkBoxView: {
    columnGap: 10,
    flexDirection: 'row',
  },
  postInputView: {
    height: 150,
    paddingBottom: 10,
  },
  postImageScrollView: {
    gap: 8,
    flexGrow: 1,
  },
  postImage: {
    width: 200,
    height: 250,
    marginRight: 10,
  },
  orangeTxt: {
    color: 'orange',
  },
  redTxt: {
    color: 'red',
  },
  bottomSheetStyle: {
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 10,
  },
  bottomSheetView: {
    width: '90%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  handleIndicatorStyle: {
    display: 'none',
  },
  mediaInfoView: {
    alignItems: 'center',
    rowGap: 5,
  },
  mediaButtonsView: {
    width: '100%',
    rowGap: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mediaCancelButton: {
    borderColor: '#9747FF',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  galleryButton: {
    flexDirection: 'row',
    columnGap: 10,
  },
  cameraButton: {
    flexDirection: 'row',
    columnGap: 10,
  },
  infoTxt: {
    fontSize: 12,
  },
});
export default UploadPostScreen;
