import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import AutoCompleteDropDown from '../../../../components/AutoCompleteDropDown'
import {
  setAddEditProductCategoryB,
  setAddEditProductCategoryBDataSet,
} from '../../../../store/actions/AddEditProductActions'
import { useDropdownAlert } from '../../../../context/AlertDropdownContextProvider'
import { gql, useLazyQuery } from '@apollo/client'
import { useTranslation } from '../../../../context/Localization'

const styles = StyleSheet.create({})

function CategoryBAutoCompleteDropDown(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()

  const getBCategoriesQuery = gql`
    query get_b_categories($a_category_id: String!) {
      get_b_categories(a_category_id: $a_category_id) {
        id
        name
      }
    }
  `
  let [
    getBCategories,
    {
      loading: getBCategoriesQueryLoading,
      error: getBCategoriesQueryError,
      data: getBCategoriesQueryResult,
    },
  ] = useLazyQuery(getBCategoriesQuery, {
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (
      getBCategoriesQueryResult &&
      getBCategoriesQueryResult.get_b_categories
    ) {
      props.setAddEditProductCategoryBDataSet(
        _.map(getBCategoriesQueryResult.get_b_categories, (item) => {
          return { id: item.id, title: item.name }
        })
      )
    }
  }, [getBCategoriesQueryResult])
  useEffect(() => {
  
    if(props.userAuthData.category_a_id){

    getBCategories({
      variables: {
        a_category_id: props.userAuthData.category_a_id,
      },
    })
  }
  }, [props.userAuthData.category_a_id])

  return (
    <AutoCompleteDropDown
    loading={getBCategoriesQueryLoading}
      inputMainContainerStyles={{ marginTop: 20 }}
      placeholder={translation('Select Category B')}
      error={!!props.addEditProductCategoryB.error}
      errorText={translation(props.addEditProductCategoryB.error)}
      initialValue={
        props.route && props.route.params && props.route.params.editItemData
          ? { id: props.addEditProductCategoryB.value.toString() }
          : undefined
      }
      onSelectItem={(item) => {
        props.setAddEditProductCategoryB({
          value: item ? item.id : '',
          error: '',
        })
      }}
      dataSet={props.addEditProductCategoryBDataSet}
    />
  )
}
const mapStateToProps = (state) => {
  return { ...state.AddEditProductReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, {
  setAddEditProductCategoryB,
  setAddEditProductCategoryBDataSet,
})(CategoryBAutoCompleteDropDown)
