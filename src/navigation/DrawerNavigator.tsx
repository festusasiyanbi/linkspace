import {createDrawerNavigator} from '@react-navigation/drawer';
import {RootStackParamList} from '../types/Navigation';
import {useTheme} from '../context/ThemeProvider';
import DrawerContent from '../screens/menu/DrawerContent';
import CurrentUserProfileScreen from '../screens/profile/CurrentUserProfileScreen';

const Drawer = createDrawerNavigator<RootStackParamList>();

const DrawerNavigator = () => {
  const {theme} = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          width: '55%',
          backgroundColor: theme.background,
        },
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="CurrentUserProfile"
        component={CurrentUserProfileScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
