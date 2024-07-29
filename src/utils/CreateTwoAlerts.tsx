import {Alert} from 'react-native';

export const CreateTwoButtonAlert = ({
  title,
  message,
  text1,
  text2,
  myAlertFunc,
}: {
  title: string;
  message: string;
  text1: string;
  text2: string;
  myAlertFunc: () => void;
}) =>
  Alert.alert(`${title}`, `${message}`, [
    {
      text: `${text1}`,
      onPress: () => null,
      style: 'cancel',
    },
    {text: `${text2}`, onPress: myAlertFunc, style: 'destructive'},
  ]);