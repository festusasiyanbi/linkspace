import { ImageSourcePropType } from "react-native";

export interface UserProfile {
    id: number;
    username: string;
    fullName?: string;
    bio: string;
    user_avatar: ImageSourcePropType | undefined;
    followers?: [];
    following?: [];
    posts?: [];
  }
  
  export interface BasicInformation {
    title: string;
    name: string | undefined;
    gender: string | undefined;
    birthdate: string | undefined;
    languages: string[];
  }
  
  export interface ContactInformation {
    title: string;
    name: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    address: string | undefined;
  }
  
  export interface Biography {
    title: string;
    about: string | undefined;
    interests: string[];
    achievements: string[];
  }
  
  export interface CurrentUserInfo {
    basicInformation: BasicInformation;
    contactInformation: ContactInformation;
    biography: Biography;
  }