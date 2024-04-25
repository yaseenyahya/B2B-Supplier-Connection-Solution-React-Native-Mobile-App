import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text,Button } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import BackButtonWithLanguageMenu from '../components/BackButtonWithLanguageMenu'
import HideOnKeyboardShow from '../components/HideOnKeyboardShow'
import { theme } from '../core/theme'
import { contactNoValidator } from '../helpers/contactNoValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { companyNameValidator } from '../helpers/companyNameValidator'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { connect } from 'react-redux'
import {
  setRegisterContactNo,
  setRegisterLoading,
  setRegisterReset,
} from '../store/actions/RegisterActions'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import LoadingButton from '../components/LoadingButton'
import auth from '@react-native-firebase/auth'
import { gql, useMutation } from '@apollo/client'
import { useTranslation } from '../context/Localization'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from '../context/Localization/helpers'
import { languages } from '../context/Localization/languages'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  submitButton: {
    marginTop: 24,
  },
  loginButtonLabelStyle:{
    textTransform: 'none',
    paddingLeft: 2,
    paddingRight:2,
    height: 18,
    letterSpacing: 0,
    marginHorizontal: 0,
    marginVertical: 0,

  },
  loginButton:{

    minWidth:0
  }
})

export function RegisterScreen(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()
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
          props.setRegisterLoading(false)
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
        !JSON.parse(
          checkContactNoUserExistMutationResult.check_contact_no_user_exist
            .result
        )
      ) {
        auth()
          .verifyPhoneNumber(
            (
              props.registerContactNo.calling_code +
              props.registerContactNo.value
            ).replace(/\s/g, ''),
            true
          )
          .on('state_changed', (phoneAuthSnapshot) => {
            switch (phoneAuthSnapshot.state) {
              case auth.PhoneAuthState.CODE_SENT:
                props.navigation.navigate('MobileConfirmationScreen', {
                  onAuthStateChanged: () => {
                    props.navigation.replace('RegisterScreenFinal')
                  },
                  phoneAuthSnapshot: phoneAuthSnapshot,
                  phoneNumber: (
                    props.registerContactNo.calling_code +
                    props.registerContactNo.value
                  ).replace(/\s/g, ''),
                })
                props.setRegisterLoading(false)
                break
              case auth.PhoneAuthState.ERROR:
                if (
                  phoneAuthSnapshot.error.code == 'auth/network-request-failed'
                ) {
                  alertWithType('error', '', translation('Network request failed.'))
                } else {
                  alert(phoneAuthSnapshot.error)
                }
                props.setRegisterLoading(false)
                break
            }
          })
      } else {
        props.setRegisterLoading(false)
        alertWithType('error', '', translation('Contact no already registered.'))
      }
    }
  }, [checkContactNoUserExistMutationResult])

  const onSignUpPressed = async () => {
    const contactNoError = contactNoValidator(props.registerContactNo.value)

    if (contactNoError) {
      props.setRegisterContactNo({
        value: props.registerContactNo.value,
        error: contactNoError,
        country_code: props.registerContactNo.country_code,
        calling_code: props.registerContactNo.calling_code,
      })

      return
    }

    try {
      props.setRegisterLoading(true)
      await checkContactNoUserExist({
        variables: {
          contact_no: (
            props.registerContactNo.calling_code + props.registerContactNo.value
          ).replace(/\s/g, ''),
        },
      })
    } catch (ex) {
      props.setRegisterLoading(false)
      if (ex.networkError) alertWithType('error', '', translation(ex.toString()))
    }
  }

  return (
    <Background>
      <BackButtonWithLanguageMenu goBack={props.navigation.goBack} />
      <HideOnKeyboardShow>
        <Logo />
      </HideOnKeyboardShow>
      <Header>{translation('Create Account')}</Header>
      <PhoneNumberInput
        disabled={props.registerLoading}
        placeholder={translation('Contact Number')}
        value={props.registerContactNo.value}
        initialCallingCode={selectedLanguageLocale.callingCode}
        initialCountryCode={selectedLanguageLocale.countryCode}
        error={!!props.registerContactNo.error}
        errorText={translation(props.registerContactNo.error)}
        onChangeText={(text, countryCode, callingCode) =>
          props.setRegisterContactNo({
            value: text,
            error: '',
            country_code: countryCode,
            calling_code: callingCode,
          })
        }
      />
      <LoadingButton
        disabled={props.registerLoading}
        loading={props.registerLoading}
        mode="contained"
        onPress={onSignUpPressed}
        style={styles.submitButton}
      >
        {translation('Sign Up')}
      </LoadingButton>
      <View style={styles.row}>
        <Text>{translation('Already have an account?')} </Text>
         
        <Button
        style={styles.loginButton}
          labelStyle={styles.loginButtonLabelStyle}
          contentStyle={styles.loginButtonContentStyle}
          onPress={() => props.navigation.replace('LoginScreen')}
        >
          <Text style={styles.link}>{translation('Login')}</Text>
          </Button>
      </View>
    </Background>
  )
}
const mapStateToProps = (state) => {
  return { ...state.RegisterReducer }
}
export default connect(mapStateToProps, {
  setRegisterContactNo,
  setRegisterLoading,
  setRegisterReset,
})(RegisterScreen)
