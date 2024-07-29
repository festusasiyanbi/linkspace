import {ImageSourcePropType} from 'react-native';

export interface UserStory {
  id: number;
  userAvatar: ImageSourcePropType | undefined;
  username: string;
}
