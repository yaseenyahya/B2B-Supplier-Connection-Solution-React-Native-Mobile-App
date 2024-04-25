import React, { useEffect } from 'react'
import Background from '../components/Background'
import BackButtonWithLanguageMenu from '../components/BackButtonWithLanguageMenu'
import HideOnKeyboardShow from '../components/HideOnKeyboardShow'
import Logo from '../components/Logo'
import Header from '../components/Header'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { contactNoValidator } from '../helpers/contactNoValidator'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import {
  setResetPasswordContactNo,
  setResetPasswordLoading,
} from '../store/actions/ResetPasswordActions'
import LoadingButton from '../components/LoadingButton'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import auth from '@react-native-firebase/auth'
import { gql, useMutation } from '@apollo/client'
import { useTranslation } from '../context/Localization'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from '../context/Localization/helpers'
import { languages } from '../context/Localization/languages'
const styles = StyleSheet.create({
  submitButton: {
    marginTop: 16,
  },
})

function ResetPasswordScreen(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()
  const selectedLanguageLocale = languages[getLanguageCodeFromLS()]

  let checkContactNoUserExistMutation = gql`
    mutation check_contact_no_user_exist($contact_no: String!) {
      check_contact_no_user_exist(contact_no: $contact_no) {
        success
        error
        result
      }
    }
  `

  const [
    checkContactNoUserExist,
    {
      loading: checkContactNoUserExistMutationLoading,
      error: checkContactNoUserExistMutationError,
      data: checkContactNoUserExistMutationResult,
    },
  ] = useMutation(checkContactNoUserExistMutation)

  useEffect(() => {
    if (checkContactNoUserExistMutationError) {
      checkContactNoUserExistMutationError.graphQLErrors.map(
        ({ message }, i) => {
          props.setResetPasswordLoading(false)
          alertWithType('error', '', translation(message))
        }
      )
    }
  }, [checkContactNoUserExistMutationError])

  useEffect(() => {
    if (
      checkContactNoUserExistMutationResult &&
      checkContactNoUserExistMutationResult.check_contact_no_user_exist
    ) {
      if (
        Boolean(
          checkContactNoUserExistMutationResult.check_contact_no_user_exist
            .result
        )
      ) {
        auth()
          .verifyPhoneNumber(
            (
              props.resetPasswordContactNo.calling_code +
              props.resetPasswordContactNo.value
            ).replace(/\s/g, ''),
            true
          )
          .on('state_changed', (phoneAuthSnapshot) => {
            switch (phoneAuthSnapshot.state) {
              case auth.PhoneAuthState.CODE_SENT:
                props.navigation.navigate('MobileConfirmationScreen', {
                  phoneAuthSnapshot: phoneAuthSnapshot,
                  onAuthStateChanged: () => {
                    props.navigation.replace('ChangePasswordScreen')
                  },
                  phoneNumber: (
                    props.resetPasswordContactNo.calling_code +
                    props.resetPasswordContactNo.value
                  ).replace(/\s/g, ''),
                })
                props.setResetPasswordLoading(false)
                break
              case auth.PhoneAuthState.ERROR:
                if (
                  phoneAuthSnapshot.error.code == 'auth/network-request-failed'
                ) {
                  alertWithType(
                    'error',
                    '',
                    translation('Network request failed.')
                  )
                } else {
                  alert(phoneAuthSnapshot.error)
                }
                props.setResetPasswordLoading(false)
                break
            }
          })
      } else {
        props.setResetPasswordLoading(false)
        alertWithType(
          'error',
          '',
          translation('Contact no. not registered to any account.')
        )
      }
    }
  }, [checkContactNoUserExistMutationResult])

  const sendResetMobileCode = async () => {
    const contactNoError = contactNoValidator(
      props.resetPasswordContactNo.value
    )

    if (contactNoError) {
      props.setResetPasswordContactNo({
        value: props.resetPasswordContactNo.value,
        error: contactNoError,
        country_code: props.resetPasswordContactNo.countryCode,
        calling_code: props.resetPasswordContactNo.callingCode,
      })
      return
    }
    try {
      props.setResetPasswordLoading(true)
      await checkContactNoUserExist({
        variables: {
          contact_no: (
            props.resetPasswordContactNo.calling_code +
            props.resetPasswordContactNo.value
          ).replace(/\s/g, ''),
        },
      })
    } catch (ex) {
      props.setResetPasswordLoading(false)
      if (ex.networkError) alertWithType('error', '', translation(ex.toString()))
    }
  }

  return (
    <Background>
      <BackButtonWithLanguageMenu goBack={props.navigation.goBack} />
      <HideOnKeyboardShow>
        <Logo />
      </HideOnKeyboardShow>
      <Header>{translation('Restore Password')}</Header>
      <PhoneNumberInput
        placeholder={translation('Contact Number')}
        value={props.resetPasswordContactNo.value}
        initialCallingCode={selectedLanguageLocale.callingCode}
        initialCountryCode={selectedLanguageLocale.countryCode}
        error={!!props.resetPasswordContactNo.error}
        errorText={translation(props.resetPasswordContactNo.error)}
        onChangeText={(text, countryCode, callingCode) =>
          props.setResetPasswordContactNo({
            value: text,
            error: '',
            country_code: countryCode,
            calling_code: callingCode,
          })
        }
      />
      <LoadingButton
        disabled={props.resetPasswordLoading}
        loading={props.resetPasswordLoading}
        mode="contained"
        onPress={sendResetMobileCode}
        style={styles.submitButton}
      >
        {translation('Send Code')}
      </LoadingButton>
    </Background>
  )
}
const mapStateToProps = (state) => {
  return { ...state.ResetPasswordReducer }
}
export default connect(mapStateToProps, {
  setResetPasswordContactNo,
  setResetPasswordLoading,
})(ResetPasswordScreen)
