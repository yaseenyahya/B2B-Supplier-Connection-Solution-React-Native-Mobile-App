import React, { useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { RadioButton, Divider, TextInput as Input } from 'react-native-paper'
import Background from '../components/Background'
import BackButtonWithTitleAndComponent from '../components/BackButtonWithTitleAndComponent'
import { connect } from 'react-redux'
import {
  setInfoForProductsFormValueCodeId,
  setInfoForProductsFormName,
  setInfoForProductsFormProductCategory,
  setInfoForProductsFormUOM,
  setInfoForProductsFormLength,
  setInfoForProductsFormWidth,
  setInfoForProductsFormHeight,
  setInfoForProductsFormBrand,
  setInfoForProductsFormVendor,
  setInfoForProductsFormSOUM,
  setInfoForProductsFormUnits,
  setInfoForProductsFormCaseWeight,
  setInfoForProductsFormManufactureName,
  setInfoForProductsFormProductPrice,
  setInfoForProductsFormLoading,
  setInfoForProductsFormReset,
} from '../store/actions/InfoForProductsFormActions'
import LoadingButton from '../components/LoadingButton'
import { gql, useMutation } from '@apollo/client'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import { useTranslation } from '../context/Localization'
import PhoneNumberInput from '../components/PhoneNumberInput'
import TextInput from '../components/TextInput'
import { formRequiredFieldValidator } from '../helpers/formRequiredFieldValidator'
import { languages } from '../context/Localization/languages'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  title: {
    marginTop: 0,
  },
  textField: {
    marginVertical: 0,
    marginTop: 5,
  },
  submitButton: {
    width: 40,
    minWidth: 55,
    minHeight: 10,
  },
  submitButtonText: {
    marginHorizontal: 0,
    fontSize: 13,
    paddingHorizontal: 0,
    height: 25,
  },
  submitButtonContent: {
    height: 30,
  },
  formFieldTitle: {
    paddingVertical: 5,
    fontSize: 17,
    marginHorizontal: 10,
  },
  scroll: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollContentContainer: {
    paddingTop: 0,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
})

