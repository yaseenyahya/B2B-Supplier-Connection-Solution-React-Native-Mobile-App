import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ripple from 'react-native-material-ripple'
import ProfileAvatar from '../../components/ProfileAvatar'
import { theme } from '../../core/theme'
import { connect } from 'react-redux'
import { removeLoginUserId } from '../../auth/LocalStorage'
import { setVendorDrawerReset } from '../../store/actions/VendorDrawerActions'
import { useTranslation } from '../../context/Localization'
import LanguageButtonMenu from '../../components/LanguageButtonMenu'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    borderRightColor: '#c7c7c7',
    borderRightWidth: 1,
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  topContainerUserInfo: {
    flexDirection: 'column',
  },
  usernameText: {
    textAlign: 'left',
    textTransform: 'capitalize',
    fontSize: 21,
    fontWeight: '700',
    color: 'black',
    marginLeft: 10,
  },
  usernameNumber: {
    fontSize: 15,
    color: 'gray',
    marginLeft: 10,
    marginTop: 5,
  },
  avatar: {
    marginRight: 10,
  },
  midContainer: {
    flexGrow: 1,
    borderTopColor: '#c7c7c7',
    borderTopWidth: 1,
  },
  menuBtn: {
    paddingVertical: 18,
    alignContent: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  menuItemDivider: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  menuBtnIcon: {
    marginLeft: 10,

    padding: 7,
    borderRadius: 8,
  },
  menuBtnIconPrimaryColor: {
    backgroundColor: theme.colors.primary,
  },
  menuBtnIconGreen: {
    backgroundColor: '#27b557',
  },
  menuBtnIconPink: {
    backgroundColor: "#ff4081",
  },

  menuBtnIconRed: {
    backgroundColor: theme.colors.error,
  },
  menuBtnIconOrange: {
    backgroundColor: '#ff3d00',
  },
  menuBtnIconBlue:{
    backgroundColor: '#4285f4',
  },
  logoutBtn: {
    paddingVertical: 18,
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    flex:1
  },
  menuText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginTop: 3,
  },
  menuLoginText: {
    marginLeft: 14,
  },
  logoutContainer: {
    flexDirection: 'row',

 
  },
  languageBtn:{
    paddingHorizontal:20,
    borderLeftColor:"#b3b0b0",
    borderLeftWidth:1,
    backgroundColor:"white",
    flex:1,
    justifyContent:"center"
  }
})

function DrawerContent(props) {
  const { translation } = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topContainerUserInfo}>
          <Text style={styles.usernameText}>
            {props.userAuthData.company_name}
          </Text>
          <Text style={styles.usernameNumber}>
            {props.userAuthData.contact_no}
          </Text>
        </View>
        <ProfileAvatar
          style={styles.avatar}
          source={props.userAuthData.avatar}
        />
      </View>
      <View style={styles.midContainer}>
        <Ripple
          onPress={() => {
            props.navigation.navigate('UserProfileScreen')
          }}
          style={styles.menuBtn}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconPrimaryColor]}
            name={'user'}
            size={17}
            color={'white'}
          />
          <Text style={styles.menuText}> {translation('Profile')}</Text>
        </Ripple>
        <Divider style={styles.menuItemDivider} />
        <Ripple
          style={styles.menuBtn}
          onPress={() => {
            props.navigation.navigate('ContactUsScreen')
          }}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconGreen]}
            name={'phone'}
            size={17}
            color={'white'}
          />
          <Text style={styles.menuText}> {translation('Contact Us')}</Text>
        </Ripple>
        <Divider  style={[{borderTopColor:"#c3c3c3",borderTopWidth:1},styles.menuItemDivider]} />
        <Ripple
          style={styles.menuBtn}
          onPress={() => {
            props.navigation.navigate('CustomerQueryForm')
          }}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconBlue]}
            name={'plus'}
            size={17}
            color={'white'}
          />
          <Text style={styles.menuText}> {translation('Customer Query Form')}</Text>
        </Ripple>
    
        <Ripple
          style={styles.menuBtn}
          onPress={() => {
            props.navigation.navigate('InternalStandardsForm')
          }}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconOrange]}
            name={'plus'}
            size={17}
            color={'white'}
          />
          <Text style={styles.menuText}> {translation('Internal Standards')}</Text>
        </Ripple>
  
        <Ripple
          style={styles.menuBtn}
          onPress={() => {
            props.navigation.navigate('InfoForProductsForm')
          }}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconPink]}
            name={'plus'}
            size={17}
            color={'white'}
          />
          <Text style={styles.menuText}> {translation('Info For Products')}</Text>
        </Ripple>
      </View>
      <View style={styles.logoutContainer}>
        <Ripple
          style={styles.logoutBtn}
          onPress={async () => {
            await removeLoginUserId()
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'StartScreen' }],
            })
            props.setVendorDrawerReset()
          }}
        >
          <Icon
            style={[styles.menuBtnIcon, styles.menuBtnIconRed]}
            name={'sign-out'}
            size={17}
            color={'white'}
          />
          <Text style={[styles.menuText, styles.menuLoginText]}>
            {translation('Logout')}
          </Text>
        </Ripple>
        <LanguageButtonMenu languageButtonStyle={styles.languageBtn}/>
      </View>
    </View>
  )
}
const mapStateToProps = (state) => {
  return { ...state.VendorDrawerReducer, ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, { setVendorDrawerReset })(DrawerContent)
