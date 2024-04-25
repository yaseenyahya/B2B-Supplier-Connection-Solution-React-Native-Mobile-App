import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import AutoCompleteDropDown from '../../../../components/AutoCompleteDropDown'
import {
  setAddEditProductCategoryC,
  setAddEditProductCategoryCDataSet,
} from '../../../../store/actions/AddEditProductActions'
import { useDropdownAlert } from '../../../../context/AlertDropdownContextProvider'
import { gql, useLazyQuery } from '@apollo/client'
import { useTranslation } from '../../../../context/Localization'

const styles = StyleSheet.create({})

function CategoryCAutoCompleteDropDown(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()

  const getCCategoriesQuery = gql`
    query get_c_categories($b_category_id: String!) {
      get_c_categories(b_category_id: $b_category_id) {
        id
        name
      }
    }
  `
  let [
    getCCategories,
    {
      loading: getCCategoriesQueryLoading,
      error: getCCategoriesQueryError,
      data: getCCategoriesQueryResult,
    },
  ] = useLazyQuery(getCCategoriesQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (
      getCCategoriesQueryResult &&
      getCCategoriesQueryResult.get_c_categories
    ) {
      props.setAddEditProductCategoryCDataSet(
        _.map(getCCategoriesQueryResult.get_c_categories, (item) => {
          return { id: item.id, title: item.name }
        })
      )
    }
  }, [getCCategoriesQueryResult])

  useEffect(() => {
    if (props.addEditProductCategoryB.value) {
      props.setAddEditProductCategoryCDataSet([])
      getCCategories({
        variables: {
          b_category_id: props.addEditProductCategoryB.value,
        },
      })
    }
  }, [props.addEditProductCategoryB.value])

  return (
    <AutoCompleteDropDown
      inputMainContainerStyles={{ marginTop: 9 }}
      placeholder={translation('Select Category C')}
      loading={getCCategoriesQueryLoading}
      error={!!props.addEditProductCategoryC.error}
      errorText={translation(props.addEditProductCategoryC.error)}
      initialValue={
        props.route && props.route.params && props.route.params.editItemData
          ? { id: props.addEditProductCategoryC.value.toString() }
          : undefined
      }
      onSelectItem={(item) => {
        if (item != null) {
          props.setAddEditProductCategoryC({
            value: item ? item.id : '',
            error: '',
          })
        }
      }}
      dataSet={props.addEditProductCategoryCDataSet}
    />
  )
}
const mapStateToProps = (state) => {
  return { ...state.AddEditProductReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setAddEditProductCategoryC,
  setAddEditProductCategoryCDataSet,
})(CategoryCAutoCompleteDropDown)
