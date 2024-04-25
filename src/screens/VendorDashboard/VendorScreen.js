import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native'
import { Button } from 'react-native-paper'
import { theme } from '../../core/theme'
import { CurvedBottomBar } from 'react-native-curved-bottom-bar'
import Icon from 'react-native-vector-icons/FontAwesome5'
import LogoDashboard from '../../components/LogoDashboard'
import Flag from 'react-native-flags'
import Drawer from 'react-native-drawer'
import DrawerContent from './DrawerContent'

import Paragraph from '../../components/Paragraph'
import IconWithBadge from '../../components/IconWithBadge'
import ButtonWithBadge from '../../components/ButtonWithBadge'
import ImagePicker from 'react-native-image-crop-picker'
import { connect } from 'react-redux'
import { setVendorWelcomeCallPopUpToggle } from '../../store/actions/VendorActions'
import { setVendorDrawerToggle } from '../../store/actions/VendorDrawerActions'
import { setAddEditProductImages } from '../../store/actions/AddEditProductActions'
import ProductsViewComponent from './ProductAddEditDelete/ProductsViewComponent'
import _ from 'lodash'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import BottomDrawerContent from './BottomDrawerContent'
import ReportingScreen from './ReportingScreen/ReportingScreen'
import {
  setVendorBottomDrawerToggle,
  setVendorBottomDrawerReset,
} from '../../store/actions/VendorBottomDrawerActions'
import WelcomeCallPopUp from './WelcomeCallPopUp'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: { elevation: 1 },
  btnCircleUp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cbcbcb4d',
    bottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 14.41,
  },
  selectedTabIcon: {
    backgroundColor: '#cbcbcb4d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 14.41,
    elevation: 1,
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  topNavLinearContainer: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topNavContainer: {
    borderBottomColor: '#c7c7c7',
    borderBottomWidth: 1,
  },
  menuBtnIcon: {},
  menuBtn: {
    marginLeft: 5,
  },
  userFlag: {
    marginRight: 8,
    marginLeft: 0,
  },
  chatBtn: {
    marginRight: 5,
  },
  drawerContainer: {},

})

function VendorScreen(props) {
  const addImagePathToAddProductScreen = (navigation, path) => {
    var cloneArray = _.cloneDeep(props.addEditProductImages)
    cloneArray[0] = path
    props.setVendorBottomDrawerReset()
    props.setAddEditProductImages(cloneArray)
    navigation.navigate('AddEditProduct')
  }

  const _renderIcon = (routeName, selectedTab) => {
    let icon = ''

    switch (routeName) {
      case 'home':
        icon = 'home'
        break
      case 'search':
        icon = 'search'
        break
      case 'notifications':
        icon = 'bell'
        break
      case 'products':
        icon = 'dropbox'
        break
    }

    return routeName === selectedTab ? (
      <Icon
        name={icon}
        style={styles.selectedTabIcon}
        size={26}
        color={theme.colors.primary}
      />
    ) : routeName === 'notifications' ? (
      <IconWithBadge
        iconName={icon}
        iconStyle={{}}
        badgeValue={props.vendorNotificationBadge}
      />
    ) : routeName === 'search' ? (
      <IconWithBadge
        iconName={icon}
        iconStyle={{}}
        badgeValue={props.vendorSearchBadge}
      />
    ) : (
      <Icon name={icon} size={26} color={theme.colors.primary} />
    )
  }

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabBarBtn}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    )
  }

  return (
    <Drawer
      type="displace"
      onClose={() => {
        props.setVendorDrawerToggle(false)
      }}
      content={<DrawerContent navigation={props.navigation} />}
      open={props.vendorDrawerToggle}
      tapToClose={true}
      openDrawerOffset={0.2} // 20% gap on the right side of drawer
      panCloseMask={0.2}
      closedDrawerOffset={-3}
      styles={styles.drawerContainer}
      tweenHandler={(ratio) => ({
        main: { opacity: (2 - ratio) / 2 },
      })}
    >
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View style={styles.topNavContainer}>
            <View style={styles.topNavLinearContainer}>
              <Button
                onPress={() => {
                  props.setVendorDrawerToggle(true)
                }}
                mode="text"
                style={styles.menuBtn}
              >
                <Icon
                  style={styles.menuBtnIcon}
                  name={'bars'}
                  size={20}
                  color={theme.colors.primary}
                />
              </Button>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',

                  justifyContent: 'center',
                }}
              >
                <Flag
                  code={props.userAuthData.country_code}
                  size={24}
                  style={styles.userFlag}
                />
                <LogoDashboard />
              </View>
              <ButtonWithBadge
                iconStyle={styles.chatBtnIcon}
                badgeValue={props.vendorChatBadge}
                iconName={'comment-dots'}
                buttonStyle={styles.chatBtn}
              />
            </View>
          </View>
          <CurvedBottomBar.Navigator
            type="up"
            borderTopLeftRight={false}
            style={styles.bottomBar}
            strokeWidth={1}
            height={65}
            circleWidth={55}
            bgColor={'white'}
            initialRouteName="home"
            swipeEnabled
            renderCircle={({ selectedTab, navigate }) => (
              <Animated.View style={styles.btnCircleUp}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    props.setVendorBottomDrawerToggle(true)
                  }}
                >
                  <Icon name="camera" size={40} color={theme.colors.primary} />
                </TouchableOpacity>
              </Animated.View>
            )}
            tabBar={renderTabBar}
          >
            <CurvedBottomBar.Screen
              name="home"
              position="left"
              component={({ navigate }) => {
                return <ReportingScreen />
              }}
            />
            <CurvedBottomBar.Screen
              name="search"
              component={({ navigate }) => (
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                  <Paragraph>Search</Paragraph>
                </View>
              )}
              position="left"
            />
            <CurvedBottomBar.Screen
              name="notifications"
              position="right"
              component={({ navigate, getRouteName }) => (
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                  <Paragraph>Notifications</Paragraph>
                </View>
              )}
            />
            <CurvedBottomBar.Screen
              name="products"
              position="right"
              component={({ navigate }) => (
                <ProductsViewComponent
                  navigation={props.navigation}
                ></ProductsViewComponent>
              )}
            />
          </CurvedBottomBar.Navigator>
          <BottomDrawerContent
            onCameraPress={() => {
              ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
              }).then((image) => {
                addImagePathToAddProductScreen(props.navigation, image.path)
              })
              props.setVendorBottomDrawerToggle(false)
            }}
            onGalleryPress={() => {
              ImagePicker.openPicker({
                multiple: false,
                cropping: true,
              }).then((image) => {
                addImagePathToAddProductScreen(props.navigation, image.path)
              })
              props.setVendorBottomDrawerToggle(false)
            }}
            navigation={props.navigation}
          />
        </View>
      </BottomSheetModalProvider>
      
      <WelcomeCallPopUp/>
    </Drawer>
  )
}
const mapStateToProps = (state) => {
  return {
    ...state.AddEditProductReducer,
    ...state.VendorDrawerReducer,
    ...state.VendorReducer,
    ...state.UserAuthDataReducer,
  }
}
export default connect(mapStateToProps, {
  setVendorDrawerToggle,
  setAddEditProductImages,
  setVendorBottomDrawerToggle,
  setVendorWelcomeCallPopUpToggle,
  setVendorBottomDrawerReset,
})(VendorScreen)
