import React from 'react'
import { TouchableOpacity, View, StyleSheet,Text } from 'react-native'
import { AutocompleteDropdown } from './AutoCompleteDropDownMain'
import { theme } from '../core/theme'
const styles = StyleSheet.create({
  inputMainContainer: {
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 7,
 borderColor:"#787777",
 borderWidth:1
  },
  suggestionInputContainer: {
    borderRadius: 0,
  },
  error:{
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  }
})

export default function AutoCompleteDropDown({notCloseOnBlur,position,loading,errorText, dataSet, onSelectItem,placeholder,inputMainContainerStyles,initialValue }) {

  return (
    <View>
      <AutocompleteDropdown
      notCloseOnBlur={notCloseOnBlur}
       loading={loading}
       position={position}
        containerStyle={[styles.inputMainContainer,inputMainContainerStyles]}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        suggestionsListContainerStyle={styles.suggestionInputContainer}
        inputContainerStyle={styles.inputContainer}
        textInputProps={{
          placeholder: placeholder,
          color: '#000000',
          placeholderTextColor: '#646464',
          
        }}
        onSelectItem={(item) => {
          onSelectItem && onSelectItem(item)
        }}
        showClear={true}
        dataSet={dataSet}
        emptyResultText={"No items to selected"}
        initialValue={initialValue}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}
