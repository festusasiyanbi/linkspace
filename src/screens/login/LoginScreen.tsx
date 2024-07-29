import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import useCustomNavigation from '../../hooks/useCustomNavigation';
import {LoginUser} from '../../types/Auth';
import {fireAuth} from '../../firebase/Firebase';
import {CreateTwoButtonAlert} from '../../utils/CreateTwoAlerts';
import CustomText from '../../utils/CustomText';
import Icon from '../../utils/Icon';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import useToast from '../../hooks/useToast';

const LoginScreen = () => {
  const navigate = useCustomNavigation();
  const {showErrorToast, showSuccessToast} = useToast();
  const [borderStyle, setBorderStyle] = useState<number>(0.5);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState<LoginUser>({
    email: '',
    password: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  });

  const handleFocus = (inputName: string) => {
    setFocusedInput(inputName);
    setBorderStyle(1.5);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };
  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      showErrorToast(
        'Validation Error',
        'Please fill all the provided inputs.',
      );
      return;
    }

    try {
      const result = await fireAuth.signInWithEmailAndPassword(
        authForm.email,
        authForm.password,
      );
      if (result) {
        showSuccessToast('Login Successful', 'You are now logged in.');
        navigate('Home');
      }
    } catch (error: any) {
      handleLoginError(error);
    }
  };
  const handleLoginError = (error: any) => {
    let errorMessage = 'An unknown error occurred.';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'The email entered is invalid. Please try again.';
        break;
      case 'auth/user-not-found':
        errorMessage =
          'No user found with the provided email. Please sign up first.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/network-request-failed':
        errorMessage =
          'Network error. Please check your internet connection and try again.';
        break;
      default:
        break;
    }
    showErrorToast('Login Error', errorMessage);
  };
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <Animated.View
          style={[styles.backgroundImageStyle, {opacity: fadeAnim}]}>
          <ImageBackground
            source={require('../../assets/images/authImage.png')}
            style={styles.backgroundImage}>
            <TouchableOpacity
              style={styles.faTimesBtn}
              onPress={() =>
                CreateTwoButtonAlert({
                  title: 'Cancel login?',
                  message: 'Are you sure you want to stop signing in?',
                  text1: 'Cancel',
                  text2: 'Yes',
                  myAlertFunc: () => navigate('Intro'),
                })
              }>
              <CustomText>
                <Icon name={faTimes} size={20} color="#fff" />
              </CustomText>
            </TouchableOpacity>
            <CustomText style={styles.logoTxt}>Connectify</CustomText>
            <View style={styles.formContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'Email' && {borderWidth: borderStyle},
                ]}
                placeholder="Email"
                value={authForm.email}
                onChangeText={text =>
                  setAuthForm({...authForm, email: text.toLowerCase()})
                }
                onFocus={() => handleFocus('Email')}
                onBlur={handleBlur}
                placeholderTextColor="#ddaadd"
              />
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'Password' && {borderWidth: borderStyle},
                ]}
                secureTextEntry={true}
                placeholder="Password"
                value={authForm.password}
                onChangeText={text =>
                  setAuthForm({...authForm, password: text})
                }
                onFocus={() => handleFocus('Password')}
                onBlur={handleBlur}
                placeholderTextColor="#ddaadd"
              />
              <TouchableOpacity onPress={handleLogin} style={styles.authBtn}>
                <CustomText style={styles.loginTxt}>Login</CustomText>
              </TouchableOpacity>
            </View>
            <View style={styles.signUpView}>
              <CustomText style={styles.signupTxt}>
                Don't have an account?
              </CustomText>
              <TouchableOpacity onPress={() => navigate('SignUp')}>
                <CustomText style={styles.signupBtn}>sign up</CustomText>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  faTimesBtn: {
    width: '90%',
    alignItems: 'flex-start',
    backgroundColor: 'none',
    position: 'absolute',
    left: 10,
    top: '8%',
  },
  backgroundImageStyle: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTxt: {
    fontSize: 30,
    color: '#8971e1',
    fontWeight: '700',
    paddingBottom: 40,
  },
  formContainer: {
    width: '80%',
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#dddadd',
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
    fontFamily: 'monospace',
    fontSize: 12,
    borderWidth: 0.5,
    color: '#ddaadd',
  },
  authBtn: {
    backgroundColor: '#8971e1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 2,
  },
  signupTxt: {
    color: '#fff',
  },
  signupBtn: {
    color: '#8971e1',
  },
});
export default LoginScreen;
