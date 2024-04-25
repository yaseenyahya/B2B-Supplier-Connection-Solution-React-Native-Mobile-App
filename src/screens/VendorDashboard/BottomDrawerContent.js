import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { Button, Divider } from 'react-native-paper'
import { connect } from 'react-redux'
import {
  setVendorBottomDrawerToggle,
  setVendorBottomDrawerIndex,
  setVendorBottomDrawerReset,
} from '../../store/actions/VendorBottomDrawerActions'

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetDynamicSnapPoints,
  
} from '@gorhom/bottom-sheet'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/FontAwesome5'
import _ from "lodash";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBtn: {
    paddingVertical: 18,
    alignContent: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flexDirection: 'row',
    backgroundColor: '#dddddd',
  },
  menuText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginTop: 3,
  },
  menuItemDivider: {
    backgroundColor: '#c6c6c6',
    marginVertical: 1,
  },
  menuBtnIcon: {
    marginLeft: 10,

    padding: 7,
    borderRadius: 8,
  },
})

function BottomDrawerContent(props) {
  const bottomSheetModalRef = useRef(null)

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(['CONTENT_HEIGHT', 'CONTENT_HEIGHT'])


  useEffect(() => {
    if (props.vendorBottomDrawerToggle) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [props.vendorBottomDrawerToggle])

  const handleSheetChanges = (index) => {

  }

  return (
    <View>
      <BottomSheetModal
        style={styles.container}
        ref={bottomSheetModalRef}
        onDismiss={() => {
          props.setVendorBottomDrawerReset()
        }}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop opacity={0.1} {...props} pressBehavior="close" />
        )}
        index={1}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={styles.contentContainerStyle}
          onLayout={handleContentLayout}
        >
          
            <View style={styles.contentContainer}>
              <Ripple
                style={styles.menuBtn}
                onPress={props.onCameraPress}
              >
                <Icon
                  style={[styles.menuBtnIcon, styles.menuBtnIconGreen]}
                  name={'camera'}
                  size={17}
                  color={'white'}
                />
                <Text style={styles.menuText}>Camera</Text>
              </Ripple>
              <Divider style={styles.menuItemDivider} />
              <Ripple
                style={styles.menuBtn}
                onPress={props.onGalleryPress}
              >
                <Icon
                  style={[styles.menuBtnIcon, styles.menuBtnIconGreen]}
                  name={'images'}
                  size={17}
                  color={'white'}
                />
                <Text style={styles.menuText}>Gallery</Text>
              </Ripple>
            </View>
          
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
const mapStateToProps = (state) => {
  return {
    ...state.VendorBottomDrawerReducer,
    ...state.AddEditProductReducer,
  }
}
export default connect(mapStateToProps, {
  setVendorBottomDrawerToggle,
  setVendorBottomDrawerIndex,
  setVendorBottomDrawerReset
})(BottomDrawerContent)
