import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Background from '../components/Background'
import BackButtonWithLanguageMenu from '../components/BackButtonWithLanguageMenu'
import HideOnKeyboardShow from '../components/HideOnKeyboardShow'
import Logo from '../components/Logo'
import Header from '../components/Header'
import { companyNameValidator } from '../helpers/companyNameValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'
import { connect } from 'react-redux'
import TextInput from '../components/TextInput'
import {
  setRegisterCompanyName,
  setRegisterPassword,
  setRegisterConfirmPassword,
  setRegisterLoading,
  setRegisterReset,
  setRegisterFinalScreenLoading,
} from '../store/actions/RegisterActions'
import LoadingButton from '../components/LoadingButton'
import { gql, useMutation } from '@apollo/client'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import { RoleType } from '../helpers/RoleType'
import { setUserAuthData } from '../store/actions/UserAuthDataActions'
import { setLoginUserId } from '../auth/LocalStorage'
import { useTranslation } from '../context/Localization'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
  },
})

function RegisterScreenFinal(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()
  let registerMutation = gql`
    mutation register(
      $company_name: String!
      $country_code: String!
      $contact_no: String!
      $contact_no_verified: Boolean!
      $email_verified: Boolean!
      $role: RoleType!
      $password: String!
    ) {
      register(
        company_name: $company_name
        country_code: $country_code
        contact_no: $contact_no
        contact_no_verified: $contact_no_verified
        email_verified: $email_verified
        role: $role
        password: $password
      ) {
        id
        avatar
        company_name
        country_code
        contact_no
        contact_no_verified
        email
        email_verified
        role
        password
        category_a_id
      }
    }
  `

  const [
    register,
    {
      loading: registerMutationLoading,
      error: registerMutationError,
      data: registerMutationResult,
    },
  ] = useMutation(registerMutation)

  useEffect(() => {
    if (registerMutationError) {
      registerMutationError.graphQLErrors.map(({ message }, i) => {
        alertWithType('error', '', translation(message))
      })
    }
  }, [registerMutationError])

  useEffect(() => {
    if (registerMutationResult && registerMutationResult.register) {
      if (registerMutationResult.register.role == RoleType.Vendor) {
        props.setUserAuthData(registerMutationResult.register)
        setLoginUserId(registerMutationResult.register.id)
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'VendorScreen' }],
        })

        props.setRegisterReset()
      }
    }
  }, [registerMutationResult])

  const onFinalSignUpPressed = async () => {
    const companyNameError = companyNameValidator(
      props.registerCompanyName.value
    )

    const passwordError = passwordValidator(props.registerPassword.value)
    const confirmPasswordError = confirmPasswordValidator(
      props.registerPassword.value,
      props.registerConfirmPassword.value
    )
    if (companyNameError || confirmPasswordError || passwordError) {
      props.setRegisterCompanyName({
        value: props.registerCompanyName.value,
        error: companyNameError,
      })
      props.setRegisterPassword({
        value: props.registerPassword.value,
        error: passwordError,
      })
      props.setRegisterConfirmPassword({
        value: props.registerConfirmPassword.value,
        error: confirmPasswordError,
      })
      return
    }
    props.setRegisterFinalScreenLoading(true)
    try {
      await register({
        variables: {
          company_name: props.registerCompanyName.value,
          country_code: props.registerContactNo.country_code,
          contact_no: (
            props.registerContactNo.calling_code + props.registerContactNo.value
          ).replace(/\s/g, ''),
          contact_no_verified: true,
          email_verified: false,
          role: RoleType.Vendor,
          password: props.registerPassword.value,
        },
      })
    } catch (ex) {
      props.setRegisterFinalScreenLoading(false)
      if (ex.networkError) alertWithType('error', '', translation(ex.toString()))
    }
  }

  return (
    <Background>
      <BackButtonWithLanguageMenu goBack={props.navigation.goBack} />
      <HideOnKeyboardShow>
        <Logo />
      </HideOnKeyboardShow>
      <Header>{translation('Complete Registration')}</Header>
      <TextInput
        disabled={props.registerFinalScreenLoading}
        placeholder={translation('Company Name')}
        returnKeyType="next"
        value={props.registerCompanyName.value}
        onChangeText={(text) =>
          props.setRegisterCompanyName({ value: text, error: '' })
        }
        error={!!props.registerCompanyName.error}
        errorText={props.registerCompanyName.error}
      />
      <TextInput
        autoCapitalize="none"
        disabled={props.registerFinalScreenLoading}
        placeholder={translation('Password')}
        returnKeyType="next"
        value={props.registerPassword.value}
        onChangeText={(text) =>
          props.setRegisterPassword({ value: text, error: '' })
        }
        error={!!props.registerPassword.error}
        errorText={translation(props.registerPassword.error)}
        secureTextEntry
      />
      <TextInput
        autoCapitalize="none"
        disabled={props.registerFinalScreenLoading}
        placeholder={translation('Confirm Password')}
        returnKeyType="done"
        value={props.registerConfirmPassword.value}
        onChangeText={(text) =>
          props.setRegisterConfirmPassword({ value: text, error: '' })
        }
        error={!!props.registerConfirmPassword.error}
        errorText={translation(props.registerConfirmPassword.error)}
        secureTextEntry
      />
      <LoadingButton
        disabled={props.registerFinalScreenLoading}
        loading={props.registerFinalScreenLoading}
        mode="contained"
        onPress={onFinalSignUpPressed}
        style={styles.submitButton}
      >
        {translation('Sign Up')}
      </LoadingButton>
    </Background>
  )
}
const mapStateToProps = (state) => {
  return { ...state.RegisterReducer }
}
export default connect(mapStateToProps, {
  setRegisterCompanyName,
  setRegisterPassword,
  setRegisterConfirmPassword,
  setRegisterLoading,
  setRegisterReset,
  setUserAuthData,
  setRegisterFinalScreenLoading,
})(RegisterScreenFinal)
