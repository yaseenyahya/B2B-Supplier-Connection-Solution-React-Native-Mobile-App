import React, { useEffect } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Text } from 'react-native-paper'
import BackButtonWithLanguageMenu from '../../components/BackButtonWithLanguageMenu'
import HideOnKeyboardShow from '../../components/HideOnKeyboardShow'
import Logo from '../../components/Logo'
import Background from '../../components/Background'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import LoadingButton from '../../components/LoadingButton'
import { subjectValidator } from '../../helpers/subjectValidator'
import { messageValidator } from '../../helpers/messageValidator'
import Header from '../../components/Header'
import { connect } from 'react-redux'
import {
  setContactUsSubject,
  setContactUsMessage,
  setContactUsLoading,
  setContactUsReset,
} from '../../store/actions/ContactUsActions'
import { gql, useMutation } from '@apollo/client'
import { useDropdownAlert } from '../../context/AlertDropdownContextProvider'
import { useTranslation } from '../../context/Localization'

const styles = StyleSheet.create({
  submitButton: {
    marginTop: 16,
  },
})

function ContactUsScreen(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

  let submitContactUsMutation = gql`
    mutation submit_contact_us(
      $user_id: ID!
      $subject: String!
      $message: String!
    ) {
      submit_contact_us(
        user_id: $user_id
        subject: $subject
        message: $message
      ) {
        success
        error
        result
      }
    }
  `

  const [
    submitContactUs,
    {
      loading: submitContactUsLoading,
      error: submitContactUsError,
      data: submitContactUsResult,
    },
  ] = useMutation(submitContactUsMutation)

  useEffect(() => {
    if (submitContactUsError) {
      submitContactUsError.graphQLErrors.map(({ message }, i) => {
        props.setContactUsLoading(false)
        alertWithType('error', '', message)
      })
    }
  }, [submitContactUsError])

  useEffect(() => {
    if (submitContactUsResult && submitContactUsResult.submit_contact_us) {
      if (submitContactUsResult.submit_contact_us.success) {
        props.setContactUsReset(false)
        alert(translation('Thanks for cantacting us. We will contact you soon.'))
      } else {
        props.setContactUsLoading(false)
        alertWithType(
          'error',
          '',
          submitContactUsResult.submit_contact_us.error
        )
      }
    }
  }, [submitContactUsResult])

  const onSendPressed = async () => {
    const subjectError = subjectValidator(props.contactUsSubject.value)
    const messageError = messageValidator(props.contactUsMessage.value)

    if (subjectError || messageError) {
      props.setContactUsSubject({
        value: props.contactUsSubject.value,
        error: subjectError,
      })
      props.setContactUsMessage({
        value: props.contactUsMessage.value,
        error: messageError,
      })
      return
    }
    props.setContactUsLoading(true)
    try {
      await submitContactUs({
        variables: {
          user_id: props.userAuthData.id,
          subject: props.contactUsSubject.value,
          message: props.contactUsMessage.value,
        },
      })
    } catch (ex) {
      props.setContactUsLoading(false)
      if (ex.networkError) alertWithType('error', '', ex.toString())
    }
  }

  return (
    <Background>
      <BackButtonWithLanguageMenu goBack={props.navigation.goBack} />
      <HideOnKeyboardShow>
        <Logo />
      </HideOnKeyboardShow>
      <Header>{translation('Contact Us')}</Header>
      <TextInput
        placeholder={translation('Subject')}
        value={props.contactUsSubject.value}
        onChangeText={(text) =>
          props.setContactUsSubject({ value: text, error: '' })
        }
        error={!!props.contactUsSubject.error}
        errorText={translation(props.contactUsSubject.error)}
      />
      <TextInput
        placeholder={translation('Message')}
        returnKeyType="done"
        multiline={true}
        numberOfLines={4}
        value={props.contactUsMessage.value}
        onChangeText={(text) =>
          props.setContactUsMessage({ value: text, error: '' })
        }
        error={!!props.contactUsMessage.error}
        errorText={translation(props.contactUsMessage.error)}
      />
      <LoadingButton
        disabled={props.contactUsLoading}
        loading={props.contactUsLoading}
        mode="contained"
        onPress={onSendPressed}
        style={styles.submitButton}
      >
        {translation('Send')}
      </LoadingButton>
    </Background>
  )
}
const mapStateToProps = (state) => {
  return { ...state.ContactUsReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setContactUsSubject,
  setContactUsMessage,
  setContactUsLoading,
  setContactUsReset,
})(ContactUsScreen)
