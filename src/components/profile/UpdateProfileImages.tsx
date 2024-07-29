import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Dispatch, RefObject, SetStateAction, useState} from 'react';
import {faImage, faVideo} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from '../../context/ThemeProvider';
import useFetchUserById from '../../hooks/useFetchUserById';
import {db, getCurrentUserUid, reference} from '../../firebase/Firebase';
import useToast from '../../hooks/useToast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomText from '../../utils/CustomText';
import Icon from '../../utils/Icon';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

type UpdateProfileImagesProps = {
  isUpdateImageActive: string;
  setIsUpdateImageActive: Dispatch<SetStateAction<string>>;
  handleDismissModalPress: () => void;
  snapPoints: string[];
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
};

const UpdateProfileImages = ({
  isUpdateImageActive,
  setIsUpdateImageActive,
  handleDismissModalPress,
  snapPoints,
  bottomSheetModalRef,
}: UpdateProfileImagesProps) => {
  const {theme} = useTheme();
  const fireAuthCurrentUserUid = getCurrentUserUid();
  const {userData, loading, error, refetch} = useFetchUserById(
    fireAuthCurrentUserUid ?? '',
  );

  const [newImage, setNewImage] = useState<string | undefined>('');
  const {showSuccessToast} = useToast();

  const imageUri = (() => {
    if (isUpdateImageActive === 'avatar') {
      return newImage || userData?.userAvatar || null;
    } else if (isUpdateImageActive === 'cover') {
      return newImage || userData?.userCoverImage || null;
    }
    return null;
  })();

  const handleUpdateUserImage = async () => {
    if (!imageUri) {
      Alert.alert('Error: No image to upload');
      return;
    }

    try {
      const imageRef = reference.ref(
        `${
          isUpdateImageActive === 'avatar' ? 'userAvatar' : 'userCoverImage'
        }/${userData?.userId}`,
      );
      await imageRef.putFile(imageUri);

      const downloadURL = await imageRef.getDownloadURL();

      const userDocRef = db.collection('users').doc(userData?.userId);
      await userDocRef.update({
        [isUpdateImageActive === 'avatar' ? 'userAvatar' : 'userCoverImage']:
          downloadURL,
      });
      handleDismissModalPress();
      showSuccessToast(
        'Success!',
        `${
          isUpdateImageActive === 'avatar' ? 'Profile Photo' : 'Cover Photo'
        } successfully updated!`,
      );
      setIsUpdateImageActive('');
      setNewImage(undefined);
      refetch();
    } catch (err) {
      console.error(err);
    }
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
        const newImageUri = response.assets[0].uri;
        if (!newImageUri) {
          Alert.alert('No image selected', 'Please select an image');
          bottomSheetModalRef.current?.dismiss();
        } else {
          setNewImage(newImageUri);
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
        const newImageUri = response.assets[0].uri;
        if (!newImageUri) {
          Alert.alert('No image selected', 'Please select an image');
          bottomSheetModalRef.current?.dismiss();
        } else {
          setNewImage(newImageUri);
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
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      style={[styles.bottomSheetStyle, {shadowColor: theme.border}]}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      backgroundStyle={{
        backgroundColor: theme.background,
        borderTopColor: theme.border,
      }}>
      <BottomSheetView style={styles.bottomSheetView}>
        <CustomText style={styles.updatePhotoTxt}>
          Update {isUpdateImageActive === 'avatar' ? 'Profile' : 'Cover'} Photo
        </CustomText>
        {!newImage ? (
          <>
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
          </>
        ) : (
          <View style={styles.imagePreviewView}>
            <Image source={{uri: newImage}} style={styles.newImage} />
            <View style={styles.newImageOperationsView}>
              <TouchableOpacity
                style={[styles.newImageBtn, styles.doneBtn]}
                onPress={handleUpdateUserImage}>
                <Text style={styles.doneTxt}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.newImageBtn, styles.uploadNewImageBtn]}
                onPress={() => setNewImage(undefined)}>
                <CustomText>Upload New Image</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default UpdateProfileImages;

const styles = StyleSheet.create({
  container: {
    height: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 10,
  },
  topView: {
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
  },
  uploadBtnView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  imagePickerView: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-around',
    columnGap: 5,
  },
  goBackBtn: {
    rowGap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathToImageBtn: {
    rowGap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathToImageTxt: {
    fontSize: 10,
  },
  imageView: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '90%',
    height: 200,
  },
  updateImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  updateImageBackBtn: {
    width: '45%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  updateImageBtn: {
    width: '45%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    alignItems: 'flex-start',
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
  imagePreviewView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 3,
  },
  newImageOperationsView: {
    width: '100%',
    rowGap: 5,
  },
  newImageBtn: {
    width: '100%',
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#9747FF',
    borderWidth: 1,
  },
  newImage: {
    width: 150,
    height: 100,
    marginTop: 10,
  },
  uploadNewImageBtn: {
    backgroundColor: 'transparent',
  },
  doneBtn: {
    backgroundColor: '#9747FF',
  },
  updatePhotoTxt: {
    fontWeight: 'bold',
  },
  doneTxt: {color: '#fff'},
});
