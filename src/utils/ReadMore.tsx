import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import CustomText from './CustomText';

const ReadMore = ({caption}: any) => {
  const [showFullCaption, setShowFullCaption] = useState<boolean>(false);

  const renderCaption = () => {
    if (showFullCaption || caption?.length < 100) {
      return caption;
    }
    return `${caption?.slice(0, 100)}`;
  };
  return (
    <View>
      <CustomText>
        {renderCaption()}
        {caption.length >= 100 && (
          <CustomText
            style={styles.readMoreTxt}
            onPress={() => setShowFullCaption(!showFullCaption)}>
            {showFullCaption ? '  [ ^ ]' : '  [ ... ]'}
          </CustomText>
        )}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  readMoreTxt: {
    fontSize: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ReadMore;
