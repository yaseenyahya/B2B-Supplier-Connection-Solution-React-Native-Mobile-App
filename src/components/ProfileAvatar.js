import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { theme } from '../core/theme'

const styles = StyleSheet.create({
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'white',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#c7c7c7',
  },
  noProfilePicture: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity:0.8
  },
})

export default function ProfileAvatar({ source, style }) {
  return (
    <>
      {source == '' || source == undefined ? (
        <View style={[styles.profilePicture, styles.noProfilePicture, style]}>
          <Icon name={'user'} size={50} color={theme.colors.primary} />
        </View>
      ) : (
        <Image style={styles.profilePicture} source={{ uri: source }}></Image>
      )}
    </>
  )
}
