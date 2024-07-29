import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const fireAuth = auth();
export const db = firestore();
export const reference = storage();
export const getCurrentUserUid = () => fireAuth.currentUser?.uid ?? '';
