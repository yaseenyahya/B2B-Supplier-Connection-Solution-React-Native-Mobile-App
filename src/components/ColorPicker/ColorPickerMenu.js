import React from 'react'
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import { theme } from '../../core/theme'
import ColorPicker from './ColorPicker'

const styles = StyleSheet.create({
  menuButton: {

    width: 20,
    height: 20,
  },
  menuButtonContainer: {
    padding: 17,
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  colorPickerContainer: {
    width: 180,
    paddingHorizontal: 10,
  },
})

export default function ColorPickerMenu({onColorChangeComplete,selectedColor}) {
  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)

  const closeMenu = () => setVisible(false)
 
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <View style={styles.menuButtonContainer}>
          {selectedColor ? 
            <View style={[{backgroundColor:selectedColor},styles.menuButton]}></View>
            :
            <Icon name={'ban'} size={22} color={"gray"} />
          }
          </View>
        </TouchableOpacity>
      }
    >
      <View style={styles.colorPickerContainer}>
        <ColorPicker
          onColorChangeComplete={(color) => {
            closeMenu();
            onColorChangeComplete && onColorChangeComplete(color)
          }}
          palette={['#ff0000', '#ffff00', '#0000ff', '#000000']}
          row={false}
          swatchesOnly={true}
        />
      </View>
    </Menu>
  )
}
