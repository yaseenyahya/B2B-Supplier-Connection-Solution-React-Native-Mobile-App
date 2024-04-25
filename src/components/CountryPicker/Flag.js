import React, { memo } from 'react'
import { Emoji } from './Emoji'
import { CountryCode } from './types'
import { useContext } from './CountryContext'
import { useAsync } from 'react-async-hook'
import {
  Image,
  StyleSheet,
  PixelRatio,
  Text,
  View,
  ActivityIndicator,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    marginRight: 5,
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  imageFlag: {
    marginLeft: 5,
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    opacity: 0.8,
  },
})

const ImageFlag = memo(({ countryCode, flagSize }) => {
  const { getImageFlagAsync } = useContext()
  const asyncResult = useAsync(getImageFlagAsync, [countryCode])
  if (asyncResult.loading) {
    return <ActivityIndicator size={'small'} />
  }
  return (
    <Image
      resizeMode={'contain'}
      style={[
        styles.imageFlag,
        { borderColor: 'transparent', height: flagSize },
      ]}
      source={{ uri: asyncResult.result }}
    />
  )
})

const EmojiFlag = memo(({ countryCode, flagSize }) => {
  const { getEmojiFlagAsync } = useContext()
  const asyncResult = useAsync(getEmojiFlagAsync, [countryCode])

  if (asyncResult.loading) {
    return <ActivityIndicator size={'small'} />
  }
  return (
    <Text
      style={[styles.emojiFlag, { fontSize: flagSize }]}
      allowFontScaling={false}
    >
      <Emoji {...{ name: asyncResult.result }} />
    </Text>
  )
})

export const Flag = ({
  countryCode,
  withEmoji,
  withFlagButton,
  flagSize,
}) =>
  withFlagButton ? (
    <View style={styles.container}>
      {withEmoji ? (
        <EmojiFlag {...{ countryCode, flagSize }} />
      ) : (
        <ImageFlag {...{ countryCode, flagSize }} />
      )}
    </View>
  ) : null

Flag.defaultProps = {
  withEmoji: true,
  withFlagButton: true,
}
