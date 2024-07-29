import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {useTheme} from '../context/ThemeProvider';

type IconProps = PropsWithChildren<{
  name: IconDefinition;
  size?: number;
  color?: string;
  style?: any;
}>;

const Icon = ({name, size, color, style}: IconProps) => {
  const {theme} = useTheme();
  const iconColor = color || theme.icon;
  const iconSize = 14 || size;
  return (
    <FontAwesomeIcon
      icon={name}
      size={iconSize}
      color={iconColor}
      style={style}
    />
  );
};

export default Icon;