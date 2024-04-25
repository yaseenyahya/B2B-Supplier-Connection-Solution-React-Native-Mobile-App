import React, { memo } from 'react'
import { Text } from 'react-native'
import nodeEmoji from 'node-emoji'

const Emoji = memo(({ name }) => {
  const emoji = nodeEmoji.get(name)
  return <Text allowFontScaling={false}>{emoji}</Text>
})

export { Emoji }
