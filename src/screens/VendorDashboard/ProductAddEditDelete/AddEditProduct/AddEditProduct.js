import React, { useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native'
import { connect } from 'react-redux'
import BackButtonWithLanguageMenu from '../../../../components/BackButtonWithLanguageMenu'
import Background from '../../../../components/Background'
import LoadingButton from '../../../../components/LoadingButton'
import ProductsSlider from '../../../../components/ProductsSlider'
import { Button, Text } from 'react-native-paper'
import {
  setAddEditProductImages,
  setAddEditProductActiveSliderThumbnail,
  setAddEditProductCategoryB,
  setAddEditProductCategoryC,
  setAddEditProductProductColor,
  setAddEditProductTitle,
  setAddEditProductPrice,
  setAddEditProductDiscountModalToggle,
  setAddEditProductDiscountQuantity,
  setAddEditProductDiscountPrice,
  setAddEditProductDescription,
  setAddEditProductLoading,
  setAddEditProductLoadingPercentage,
  setAddEditProductReset,
} from '../../../../store/actions/AddEditProductActions'
import { setCustomerQueryFormProductDetailsAdded } from '../../../../store/actions/CustomerQueryFormActions'
import TextInput from '../../../../components/TextInput'
import BackButtonWithTitleAndComponent from '../../../../components/BackButtonWithTitleAndComponent'
import ProductCategoryPopUp from '../ProductCategoryPopUp'
import AutoCompleteDropDown from '../../../../components/AutoCompleteDropDown'
import BottomDrawerContent from '../../BottomDrawerContent'
import { categoryValidator } from '../../../../helpers/categoryValidator'
import { productTitleValidator } from '../../../../helpers/productTitleValidator'
import { productPriceValidator } from '../../../../helpers/productPriceValidator'
import { productDescriptionValidator } from '../../../../helpers/productDescriptionValidator'
import { useDropdownAlert } from '../../../../context/AlertDropdownContextProvider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { setVendorBottomDrawerToggle } from '../../../../store/actions/VendorBottomDrawerActions'
import ImagePicker from 'react-native-image-crop-picker'
import _ from 'lodash'
import config from '../../../../../config.json'
import axios from 'axios'
import mime from 'mime'
import CircularProgressOverlay from '../../../../components/CircularProgressOverlay'
import { ProductsRefreshContext } from '../../../../context/ProductsRefreshContextProvider'
import CategoryBAutoCompleteDropDown from './CategoryBAutoCompleteDropDown'
import CategoryCAutoCompleteDropDown from './CategoryCAutoCompleteDropDown'
import { useTranslation } from '../../../../context/Localization'
import ColorPickerMenu from '../../../../components/ColorPicker/ColorPickerMenu'
import AddEditProductDiscountPopUp from './AddEditProductDiscountPopUp'
const styles = StyleSheet.create({
  title: {
    marginTop: 0,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollContentContainer: {
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 10,
  },
  submitButton: {
    width: 40,
    minWidth: 55,
    minHeight: 10,
  },
  submitButtonText: {
    marginHorizontal: 0,
    fontSize: 13,
    paddingHorizontal: 0,
    height: 25,
  },
  submitButtonContent: {
    height: 30,
  },
  priceSaleInputContainer: {},
  descriptionInputContainer: {
    flexGrow: 1,
    minHeight: 140,
    maxHeight: 'auto',
  },
  descriptionInput: {
    flexGrow: 1,
    height: null,
    maxHeight: null,
  },
  textInputPriceContainer: {
    width: '30%',
  },
  textField: {
    marginVertical: 0,
    marginTop: 5,
  },
  titleTextField: {
    flex: 1,
    width: 'auto',
  },
  colorPickerContainer: {
    flexDirection: 'row',
  },
  discountModalButtonContainer: {
    justifyContent: 'center',
     flex:1,
     alignItems:"center",
   
  },
  discountModalButtonLabel: {
    fontSize: 15,

  },
  discountModalButton: {

   maxWidth:"70%"
  },
  discountDiscription: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  discountCalculationText: {
    fontSize: 12,
  },
  formContainer: {
    paddingRight: 15,
    paddingLeft: 15,
  },
})

function AddEditProduct(props) {
  const { alertWithType } = useDropdownAlert()
  const { translation } = useTranslation()

  const { productsData, requestProductsRefresh, productsDataLoading } =
    useContext(ProductsRefreshContext)

  const env = process.env.NODE_ENV
  const config_ = config[env]

  const addImagePathToAddProductScreen = (path) => {
    var cloneArray = _.cloneDeep(props.addEditProductImages)
    cloneArray[props.addEditProductActiveSliderThumbnail] = path
    props.setAddEditProductImages(cloneArray)
  }
  useEffect(() => {
    if (props.route && props.route.params && props.route.params.editItemData) {
      var alreadyAddedMedia = JSON.parse(
        props.route.params.editItemData.media_serialized
      )
      props.setAddEditProductImages(
        _.map(
          alreadyAddedMedia,
          (item) =>
            config[process.env.NODE_ENV].backend_domain +
            config[process.env.NODE_ENV].upload_dir +
            '/' +
            item
        )
      )

      props.setAddEditProductCategoryB({
        value: props.route.params.editItemData.category_b_id.toString(),
        error: '',
      })
      props.setAddEditProductCategoryC({
        value: props.route.params.editItemData.category_c_id.toString(),
        error: '',
      })

      props.setAddEditProductProductColor(
        props.route.params.editItemData.product_color.toString()
      )
      props.setAddEditProductTitle({
        value: props.route.params.editItemData.title,
        error: '',
      })
      props.setAddEditProductPrice({
        value: props.route.params.editItemData.price.toString(),
        error: '',
      })
      props.setAddEditProductDiscountQuantity({
        value: props.route.params.editItemData.discount_quantity.toString(),
        error: '',
      })
      props.setAddEditProductDiscountPrice({
        value: props.route.params.editItemData.discount_price.toString(),
        error: '',
      })
      props.setAddEditProductDescription({
        value: props.route.params.editItemData.description,
        error: '',
      })
    }
  }, [])

  const validateAll = () => {
    const categoryBError = categoryValidator(
      props.addEditProductCategoryB.value
    )
    const categoryCError = categoryValidator(
      props.addEditProductCategoryC.value
    )
    const titleError = productTitleValidator(props.addEditProductTitle.value)
    const priceError = productPriceValidator(props.addEditProductPrice.value)
    const descriptionError = productDescriptionValidator(
      props.addEditProductDescription.value
    )
    if (
      categoryBError ||
      categoryCError ||
      titleError ||
      priceError ||
      descriptionError
    ) {
      props.setAddEditProductCategoryB({
        value: props.addEditProductCategoryB.value,
        error: categoryBError,
      })
      props.setAddEditProductCategoryC({
        value: props.addEditProductCategoryC.value,
        error: categoryCError,
      })
      props.setAddEditProductTitle({
        value: props.addEditProductTitle.value,
        error: titleError,
      })
      props.setAddEditProductPrice({
        value: props.addEditProductPrice.value,
        error: priceError,
      })

      props.setAddEditProductDescription({
        value: props.addEditProductDescription.value,
        error: descriptionError,
      })

      return
    }

    if (props.addEditProductImages.length == 0) {
      Alert.alert('', translation('Must attach atleast 1 product image'))
      return
    }
    return true
  }
  const onEditPressed = () => {
    if (validateAll()) {
      props.setAddEditProductLoadingPercentage(0)
      props.setAddEditProductLoading(true)

      const formData = new FormData()
      var productFilenames = []
      props.addEditProductImages.map((image) => {
        const trimmedImageURI =
          Platform.OS === 'android' ? image : image.replace('file://', '')
        var fileName = trimmedImageURI.split('/').pop()
        var customName =
          props.userAuthData.company_name +
          '_' +
          props.addEditProductTitle.value +
          '_' +
          Date.now() +
          '_' +
          fileName
        if (image.startsWith('file://')) {
          fileName = customName
          formData.append('images', {
            name: customName,
            type: mime.getType(trimmedImageURI),
            uri: image,
          })
        }
        productFilenames.push(fileName)
      })
      formData.append('product_id', props.route.params.editItemData.id)
      formData.append('product_filenames', JSON.stringify(productFilenames))
      formData.append('product_user_id', props.userAuthData.id)
      formData.append('product_category_b', props.addEditProductCategoryB.value)
      formData.append('product_category_c', props.addEditProductCategoryC.value)
      formData.append('product_color', props.addEditProductProductColor)
      formData.append('product_title', props.addEditProductTitle.value)
      formData.append('product_price', props.addEditProductPrice.value)
      formData.append(
        'product_discount_quantity',
        props.addEditProductDiscountQuantity.value
      )
      formData.append(
        'product_discount_price',
        props.addEditProductDiscountPrice.value
      )
      formData.append(
        'product_description',
        props.addEditProductDescription.value
      )

      axios({
        method: 'POST',
        url: config_.backend_domain + '/upload_edit',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          props.setAddEditProductLoadingPercentage(percentCompleted)
        },
      })
        .then((response) => {
          if (response.status === 200) {
            props.navigation.goBack()
            requestProductsRefresh(props.userAuthData.id)
            alertWithType(
              'success',
              '',
              translation('Product edit successfully.')
            )
            props.setAddEditProductReset()
          } else {
            alertWithType(
              'error',
              '',
              translation('Error while updating product. Try again.')
            )
            props.setAddEditProductLoading(false)
          }
        })
        .catch((e) => {
          alertWithType(
            'error',
            '',
            translation('Error while updating product. Try again.')
          )
          props.setAddEditProductLoading(false)
        })
    }
  }
  const onAddPressed = () => {
    if (validateAll()) {
      props.setAddEditProductLoadingPercentage(0)
      props.setAddEditProductLoading(true)

      const formData = new FormData()
      props.addEditProductImages.map((image) => {
        const trimmedImageURI =
          Platform.OS === 'android' ? image : image.replace('file://', '')
        const fileName = trimmedImageURI.split('/').pop()
        formData.append('images', {
          name:
            props.userAuthData.company_name +
            '_' +
            props.addEditProductTitle.value +
            '_' +
            Date.now() +
            '_' +
            fileName,
          type: mime.getType(trimmedImageURI),
          uri: image,
        })
      })
      formData.append('product_user_id', props.userAuthData.id)
      formData.append('product_category_b', props.addEditProductCategoryB.value)
      formData.append('product_category_c', props.addEditProductCategoryC.value)
      formData.append('product_color', props.addEditProductProductColor)
      formData.append('product_title', props.addEditProductTitle.value)
      formData.append('product_price', props.addEditProductPrice.value)
      formData.append(
        'product_discount_quantity',
        props.addEditProductDiscountQuantity.value
      )
      formData.append(
        'product_discount_price',
        props.addEditProductDiscountPrice.value
      )
      formData.append(
        'product_description',
        props.addEditProductDescription.value
      )

      axios({
        method: 'POST',
        url: config_.backend_domain + '/upload_add',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          props.setAddEditProductLoadingPercentage(percentCompleted)
        },
      })
        .then((response) => {
          if (response.status === 200) {
            if (
              props.route &&
              props.route.params &&
              props.route.params.addInCustomerQueryFormProductDetailsAdded
            ) {
              props.navigation.goBack()
              props.customerQueryFormProductDetailsAdded.splice(
                0,
                0,
                response.data.product
              )
              props.setCustomerQueryFormProductDetailsAdded(
                _.cloneDeep(props.customerQueryFormProductDetailsAdded)
              )
            }

            requestProductsRefresh(props.userAuthData.id)
            alertWithType(
              'success',
              '',
              translation('Product added successfully.')
            )
            props.setAddEditProductReset()
          } else {
            alertWithType(
              'error',
              '',
              translation('Error while uploading product. Try again.')
            )
            props.setAddEditProductLoading(false)
          }
        })
        .catch((e) => {
          alertWithType(
            'error',
            '',
            translation('Error while uploading product. Try again.')
          )
          props.setAddEditProductLoading(false)
        })
    }
    // props.navigation.goBack()
    // props.setAddEditProductReset()
  }

  return (
    <View style={styles.mainContainer}>
      <CircularProgressOverlay
        visible={props.addEditProductLoading}
        progressValue={props.addEditProductLoadingPercentage}
        textContent={
          (props.route && props.route.params && props.route.params.editItemData
            ? translation('Updating')
            : translation('Adding')) +
          ' ' +
          translation('products...')
        }
        textStyle={styles.spinnerTextStyle}
      />
      <BackButtonWithTitleAndComponent
        goBack={() => {
          props.navigation.goBack()
          props.setAddEditProductReset()
        }}
        title={
          (props.route && props.route.params && props.route.params.editItemData
            ? translation('Edit')
            : translation('Add')) +
          ' ' +
          translation('Product')
        }
      >
        {props.route &&
        props.route.params &&
        props.route.params.editItemData ? (
          <LoadingButton
            contentStyle={styles.submitButtonContent}
            textStyle={styles.submitButtonText}
            disabled={props.addEditProductLoading}
            loading={props.addEditProductLoading}
            mode="contained"
            onPress={onEditPressed}
            style={styles.submitButton}
          >
            {!props.addEditProductLoading && translation('Edit')}
          </LoadingButton>
        ) : (
          <LoadingButton
            contentStyle={styles.submitButtonContent}
            textStyle={styles.submitButtonText}
            disabled={props.addEditProductLoading}
            loading={props.addEditProductLoading}
            mode="contained"
            onPress={onAddPressed}
            style={styles.submitButton}
          >
            {!props.addEditProductLoading && translation('Add')}
          </LoadingButton>
        )}
      </BackButtonWithTitleAndComponent>

      <BottomSheetModalProvider>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scroll}
        >
          <ImageBackground
            source={require('../../../../assets/background.jpeg')}
            resizeMode="repeat"
            style={styles.formContainer}
          >
            <ProductsSlider
              onAddImagePress={() => {
                props.setVendorBottomDrawerToggle(true)
              }}
              onEditPress={() => {
                ImagePicker.openCropper({
                  width: 300,
                  height: 400,
                  path: props.addEditProductImages[props.addEditProductActiveSliderThumbnail],
                }).then((image) => {
                  addImagePathToAddProductScreen(image.path)
                })
              }}
              onDeletePress={() => {
                var cloneArray = _.cloneDeep(props.addEditProductImages)

                cloneArray.splice(props.addEditProductActiveSliderThumbnail, 1)
                props.setAddEditProductImages(cloneArray)
              }}
              activeTab={props.addEditProductActiveSliderThumbnail}
              activeTabChanged={(i) => {
                props.setAddEditProductActiveSliderThumbnail(i)
              }}
              imagesArray={props.addEditProductImages}
            />

            <CategoryBAutoCompleteDropDown route={props.route} />

            <CategoryCAutoCompleteDropDown route={props.route} />

            <View style={styles.colorPickerContainer}>
              <ColorPickerMenu
                selectedColor={props.addEditProductProductColor}
                onColorChangeComplete={(color) => {
                  props.setAddEditProductProductColor(color)
                }}
              />
              <TextInput
                containerStyle={[styles.titleTextField, styles.textField]}
                label={translation('Title')}
                value={props.addEditProductTitle.value}
                error={!!props.addEditProductTitle.error}
                errorText={translation(props.addEditProductTitle.error)}
                onChangeText={(text) =>
                  props.setAddEditProductTitle({ value: text, error: '' })
                }
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextInput
                label={translation('Price')}
                keyboardType={'numeric'}
                containerStyle={[
                  styles.textInputPriceContainer,
                  styles.textField,
                ]}
                value={props.addEditProductPrice.value}
                error={!!props.addEditProductPrice.error}
                errorText={translation(props.addEditProductPrice.error)}
                onChangeText={(text) => {
                  props.setAddEditProductPrice({
                    value: text.replace(/[^0-9]/g, ''),
                    error: '',
                  })
                }}
              />
              <View style={[styles.discountModalButtonContainer,props.addEditProductDiscountQuantity.value != '' &&
                  props.addEditProductDiscountPrice.value != '' ? null : {marginTop:6}]}>
                {props.addEditProductDiscountQuantity.value != '' &&
                
                props.addEditProductDiscountQuantity.value > 0 &&
                  props.addEditProductDiscountPrice.value != '' &&
                  props.addEditProductDiscountPrice.value > 0
                  && (
                    <View style={styles.discountDiscription}>
                      <Text
                        style={styles.discountCalculationText}
                      >{`Discount Qty >= ${
                        props.addEditProductDiscountQuantity.value
                      } Price = ${
                        props.addEditProductPrice.value -
                        (props.addEditProductPrice.value *
                          props.addEditProductDiscountPrice.value) /
                          100
                      } per piece`}</Text>
                    </View>
                  )}
                <Button
                mode="contained"
                style={styles.discountModalButton}
                  labelStyle={styles.discountModalButtonLabel}
                  onPress={() => {
                    props.setAddEditProductDiscountModalToggle(true);
                  
                  }}
                >
                  {`${
                    props.addEditProductDiscountQuantity.value != '' &&
                    props.addEditProductDiscountQuantity.value > 0 &&
                    props.addEditProductDiscountPrice.value != ''
                    &&
                  props.addEditProductDiscountPrice.value > 0
                      ? 'Edit'
                      : 'Add'
                  } Discount`}
                </Button>
              </View>
            </View>

            <TextInput
              multiline={true}
              containerStyle={[
                styles.descriptionInputContainer,
                styles.textField,
              ]}
              inputStyle={styles.descriptionInput}
              label={translation('Description')}
              value={props.addEditProductDescription.value}
              error={!!props.addEditProductDescription.error}
              errorText={translation(props.addEditProductDescription.error)}
              onChangeText={(text) =>
                props.setAddEditProductDescription({
                  value: text,
                  error: '',
                })
              }
            />
          </ImageBackground>
        </ScrollView>
        <BottomDrawerContent
          onCameraPress={() => {
            //props.setVendorBottomDrawerIndex(1)
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            }).then((image) => {
              addImagePathToAddProductScreen(image.path)
            })

            props.setVendorBottomDrawerToggle(false)
          }}
          onGalleryPress={() => {
            ImagePicker.openPicker({
              multiple: false,
              cropping: true,
            }).then((image) => {
              addImagePathToAddProductScreen(image.path)
            })
            props.setVendorBottomDrawerToggle(false)
          }}
          navigation={props.navigation}
        />
      </BottomSheetModalProvider>

      <ProductCategoryPopUp />
      <AddEditProductDiscountPopUp />
    </View>
  )
}
const mapStateToProps = (state) => {
  return {
    ...state.AddEditProductReducer,
    ...state.UserAuthDataReducer,
    ...state.CustomerQueryFormReducer,
  }
}
export default connect(mapStateToProps, {
  setAddEditProductImages,
  setAddEditProductActiveSliderThumbnail,
  setAddEditProductCategoryB,
  setAddEditProductCategoryC,
  setAddEditProductProductColor,
  setAddEditProductTitle,
  setAddEditProductPrice,
  setAddEditProductDiscountModalToggle,
  setAddEditProductDiscountQuantity,
  setAddEditProductDiscountPrice,
  setAddEditProductDescription,
  setAddEditProductLoading,
  setAddEditProductLoadingPercentage,
  setAddEditProductReset,
  setVendorBottomDrawerToggle,
  setCustomerQueryFormProductDetailsAdded,
})(AddEditProduct)
