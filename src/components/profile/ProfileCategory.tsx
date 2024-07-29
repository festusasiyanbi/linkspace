import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from '../../utils/Icon';
import {faAddressBook, faListUl} from '@fortawesome/free-solid-svg-icons';
import CustomText from '../../utils/CustomText';

interface CategoryProps {
  category: string;
  setCategory: (category: string) => void;
}

const ProfileCategory: React.FC<CategoryProps> = ({category, setCategory}) => {
  return (
    <View style={styles.categoryView}>
      <TouchableOpacity
        onPress={() => setCategory('posts')}
        style={[
          styles.categoryBtn,
          category === 'posts' && styles.activeCategoryBtn,
        ]}>
        <Icon
          name={faListUl}
          size={12}
          color={category === 'posts' ? '#604CC3' : ''}
        />
        <CustomText
          style={[
            styles.categoryBtnTxt,
            category === 'posts' && styles.activeCategoryTxt,
          ]}>
          Posts
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCategory('about')}
        style={[
          styles.categoryBtn,
          category === 'about' && styles.activeCategoryBtn,
        ]}>
        <Icon
          name={faAddressBook}
          size={12}
          color={category === 'about' ? '#604CC3' : ''}
        />
        <CustomText
          style={[
            styles.categoryBtnTxt,
            category === 'about' && styles.activeCategoryTxt,
          ]}>
          About
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCategory;

const styles = StyleSheet.create({
  categoryView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBtn: {
    height: 40,
    width: '50%',
    borderColor: '#dddadd',
    borderBottomWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnTxt: {
    fontSize: 12,
  },
  activeCategoryBtn: {
    borderColor: '#604CC3',
  },
  activeCategoryTxt: {
    color: '#7752d5',
  },
});
