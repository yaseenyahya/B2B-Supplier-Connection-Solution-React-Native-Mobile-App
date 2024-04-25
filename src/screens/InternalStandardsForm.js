import React, { useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { RadioButton, Divider, TextInput as Input } from 'react-native-paper'
import Background from '../components/Background'
import BackButtonWithTitleAndComponent from '../components/BackButtonWithTitleAndComponent'
import { connect } from 'react-redux'
import {
  setInternalStandardsFormManufacturerName,
  setInternalStandardsFormUsername,
  setInternalStandardsFormBuyerId,
  setInternalStandardsFormManufacturerCountry,
  setInternalStandardsFormPortOfLoading,
  setInternalStandardsFormPaymentTerms,
  setInternalStandardsFormShipmentTerms,
  setInternalStandardsFormModeOfShipment,
  setInternalStandardsFormLoading,
  setInternalStandardsFormReset,

} from '../store/actions/InternalStandardsFormActions'
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

function InternalStandardsForm(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

  let addInternalStandardsFormsMutation = gql`
  mutation add_internal_standards_forms(
    $manufacturer_name: String
      $username: String
      $buyer_id: String
      $manufacturer_country: String
      $port_of_loading: String
      $payment_terms: String
      $shipment_terms: String
      $mode_of_shipment: String
  ) {
    add_internal_standards_forms(
      manufacturer_name: $manufacturer_name
      username: $username
      buyer_id: $buyer_id
      manufacturer_country: $manufacturer_country
      port_of_loading: $port_of_loading
      payment_terms: $payment_terms
      shipment_terms: $shipment_terms
      mode_of_shipment: $mode_of_shipment
    ) {
      success
      error
      result
    }
  }
`

const [
  addInternalStandardsForms,
  {
    loading: addInternalStandardsFormsMutationLoading,
    error: addInternalStandardsFormsMutationError,
    data: addInternalStandardsFormsMutationResult,
  },
] = useMutation(addInternalStandardsFormsMutation)

useEffect(() => {
  if (addInternalStandardsFormsMutationError) {
    addInternalStandardsFormsMutationError.graphQLErrors.map(
      ({ message }, i) => {
        props.setInternalStandardsFormLoading(false)
        alertWithType('error', '', translation(message))
      }
    )
  }
}, [addInternalStandardsFormsMutationError])

useEffect(() => {
  if (
    addInternalStandardsFormsMutationResult &&
    addInternalStandardsFormsMutationResult.add_internal_standards_forms
  ) {
    if (
      addInternalStandardsFormsMutationResult.add_internal_standards_forms
        .success
    ) {
      alert("Saved");
      props.setInternalStandardsFormReset()
    }
  }
}, [addInternalStandardsFormsMutationResult])

  const onSubmitPress = async () => {
    const internalStandardsFormManufacturerNameError = formRequiredFieldValidator(
      props.internalStandardsFormManufacturerName.value
    );
  
    const internalStandardsFormUsernameError = formRequiredFieldValidator(
      props.internalStandardsFormUsername.value
    );
 
    const internalStandardsFormBuyerIdError = formRequiredFieldValidator(
      props.internalStandardsFormBuyerId.value
    );
    
    const internalStandardsFormManufacturerCountryError = formRequiredFieldValidator(
      props.internalStandardsFormManufacturerCountry.value
    );

    const internalStandardsFormPortOfLoadingError = formRequiredFieldValidator(
      props.internalStandardsFormPortOfLoading.value
    );
    const internalStandardsFormPaymentTermsError = formRequiredFieldValidator(
      props.internalStandardsFormPaymentTerms.value
    );
    const internalStandardsFormShipmentTermsError = formRequiredFieldValidator(
      props.internalStandardsFormShipmentTerms.value
    );
    const internalStandardsFormModeOfShipmentError = formRequiredFieldValidator(
      props.internalStandardsFormModeOfShipment.value
    );

    if (
      internalStandardsFormManufacturerNameError ||
      internalStandardsFormUsernameError ||
      internalStandardsFormBuyerIdError ||
      internalStandardsFormManufacturerCountryError ||
      internalStandardsFormPortOfLoadingError ||
      internalStandardsFormPaymentTermsError ||
      internalStandardsFormShipmentTermsError ||
      internalStandardsFormModeOfShipmentError 
    ) {
      props.setInternalStandardsFormManufacturerName({
        value: props.internalStandardsFormManufacturerName.value,
        error: internalStandardsFormManufacturerNameError,
      })
    
      props.setInternalStandardsFormUsername({
        value: props.internalStandardsFormUsername.value,
        error: internalStandardsFormUsernameError,
      })
      props.setInternalStandardsFormBuyerId({
        value: props.internalStandardsFormBuyerId.value,
        error: internalStandardsFormBuyerIdError,
      })

      props.setInternalStandardsFormManufacturerCountry({
        value: props.internalStandardsFormManufacturerCountry.value,
        error: internalStandardsFormManufacturerCountryError,
      })
      props.setInternalStandardsFormPortOfLoading({
        value: props.internalStandardsFormPortOfLoading.value,
        error: internalStandardsFormPortOfLoadingError,
      })
      props.setInternalStandardsFormPaymentTerms({
        value: props.internalStandardsFormPaymentTerms.value,
        error: internalStandardsFormPaymentTermsError,
      })

      props.setInternalStandardsFormShipmentTerms({
        value: props.internalStandardsFormShipmentTerms.value,
        error: internalStandardsFormShipmentTermsError,
      })
      props.setInternalStandardsFormModeOfShipment({
        value: props.internalStandardsFormModeOfShipment.value,
        error: internalStandardsFormModeOfShipmentError,
      })
      return
    }
    try {
      props.setInternalStandardsFormLoading(true)
      await addInternalStandardsForms({
        variables: {
          manufacturer_name: props.internalStandardsFormManufacturerName.value,
      username: props.internalStandardsFormUsername.value,
      buyer_id: props.internalStandardsFormBuyerId.value,
      manufacturer_country:  props.internalStandardsFormManufacturerCountry.value,
      port_of_loading:props.internalStandardsFormPortOfLoading.value,
      payment_terms: props.internalStandardsFormPaymentTerms.value,
      shipment_terms: props.internalStandardsFormShipmentTerms.value,
      mode_of_shipment: props.internalStandardsFormModeOfShipment.value,
        },
      })
    } catch (ex) {
      props.setInternalStandardsFormLoading(false)
     alertWithType('error', '', ex.toString())
    }
    }

  
  return (
    <View style={styles.mainContainer}>
      <BackButtonWithTitleAndComponent
        goBack={() => {
          props.setInternalStandardsFormReset();
          props.navigation.goBack()
  
        }}
        title={translation('Internal Standards Form')}
      >
        <LoadingButton
          contentStyle={styles.submitButtonContent}
          textStyle={styles.submitButtonText}
          disabled={props.internalStandardsFormLoading}
          loading={props.internalStandardsFormLoading}
          mode="contained"
          onPress={() => {
            onSubmitPress()
          }}
          style={styles.submitButton}
        >
          {!props.internalStandardsFormLoading && translation('Save')}
        </LoadingButton>
      </BackButtonWithTitleAndComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scroll}
      >
         <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Manufacturer Name')}
          returnKeyType="next"
          value={props.internalStandardsFormManufacturerName.value}
          error={!!props.internalStandardsFormManufacturerName.error}
          errorText={translation(props.internalStandardsFormManufacturerName.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormManufacturerName({ value: text, error: '' })
          }
          
        />
           <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('User Name')}
          returnKeyType="next"
          value={props.internalStandardsFormUsername.value}
          error={!!props.internalStandardsFormUsername.error}
          errorText={translation(props.internalStandardsFormUsername.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormUsername({ value: text, error: '' })
          }
        
          
        />
           <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Buyer ID')}
          returnKeyType="next"
          value={props.internalStandardsFormBuyerId.value}
          error={!!props.internalStandardsFormBuyerId.error}
          errorText={translation(props.internalStandardsFormBuyerId.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormBuyerId({ value: text, error: '' })
          }
          
        />
           <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Manufacturer Country')}
          returnKeyType="next"
          value={props.internalStandardsFormManufacturerCountry.value}
          error={!!props.internalStandardsFormManufacturerCountry.error}
          errorText={translation(props.internalStandardsFormManufacturerCountry.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormManufacturerCountry({ value: text, error: '' })
          }
        
          
        />
           <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Port of Loading')}
          returnKeyType="next"
          value={props.internalStandardsFormPortOfLoading.value}
          error={!!props.internalStandardsFormPortOfLoading.error}
          errorText={translation(props.internalStandardsFormPortOfLoading.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormPortOfLoading({ value: text, error: '' })
          }
          
        />
           <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Payment terms')}
          returnKeyType="next"
          value={props.internalStandardsFormPaymentTerms.value}
          error={!!props.internalStandardsFormPaymentTerms.error}
          errorText={translation(props.internalStandardsFormPaymentTerms.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormPaymentTerms({ value: text, error: '' })
          }
          
        />
         <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Shipment Terms')}
          returnKeyType="next"
          value={props.internalStandardsFormShipmentTerms.value}
          error={!!props.internalStandardsFormShipmentTerms.error}
          errorText={translation(props.internalStandardsFormShipmentTerms.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormShipmentTerms({ value: text, error: '' })
          }
          
        />
         <TextInput
          disabled={props.internalStandardsFormLoading}
          containerStyle={styles.textField}
          placeholder={translation('Mode of Shipment')}
          returnKeyType="next"
          value={props.internalStandardsFormModeOfShipment.value}
          error={!!props.internalStandardsFormModeOfShipment.error}
          errorText={translation(props.internalStandardsFormModeOfShipment.error)}
          onChangeText={(text) =>
            props.setInternalStandardsFormModeOfShipment({ value: text, error: '' })
          }
          
        />
      </ScrollView>
    </View>
  )
}
const mapStateToProps = (state) => {
  return { ...state.InternalStandardsFormReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setInternalStandardsFormManufacturerName,
  setInternalStandardsFormUsername,
  setInternalStandardsFormBuyerId,
  setInternalStandardsFormManufacturerCountry,
  setInternalStandardsFormPortOfLoading,
  setInternalStandardsFormPaymentTerms,
  setInternalStandardsFormShipmentTerms,
  setInternalStandardsFormModeOfShipment,
  setInternalStandardsFormLoading,
  setInternalStandardsFormReset,
})(InternalStandardsForm)
