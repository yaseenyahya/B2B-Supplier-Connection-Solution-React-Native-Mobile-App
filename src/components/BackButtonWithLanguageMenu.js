import React from 'react'
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import { theme } from '../core/theme'
import { languageList } from '../context/Localization/languages'
import { getLanguageCodeFromLS } from '../context/Localization/helpers'
import { useTranslation } from '../context/Localization'
import  LanguageButtonMenu  from './LanguageButtonMenu'

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    marginTop: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
  languageBtn: {
    marginRight: -20,
  },
  backBtn: {
    marginLeft: -20,
  },
  selectedLanguageMenu: {
    backgroundColor: '#b7b7b7',
    color: 'white',
  },
})

export default function BackButtonWithLanguageMenu({ goBack, showBackButton = true }) {

  return (
    <View
      style={[
        styles.mainContainer,
        !showBackButton ? { justifyContent: 'flex-end' } : null,
      ]}
    >
      {showBackButton && (
        <TouchableOpacity
          onPress={goBack}
          style={[styles.container, styles.backBtn]}
        >
          <Icon name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
      )}
     <LanguageButtonMenu languageButtonStyle={[styles.container,styles.languageBtn]}/>
    </View>
  )
}
