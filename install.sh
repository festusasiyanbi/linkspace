#!/bin/bash

# Install production dependencies``
npm install --save \
  @fortawesome/fontawesome-svg-core@^6.5.2 \
  @fortawesome/free-brands-svg-icons@^6.5.2 \
  @fortawesome/free-regular-svg-icons@^6.5.2 \
  @fortawesome/free-solid-svg-icons@^6.5.2 \
  @fortawesome/react-native-fontawesome@^0.3.2 \
  @react-native-async-storage/async-storage@^1.24.0 \
  @react-native-community/masked-view@^0.1.11 \
  @react-native-firebase/app@^20.1.0 \
  @react-native-firebase/auth@^20.1.0 \
  @react-native-firebase/firestore@^20.1.0 \
  @react-native-firebase/storage@^20.1.0 \
  @react-navigation/bottom-tabs@^6.6.0 \
  @react-navigation/drawer@^6.7.0 \
  @react-navigation/native@^6.1.17 \
  @react-navigation/native-stack@^6.10.0 \
  @react-navigation/stack@^6.4.0 \
  install@^0.13.0 \
  react@18.2.0 \
  react-native@0.74.3 \
  react-native-gesture-handler@^2.17.1 \
  react-native-image-slider-box@^2.0.7 \
  react-native-reanimated@^3.14.0 \
  react-native-reanimated-carousel@^3.5.1 \
  react-native-safe-area-context@^4.10.8 \
  react-native-screens@^3.32.0 \
  react-native-svg@^15.4.0 \
  react-native-toast-message@^2.2.0 \
  react-native-vector-icons@^10.1.0 \
  react-native-virtualized-view@^1.0.0 \
  yup@^1.4.0

# Install dev dependencies
npm install --save-dev \
  @babel/core@^7.20.0 \
  @babel/preset-env@^7.20.0 \
  @babel/runtime@^7.20.0 \
  @gorhom/bottom-sheet@^4.6.3 \
  @react-native/babel-preset@0.74.85 \
  @react-native/eslint-config@0.74.85 \
  @react-native/metro-config@0.74.85 \
  @react-native/typescript-config@0.74.85 \
  @types/react@^18.2.6 \
  @types/react-test-renderer@^18.0.0 \
  babel-jest@^29.6.3 \
  eslint@^8.19.0 \
  jest@^29.6.3 \
  prettier@2.8.8 \
  react-native-bouncy-checkbox@^4.0.1 \
  react-native-image-picker@^7.1.2 \
  react-native-modal@^13.0.1 \
  react-native-permissions@^4.1.5 \
  react-test-renderer@18.2.0 \
  typescript@5.0.4

echo "All dependencies have been installed."