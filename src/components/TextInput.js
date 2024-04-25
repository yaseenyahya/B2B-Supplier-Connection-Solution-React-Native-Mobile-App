import React, { useEffect, useRef, useContext, useState } from 'react'
import { View, StyleSheet, Text, Keyboard } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'
import { KeyboardStatusContext } from '../context/KeyboardStatusContextProvider'
import Icon from 'react-native-vector-icons/FontAwesome'
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})

export default function TextInput({
  containerStyle,
  errorText,
  description,
  inputStyle,
  secureTextEntry,
  ...props
}) {
  const { keyboardHidden } = useContext(KeyboardStatusContext)
  const [allowSecureTextEntry, setAllowSecureTextEntry] = useState(true)
  useEffect(() => {
    if (keyboardHidden) inputRef.current.blur()
  }, [keyboardHidden])

  const inputRef = useRef()

  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        ref={inputRef}
        style={[styles.input, inputStyle]}
        right={
          secureTextEntry && allowSecureTextEntry ? (
            <Input.Icon onPress={()=>{
              setAllowSecureTextEntry(false)
            }} color="gray" name="eye" />
          ) : (
            secureTextEntry &&   <Input.Icon onPress={()=>{
              setAllowSecureTextEntry(true)
            }} color="gray" name="eye-off" />
          )
        }
      
        secureTextEntry={allowSecureTextEntry && secureTextEntry}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}
