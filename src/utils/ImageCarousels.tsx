/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Dimensions, StyleSheet, Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useTheme} from '../context/ThemeProvider';

const {width} = Dimensions.get('window');

type ImageProps = {
  images: string[];
};

const ImageCarousel = ({images}: ImageProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {theme} = useTheme();

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.itemContainer}>
      <Image
        source={{uri: item || require('../assets/images/placeholder.png')}}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        width={width - 20}
        height={250}
        data={images}
        renderItem={renderItem}
        onSnapToItem={index => setCurrentIndex(index)}
        loop={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.primary : 'gray',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageCarousel;