function InfoForProductsForm(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

  let addInfoForProductsFormsMutation = gql`
    mutation add_info_for_products_forms(
      $value_code_id: String
      $name: String
      $product_category: String
      $uom: String
      $length: String
      $width: String
      $height: String
      $brand: String
      $vendor: String
      $soum: String
      $units: String
      $case_weight: String
      $manufacture_name: String
      $product_price: String
    ) {
      add_info_for_products_forms(
        value_code_id: $value_code_id
        name: $name
        product_category: $product_category
        uom: $uom
        length: $length
        width: $width
        height: $height
        brand: $brand
        vendor: $vendor
        soum: $soum
        units: $units
        case_weight: $case_weight
        manufacture_name: $manufacture_name
        product_price: $product_price
      ) {
        success
        error
        result
      }
    }
  `

  const [
    addInfoForProductsForms,
    {
      loading: addInfoForProductsFormsMutationLoading,
      error: addInfoForProductsFormsMutationError,
      data: addInfoForProductsFormsMutationResult,
    },
  ] = useMutation(addInfoForProductsFormsMutation)

  useEffect(() => {
    if (addInfoForProductsFormsMutationError) {
      addInfoForProductsFormsMutationError.graphQLErrors.map(
        ({ message }, i) => {
          props.setInfoForProductsFormLoading(false)
          alertWithType('error', '', translation(message))
        }
      )
    }
  }, [addInfoForProductsFormsMutationError])

  useEffect(() => {
    if (
      addInfoForProductsFormsMutationResult &&
      addInfoForProductsFormsMutationResult.add_info_for_products_forms
    ) {
      if (
        addInfoForProductsFormsMutationResult.add_info_for_products_forms
          .success
      ) {
        alert("Saved");
        props.setInfoForProductsFormReset()
      }
    }
  }, [addInfoForProductsFormsMutationResult])

  const onSubmitPress = async () => {

    const infoForProductsFormValueCodeIdError = formRequiredFieldValidator(
      props.infoForProductsFormValueCodeId.value
    )
    const infoForProductsFormNameError = formRequiredFieldValidator(
      props.infoForProductsFormName.value
    )
    const infoForProductsFormProductCategoryError = formRequiredFieldValidator(
      props.infoForProductsFormProductCategory.value
    )
    const infoForProductsFormUOMError = formRequiredFieldValidator(
      props.infoForProductsFormUOM.value
    )
    const infoForProductsFormLengthError = formRequiredFieldValidator(
      props.infoForProductsFormLength.value
    )
    const infoForProductsFormWidthError = formRequiredFieldValidator(
      props.infoForProductsFormWidth.value
    )
    const infoForProductsFormHeightError = formRequiredFieldValidator(
      props.infoForProductsFormHeight.value
    )
    const infoForProductsFormBrandError = formRequiredFieldValidator(
      props.infoForProductsFormBrand.value
    )

    const infoForProductsFormVendorError = formRequiredFieldValidator(
      props.infoForProductsFormVendor.value
    )
    const infoForProductsFormSOUMError = formRequiredFieldValidator(
      props.infoForProductsFormSOUM.value
    )
    const infoForProductsFormUnitsError = formRequiredFieldValidator(
      props.infoForProductsFormUnits.value
    )
    const infoForProductsFormCaseWeightError = formRequiredFieldValidator(
      props.infoForProductsFormCaseWeight.value
    )
    const infoForProductsFormManufactureNameError = formRequiredFieldValidator(
      props.infoForProductsFormManufactureName.value
    )
    const infoForProductsFormProductPriceError = formRequiredFieldValidator(
      props.infoForProductsFormProductPrice.value
    )
    
    if (
      infoForProductsFormValueCodeIdError ||
      infoForProductsFormNameError ||
      infoForProductsFormProductCategoryError ||
      infoForProductsFormUOMError ||
      infoForProductsFormLengthError ||
      infoForProductsFormWidthError ||
      infoForProductsFormHeightError ||
      infoForProductsFormBrandError ||
      infoForProductsFormVendorError ||
      infoForProductsFormSOUMError ||
      infoForProductsFormUnitsError ||
      infoForProductsFormCaseWeightError ||
      infoForProductsFormManufactureNameError ||
      infoForProductsFormProductPriceError
    ) {
      props.setInfoForProductsFormValueCodeId({
        value: props.infoForProductsFormValueCodeId.value,
        error: infoForProductsFormValueCodeIdError,
      })
      props.setInfoForProductsFormName({
        value: props.infoForProductsFormName.value,
        error: infoForProductsFormNameError,
      })
      props.setInfoForProductsFormProductCategory({
        value: props.infoForProductsFormProductCategory.value,
        error: infoForProductsFormProductCategoryError,
      })
      props.setInfoForProductsFormUOM({
        value: props.infoForProductsFormUOM.value,
        error: infoForProductsFormUOMError,
      })

      props.setInfoForProductsFormLength({
        value: props.infoForProductsFormLength.value,
        error: infoForProductsFormLengthError,
      })
    
      props.setInfoForProductsFormWidth({
        value: props.infoForProductsFormWidth.value,
        error: infoForProductsFormWidthError,
      })
      props.setInfoForProductsFormHeight({
        value: props.infoForProductsFormHeight.value,
        error: infoForProductsFormHeightError,
      })
      props.setInfoForProductsFormBrand({
        value: props.infoForProductsFormBrand.value,
        error: infoForProductsFormBrandError,
      })
      props.setInfoForProductsFormVendor({
        value: props.infoForProductsFormVendor.value,
        error: infoForProductsFormVendorError,
      })
     
      props.setInfoForProductsFormSOUM({
        value: props.infoForProductsFormSOUM.value,
        error: infoForProductsFormSOUMError,
      })
      props.setInfoForProductsFormUnits({
        value: props.infoForProductsFormUnits.value,
        error: infoForProductsFormUnitsError,
      })

      props.setInfoForProductsFormCaseWeight({
        value: props.infoForProductsFormCaseWeight.value,
        error: infoForProductsFormCaseWeightError,
      })
      props.setInfoForProductsFormManufactureName({
        value: props.infoForProductsFormManufactureName.value,
        error: infoForProductsFormManufactureNameError,
      })
      props.setInfoForProductsFormProductPrice({
        value: props.infoForProductsFormProductPrice.value,
        error: infoForProductsFormProductPriceError,
      })
      return
    }
  
    try {
      props.setInfoForProductsFormLoading(true)
      await addInfoForProductsForms({
        variables: {
          value_code_id: props.infoForProductsFormValueCodeId.value,
          name: props.infoForProductsFormName.value,
          product_category: props.infoForProductsFormProductCategory.value,
          uom: props.infoForProductsFormUOM.value,
          length: props.infoForProductsFormLength.value,
          width: props.infoForProductsFormWidth.value,
          height: props.infoForProductsFormHeight.value,
          brand: props.infoForProductsFormBrand.value,
          vendor: props.infoForProductsFormVendor.value,
          soum: props.infoForProductsFormSOUM.value,
          units: props.infoForProductsFormUnits.value,
          case_weight: props.infoForProductsFormCaseWeight.value,
          manufacture_name: props.infoForProductsFormManufactureName.value,
          product_price: props.infoForProductsFormProductPrice.value,
        },
      })
    } catch (ex) {
      props.setInfoForProductsFormLoading(false)
     alertWithType('error', '', ex.toString())
    }
  }

  return (
    <View style={styles.mainContainer}>
      <BackButtonWithTitleAndComponent
        goBack={() => {
          props.setInfoForProductsFormReset()
          props.navigation.goBack()
        }}
        title={translation('Info For Products Form')}
      >
        <LoadingButton
          contentStyle={styles.submitButtonContent}
          textStyle={styles.submitButtonText}
          disabled={props.infoForProductsFormLoading}
          loading={props.infoForProductsFormLoading}
          mode="contained"
          onPress={() => {
            onSubmitPress()
          }}
          style={styles.submitButton}
        >
          {!props.infoForProductsFormLoading && translation('Save')}
        </LoadingButton>
      </BackButtonWithTitleAndComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scroll}
      >
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Value (Code ID)')}
          returnKeyType="next"
          value={props.infoForProductsFormValueCodeId.value}
          error={!!props.infoForProductsFormValueCodeId.error}
          errorText={translation(props.infoForProductsFormValueCodeId.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormValueCodeId({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Name')}
          returnKeyType="next"
          value={props.infoForProductsFormName.value}
          error={!!props.infoForProductsFormName.error}
          errorText={translation(props.infoForProductsFormName.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormName({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Product Category')}
          returnKeyType="next"
          value={props.infoForProductsFormProductCategory.value}
          error={!!props.infoForProductsFormProductCategory.error}
          errorText={translation(
            props.infoForProductsFormProductCategory.error
          )}
          onChangeText={(text) =>
            props.setInfoForProductsFormProductCategory({
              value: text,
              error: '',
            })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('UOM')}
          returnKeyType="next"
          value={props.infoForProductsFormUOM.value}
          error={!!props.infoForProductsFormUOM.error}
          errorText={translation(props.infoForProductsFormUOM.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormUOM({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Length')}
          returnKeyType="next"
          value={props.infoForProductsFormLength.value}
          error={!!props.infoForProductsFormLength.error}
          errorText={translation(props.infoForProductsFormLength.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormLength({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Width')}
          returnKeyType="next"
          value={props.infoForProductsFormWidth.value}
          error={!!props.infoForProductsFormWidth.error}
          errorText={translation(props.infoForProductsFormWidth.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormWidth({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Height')}
          returnKeyType="next"
          value={props.infoForProductsFormHeight.value}
          error={!!props.infoForProductsFormHeight.error}
          errorText={translation(props.infoForProductsFormHeight.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormHeight({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Brand')}
          returnKeyType="next"
          value={props.infoForProductsFormBrand.value}
          error={!!props.infoForProductsFormBrand.error}
          errorText={translation(props.infoForProductsFormBrand.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormBrand({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Vendor')}
          returnKeyType="next"
          value={props.infoForProductsFormVendor.value}
          error={!!props.infoForProductsFormVendor.error}
          errorText={translation(props.infoForProductsFormVendor.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormVendor({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('SUOM')}
          returnKeyType="next"
          value={props.infoForProductsFormSOUM.value}
          error={!!props.infoForProductsFormSOUM.error}
          errorText={translation(props.infoForProductsFormSOUM.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormSOUM({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Units')}
          returnKeyType="next"
          value={props.infoForProductsFormUnits.value}
          error={!!props.infoForProductsFormUnits.error}
          errorText={translation(props.infoForProductsFormUnits.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormUnits({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Case Weight')}
          returnKeyType="next"
          value={props.infoForProductsFormCaseWeight.value}
          error={!!props.infoForProductsFormCaseWeight.error}
          errorText={translation(props.infoForProductsFormCaseWeight.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormCaseWeight({ value: text, error: '' })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Manufacturer Name')}
          returnKeyType="next"
          value={props.infoForProductsFormManufactureName.value}
          error={!!props.infoForProductsFormManufactureName.error}
          errorText={translation(
            props.infoForProductsFormManufactureName.error
          )}
          onChangeText={(text) =>
            props.setInfoForProductsFormManufactureName({
              value: text,
              error: '',
            })
          }
        />
        <TextInput
          disabled={props.infoForProductsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Product Price')}
          returnKeyType="next"
          value={props.infoForProductsFormProductPrice.value}
          error={!!props.infoForProductsFormProductPrice.error}
          errorText={translation(props.infoForProductsFormProductPrice.error)}
          onChangeText={(text) =>
            props.setInfoForProductsFormProductPrice({ value: text, error: '' })
          }
        />
      </ScrollView>
    </View>
  )
}
const mapStateToProps = (state) => {
  return { ...state.InfoForProductsFormReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setInfoForProductsFormValueCodeId,
  setInfoForProductsFormName,
  setInfoForProductsFormProductCategory,
  setInfoForProductsFormUOM,
  setInfoForProductsFormLength,
  setInfoForProductsFormWidth,
  setInfoForProductsFormHeight,
  setInfoForProductsFormBrand,
  setInfoForProductsFormVendor,
  setInfoForProductsFormSOUM,
  setInfoForProductsFormUnits,
  setInfoForProductsFormCaseWeight,
  setInfoForProductsFormManufactureName,
  setInfoForProductsFormProductPrice,
  setInfoForProductsFormLoading,
  setInfoForProductsFormReset,
})(InfoForProductsForm)
