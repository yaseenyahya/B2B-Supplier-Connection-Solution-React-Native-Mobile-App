import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Modal } from 'react-native-paper'
import { connect } from 'react-redux'
import {
  setAddEditProductDiscountModalToggle,
  setAddEditProductDiscountPrice,
  setAddEditProductDiscountQuantity,
} from '../../../../store/actions/AddEditProductActions'
import { useDropdownAlert } from '../../../../context/AlertDropdownContextProvider'
import { useTranslation } from '../../../../context/Localization'
import TextInput from '../../../../components/TextInput'
import LoadingButton from '../../../../components/LoadingButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import { productDiscountPriceValidator } from '../../../../helpers/productDiscountPriceValidator'
import { productDiscountQuantityValidator } from '../../../../helpers/productDiscountQuantityValidator'

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
  },
  modalInnerContainer: {
    marginHorizontal: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  modalContainerStyle: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
  },
  textInputMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signText: {
    fontSize: 50,
    marginHorizontal: 5,
    textAlignVertical: 'center',
  },
  closeIcon: {
    marginTop: 5,
    marginBottom: 10,
  },
  percentageSymbol:{
    textAlignVertical:"center",
    fontSize:20,
    marginLeft:5
  }
})

function AddEditProductDiscountPopUp(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

  const [discountQuantity, setDiscountQuantity] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)


  const onSavePressed = async () => {
    const discountPriceError = productDiscountPriceValidator(discountPrice)
    const discountQuantityError =
      productDiscountQuantityValidator(discountQuantity)

    if (discountPriceError || discountQuantityError) {
      props.setAddEditProductDiscountQuantity({
        value: '',
        error: discountQuantityError,
      })

      props.setAddEditProductDiscountPrice({
        value: '',
        error: discountPriceError,
      })
      return
    }
    props.setAddEditProductDiscountQuantity({
      value: discountQuantity,
      error: '',
    })
    props.setAddEditProductDiscountPrice({
      value: discountPrice,
      error: '',
    })
    props.setAddEditProductDiscountModalToggle(false)
  }

  useEffect(() => {
    if (props.addEditProductDiscountModalToggle) {
      setDiscountQuantity(props.addEditProductDiscountQuantity.value)
      setDiscountPrice(props.addEditProductDiscountPrice.value)
    }
  }, [props.addEditProductDiscountModalToggle])

  return (
    <Modal
      visible={props.addEditProductDiscountModalToggle}
      dismissable={true}
      contentContainerStyle={styles.modalContainerStyle}
    >
      <View style={styles.modalInnerContainer}>
        <TouchableOpacity
          onPress={() => {
            props.setAddEditProductDiscountModalToggle(false)
          }}
        >
          <Icon
            name="arrow-left"
            style={styles.closeIcon}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
        <View style={styles.textInputMainContainer}>
          <TextInput
            label={translation('Quantity')}
            keyboardType={'numeric'}
            containerStyle={[styles.textInputContainer, styles.textField]}
            value={discountQuantity}
            error={!!props.addEditProductDiscountQuantity.error}
            errorText={translation(props.addEditProductDiscountQuantity.error)}
            onChangeText={(text) => {
              setDiscountQuantity(text.replace(/[^0-9]/g, ''))
              props.setAddEditProductDiscountQuantity({
                value: props.addEditProductDiscountQuantity,
                error: '',
              })

              props.setAddEditProductDiscountPrice({
                value: props.addEditProductDiscountPrice,
                error: '',
              })
              
            }}
          />
          <Text style={styles.signText}>∝</Text>
          <TextInput
            label={translation('Percentage')}
            keyboardType={'numeric'}
            containerStyle={[styles.textInputContainer, styles.textField]}
            value={discountPrice}
            error={!!props.addEditProductDiscountPrice.error}
            errorText={translation(props.addEditProductDiscountPrice.error)}
            onChangeText={(text) => {
              setDiscountPrice(text.replace(/[^0-9]/g, ''))
              props.setAddEditProductDiscountQuantity({
                value: props.addEditProductDiscountQuantity,
                error: '',
              })

              props.setAddEditProductDiscountPrice({
                value: props.addEditProductDiscountPrice,
                error: '',
              })
            }}
          /><Text style={styles.percentageSymbol}>%</Text>
        </View>
        <LoadingButton
          onPress={onSavePressed}
          style={styles.submitButton}
          mode="contained"
        >
          {translation('Save')}
        </LoadingButton>
      </View>
    </Modal>
  )
}
const mapStateToProps = (state) => {
  return { ...state.AddEditProductReducer }
}
export default connect(mapStateToProps, {
  setAddEditProductDiscountModalToggle,
  setAddEditProductDiscountPrice,
  setAddEditProductDiscountQuantity,
})(AddEditProductDiscountPopUp)
