import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';

type NavigationFunction = (
  screen: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
) => void;

const useCustomNavigation = (): NavigationFunction => {
  const navigator =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigate: NavigationFunction = (
    screen: keyof RootStackParamList,
    params: any,
  ) => {
    navigator.navigate(screen, params);
  };

  return navigate;
};

export default useCustomNavigation;
