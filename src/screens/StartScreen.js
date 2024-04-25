import React, { useEffect, useLayoutEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Divider } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { setLoginInitLoginLoaded } from '../store/actions/LoginActions'
import { setUserAuthData } from '../store/actions/UserAuthDataActions'
import SpinnerOverlay from '../components/SpinnerOverlay'
import { gql, useMutation } from '@apollo/client'
import { getLoginUserId, removeLoginUserId } from '../auth/LocalStorage'
import { connect } from 'react-redux'
import { RoleType } from '../helpers/RoleType'
import { useDropdownAlert } from '../context/AlertDropdownContextProvider'
import BackButtonWithLanguageMenu from '../components/BackButtonWithLanguageMenu'
import { useTranslation } from '../context/Localization'

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slugan: {
    fontSize: 15,
    width: '100%',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: -15,
    fontFamily: 'Roboto'
  },
  discriptionFirstLine: {
    fontSize: 19,
    width: '100%',
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'Roboto',
    color:"black"
  },
  discriptionSecondLine: {
    fontSize: 15,
    width: '100%',
    textAlign: 'center',
    fontWeight: '300',
    fontFamily: 'Roboto',
    color:"black"
  },
})

export function StartScreen(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

  let meMutation = gql`
    mutation me($id: ID!) {
      me(id: $id) {
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
    me,
    {
      loading: meMutationLoading,
      error: meMutationError,
      data: meMutationResult,
    },
  ] = useMutation(meMutation)

  useEffect(() => {
    if (meMutationError) {
      meMutationError.graphQLErrors.map(({ message }, i) => {
        alertWithType('error', '', message)
        props.setLoginInitLoginLoaded(true)
      })
    }
  }, [meMutationError])

  useEffect(() => {
    ;(async () => {
      if (meMutationResult) {
        if (meMutationResult.me) {
          if (meMutationResult.me.role == RoleType.Vendor) {
            props.setUserAuthData(meMutationResult.me)

            props.navigation.reset({
              index: 0,
              routes: [{ name: 'VendorScreen' }],
            })
            props.setLoginInitLoginLoaded(true)
          }
          props.setUserAuthData(meMutationResult.me)
        } else {
          await removeLoginUserId()
          props.setLoginInitLoginLoaded(true)
        }
      }
    })()
  }, [meMutationResult])

  const getUserByUserId = async (userId) => {
    try {

      await me({
        variables: {
          id: userId,
        },
      })
    } catch (ex) {
      if (ex.networkError) {
        alertWithType('error', '', ex.toString())
        setTimeout(() => {
          getUserByUserId(userId)
        }, 1000)
      }
    }
  }
  useEffect(() => {
    if (!props.loginInitialLoginLoaded) {
      const userId = getLoginUserId()
      if (userId != null) {
        getUserByUserId(userId)
      } else {
        props.setLoginInitLoginLoaded(true)
      }
    }
  }, [props.loginInitialLoginLoaded])

  return (
    <View style={styles.container}>
      <SpinnerOverlay
        visible={!props.loginInitialLoginLoaded}
        textContent={translation('Loading...')}
        textStyle={styles.spinnerTextStyle}
      />
      <Background>
        <BackButtonWithLanguageMenu showBackButton={false} />
        <Logo />
        <Text style={styles.slugan}>
          {translation('B2B INDUSTRIAL & COMMERCIAL PORTAL')}
        </Text>
        <Paragraph style={styles.text}>
          <Text style={styles.discriptionFirstLine}>
            {translation('ONE WINDOW B2B E.COMMERCE')}
          </Text>
          <Divider/>
          <Text style={styles.discriptionSecondLine}>
            {translation('CONNECTING REGIONAL SUPPLIERS')}
          </Text>
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => props.navigation.navigate('LoginScreen')}
        >
          {translation('Login')}
        </Button>
        <Button
          mode="outlined"
          onPress={() => props.navigation.navigate('RegisterScreen')}
        >
          {translation('Sign Up')}
        </Button>
      </Background>
    </View>
  )
}

const mapStateToProps = (state) => {
  return { ...state.LoginReducer }
}
export default connect(mapStateToProps, {
  setLoginInitLoginLoaded,
  setUserAuthData,
})(StartScreen)
