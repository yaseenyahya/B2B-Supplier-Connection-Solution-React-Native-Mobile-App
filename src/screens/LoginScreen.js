import React, { useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import LoadingButton from '../components/LoadingButton'
import TextInput from '../components/TextInput'
import BackButtonWithLanguageMenu from '../components/BackButtonWithLanguageMenu'
import HideOnKeyboardShow from '../components/HideOnKeyboardShow'
import { theme } from '../core/theme'
import { passwordValidator } from '../helpers/passwordValidator'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { contactNoValidator } from '../helpers/contactNoValidator'
import { connect } from 'react-redux'
import {
  setLoginContactNo,
  setLoginPassword,
  setLoginLoading,
  setLoginReset,
} from '../store/actions/LoginActions'
import { RoleType } from '../helpers/RoleType'
import { gql, useMutation } from '@apollo/client'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import { setUserAuthData } from '../store/actions/UserAuthDataActions'
import { setLoginUserId } from '../auth/LocalStorage'
import { useTranslation } from '../context/Localization'
import {
  LS_KEY,
  fetchLocale,
  getLanguageCodeFromLS,
} from '../context/Localization/helpers'
import { languages } from '../context/Localization/languages'
const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  forgotPasswordButtonLabelStyle: {
    padding: 0,
    textTransform: 'none',
    paddingLeft: 5,
    paddingRight: 5,
    height: 17,
    letterSpacing: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  registerButtonLabelStyle: {
    textTransform: 'none',
    paddingLeft: 2,
    paddingRight: 2,
    height: 18,
    letterSpacing: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  registerButton: {
    minWidth: 0,
  },
})

function LoginScreen(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()
  const selectedLanguageLocale = languages[getLanguageCodeFromLS()]

  let loginMutation = gql`
    mutation login($contact_no: String!, $password: String!) {
      login(contact_no: $contact_no, password: $password) {
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
    login,
    {
      loading: loginMutationLoading,
      error: loginMutationError,
      data: loginMutationResult,
    },
  ] = useMutation(loginMutation)

  useEffect(() => {
    if (loginMutationError) {
      loginMutationError.graphQLErrors.map(({ message }, i) => {
        props.setLoginLoading(false)
        alertWithType('error', '', translation(message))
      })
    }
  }, [loginMutationError])

  useEffect(() => {
    if (loginMutationResult && loginMutationResult.login) {
      if (loginMutationResult.login.role == RoleType.Vendor) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'VendorScreen' }],
        })
        props.setUserAuthData(loginMutationResult.login)
        setLoginUserId(loginMutationResult.login.id)
        props.setLoginReset()
      }
    }
  }, [loginMutationResult])

  const onLoginPressed = async () => {
    const contactNoError = contactNoValidator(props.loginContactNo.value)
    const passwordError = passwordValidator(props.loginPassword.value)
    if (contactNoError || passwordError) {
      props.setLoginContactNo({
        value: props.loginContactNo.value,
        error: contactNoError,
        country_code: props.loginContactNo.country_code,
        calling_code: props.loginContactNo.calling_code,
      })
      props.setLoginPassword({
        value: props.loginPassword.value,
        error: passwordError,
      })
      return
    }
    props.setLoginLoading(true)
    try {
      await login({
        variables: {
          contact_no: (
            props.loginContactNo.calling_code + props.loginContactNo.value
          ).replace(/\s/g, ''),
          password: props.loginPassword.value,
        },
      })
    } catch (ex) {
      props.setLoginLoading(false)
      if (ex.networkError)
        alertWithType('error', '', translation(ex.toString()))
    }
  }

  return (
    <Background>
      <BackButtonWithLanguageMenu goBack={props.navigation.goBack} />
      <HideOnKeyboardShow>
        <Logo />
      </HideOnKeyboardShow>
      <Header>{translation('Welcome back.')}</Header>

      <PhoneNumberInput
        disabled={props.loginLoading}
        placeholder={translation('Contact Number')}
        value={props.loginContactNo.value}
        initialCallingCode={selectedLanguageLocale.callingCode}
        initialCountryCode={selectedLanguageLocale.countryCode}
        error={!!props.loginContactNo.error}
        errorText={translation(props.loginContactNo.error)}
        onChangeText={(text, countryCode, callingCode) =>
          props.setLoginContactNo({
            value: text,
            error: '',
            country_code: countryCode,
            calling_code: callingCode,
          })
        }
      />
      <TextInput
        autoCapitalize="none"
        disabled={props.loginLoading}
        placeholder={translation('Password')}
        returnKeyType="done"
        value={props.loginPassword.value}
        onChangeText={(text) =>
          props.setLoginPassword({ value: text, error: '' })
        }
        error={!!props.loginPassword.error}
        errorText={translation(props.loginPassword.error)}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <Button
          labelStyle={styles.forgotPasswordButtonLabelStyle}
          onPress={() => props.navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>
            {translation('Forgot your password?')}
          </Text>
        </Button>
      </View>
      <LoadingButton
        disabled={props.loginLoading}
        loading={props.loginLoading}
        mode="contained"
        onPress={onLoginPressed}
      >
        {translation('Login')}
      </LoadingButton>
      <View style={styles.row}>
        <Text>{translation('Don’t have an account?')} </Text>

        <Button
          style={styles.registerButton}
          labelStyle={styles.registerButtonLabelStyle}
          contentStyle={styles.registerButtonContentStyle}
          onPress={() => props.navigation.replace('RegisterScreen')}
        >
          <Text style={styles.link}>{translation('Sign up')}</Text>
        </Button>
      </View>
    </Background>
  )
}

const mapStateToProps = (state) => {
  return { ...state.LoginReducer }
}
export default connect(mapStateToProps, {
  setLoginContactNo,
  setLoginPassword,
  setLoginLoading,
  setLoginReset,
  setUserAuthData,
})(LoginScreen)
