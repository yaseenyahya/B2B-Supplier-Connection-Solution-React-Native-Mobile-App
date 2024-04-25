import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Badge,Button } from 'react-native-paper';
import { theme } from '../core/theme';

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 10,
    top:-3
  },
});

export default function ButtonWithBadge({
  iconStyle,
  badgeValue,
  iconName,
  buttonStyle,
}) {
  return (
    <View>
      {badgeValue != 0 && <Badge style={styles.badge}>{badgeValue}</Badge>}
      <Button onPress={() => {}} mode="text" style={buttonStyle}>
        <Icon
          style={iconStyle}
          name={iconName}
          size={21}
          color={theme.colors.primary}
        />
      </Button>
    </View>
  )
}


