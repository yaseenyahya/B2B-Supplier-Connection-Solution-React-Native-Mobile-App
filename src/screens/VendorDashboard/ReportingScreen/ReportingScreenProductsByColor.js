import React, { useEffect, useContext } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {  Text, Divider } from 'react-native-paper'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { useDropdownAlert } from '../../../context/AlertDropdownContextProvider'
import { ProductsRefreshContext } from '../../../context/ProductsRefreshContextProvider'
import { useTranslation } from '../../../context/Localization'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    right: 0,
    top: '40%',
    backgroundColor: 'white',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopWidth: 1,

    borderBottomWidth: 1,

    borderLeftWidth: 1,
    borderColor: '#c3c3c3',
  },
  productItemContainer: {
    flexDirection: 'row',
  },
  productItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 5,
  },
  productItemText: {
    fontSize: 12,
    fontWeight: '900',
  },
})

function ReportingScreenProductsByColor(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()

  const { productsData, requestProductsRefresh, productsDataLoading } =
    useContext(ProductsRefreshContext)

  return (
    <View style={styles.container}>
      {productsData?.length > 0 &&
        productsData.map((product) => {
          {
        
            return (
     
                <View style={styles.productItemContainer}>
                  <View
                    style={[
                      { backgroundColor: product.product_color },
                      styles.productItem,
                    ]}
                  >
                    {!product.product_color && (
                      <Icon name={'ban'} size={22} color={'gray'} />
                    )}
                  </View>
                  <Text style={styles.productItemText}>
                    {product.title.toUpperCase()}
                  </Text>
                </View>

            )
          }
        })}
    </View>
  )
}
const mapStateToProps = (state) => {
  return { ...state.AddEditProductReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, null)(ReportingScreenProductsByColor)
