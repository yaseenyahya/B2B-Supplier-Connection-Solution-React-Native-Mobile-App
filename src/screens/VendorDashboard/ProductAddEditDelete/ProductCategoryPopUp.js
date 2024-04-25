import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Modal, Text } from 'react-native-paper'
import _ from 'lodash'
import { connect } from 'react-redux'
import LoadingButton from '../../../components/LoadingButton'
import AutoCompleteDropDown from '../../../components/AutoCompleteDropDown'
import {
  setAddEditProductCategoryAInputValues,
  setAddEditProductCategoryADataSet,
  setAddEditProductCategoryALoading,
} from '../../../store/actions/AddEditProductActions'
import { setUserAuthData } from '../../../store/actions/UserAuthDataActions'
import { categoryValidator } from '../../../helpers/categoryValidator'
import { theme } from '../../../core/theme'
import { useDropdownAlert } from '../../../context/AlertDropdownContextProvider'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useTranslation } from '../../../context/Localization'
const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  containerStyle: {
    flex: 1,
  },
  submitButton: {
    marginBottom: 2,
  },
  noteText: {
    fontSize: 11,
    color: 'black',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 6,
  },
})

function ProductCategoryPopUp(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()

  const getACategoriesQuery = gql`
    query get_a_categories {
      get_a_categories {
        id
        name
      }
    }
  `
  let [
    getACategories,
    {
      loading: getACategoriesQueryLoading,
      error: getACategoriesQueryError,
      data: getACategoriesQueryResult,
    },
  ] = useLazyQuery(getACategoriesQuery, {
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (
      getACategoriesQueryResult &&
      getACategoriesQueryResult.get_a_categories
    ) {
      props.setAddEditProductCategoryADataSet(
        _.map(getACategoriesQueryResult.get_a_categories, (item) => {
          return { id: item.id, title: item.name }
        })
      )
    }
  }, [getACategoriesQueryResult])

  useEffect(() => {
    getACategories()
  }, [])
  let updateCategoryAIdMutation = gql`
    mutation update_category_a_id($user_id: ID!, $category_a_id: ID!) {
      update_category_a_id(user_id: $user_id, category_a_id: $category_a_id) {
        success
        error
        result
      }
    }
  `

  const [
    updateCategoryAId,
    {
      loading: updateCategoryAIdMutationLoading,
      error: updateCategoryAIdMutationError,
      data: updateCategoryAIdMutationResult,
    },
  ] = useMutation(updateCategoryAIdMutation)

  useEffect(() => {
    if (updateCategoryAIdMutationError) {
      updateCategoryAIdMutationError.graphQLErrors.map(({ message }, i) => {
        props.setAddEditProductCategoryALoading(false)
        alertWithType('error', '', message)
      })
    }
  }, [updateCategoryAIdMutationError])

  useEffect(() => {
    if (
      updateCategoryAIdMutationResult &&
      updateCategoryAIdMutationResult.update_category_a_id
    ) {
      props.userAuthData.category_a_id =
        updateCategoryAIdMutationResult.update_category_a_id.result
      props.setUserAuthData(_.cloneDeep(props.userAuthData))
    }
  }, [updateCategoryAIdMutationResult])

  const onSavePressed = async () => {
    const categoryAError = categoryValidator(
      props.addEditProductCategoryAInputValues.value
    )

    if (categoryAError) {
      props.setAddEditProductCategoryAInputValues({
        value: props.addEditProductCategoryAInputValues.value,
        error: categoryAError,
      })

      return
    }

    props.setAddEditProductCategoryALoading(true)
    try {
      await updateCategoryAId({
        variables: {
          user_id: props.userAuthData.id,
          category_a_id: props.addEditProductCategoryAInputValues.value,
        },
      })
    } catch (ex) {
      props.setAddEditProductCategoryALoading(false)
      if (ex.networkError) alertWithType('error', '', ex.toString())
    }
  }
  return (
    <Modal propagateSwipe
      visible={props.userAuthData.category_a_id == null}
      dismissable={false}
      contentContainerStyle={styles.containerStyle}
    >
      <View style={styles.mainContainer}>
        <AutoCompleteDropDown
        notCloseOnBlur={true}
        position="relative"
          placeholder={translation('Select Category A')}
          error={!!props.addEditProductCategoryAInputValues.error}
          errorText={translation(props.addEditProductCategoryAInputValues.error)}
          onSelectItem={(item) => {
            props.setAddEditProductCategoryAInputValues({
              value: item ? item.id : '',
              error: '',
            })
          }}
          dataSet={props.addEditProductCategoryADataSet}
        />
        <LoadingButton
          onPress={onSavePressed}
          disabled={props.addEditProductCategoryALoading}
          loading={props.addEditProductCategoryALoading}
          style={styles.submitButton}
          mode="contained"
        >
          {translation('Save')}
        </LoadingButton>
        <Text style={styles.noteText}>
          {translation(
            'Category can only be changed by admin. Please choose wisely.'
          )}
        </Text>
      </View>
    </Modal>
  )
}
const mapStateToProps = (state) => {
  return { ...state.AddEditProductReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setAddEditProductCategoryAInputValues,
  setAddEditProductCategoryADataSet,
  setAddEditProductCategoryALoading,
  setUserAuthData,
})(ProductCategoryPopUp)
