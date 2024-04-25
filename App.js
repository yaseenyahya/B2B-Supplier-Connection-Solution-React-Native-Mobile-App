import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import StartScreen from './src/screens/StartScreen'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import RegisterScreenFinal from './src/screens/RegisterScreenFinal'
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'
import VendorScreen from './src/screens/VendorDashboard/VendorScreen'
import AddEditProduct from './src/screens/VendorDashboard/ProductAddEditDelete/AddEditProduct/AddEditProduct'
import MobileConfirmationScreen from './src/screens/MobileConfirmationScreen'
import ContactUsScreen from './src/screens/VendorDashboard/ContactUsScreen'
import ResetPasswordScreen from './src/screens/ResetPasswordScreen'
import CustomerQueryForm from './src/screens/CustomerQueryForm/CustomerQueryForm'
import UserProfileScreen from './src/screens/UserProfile/UserProfileScreen'
import EmailConfirmationScreen from './src/screens/EmailConfirmationScreen'
import InfoForProductsForm from './src/screens/InfoForProductsForm'
import InternalStandardsForm from './src/screens/InternalStandardsForm'
import { Provider as ReduxProvider } from 'react-redux'
import store from './src/store'
import { LanguageProvider } from './src/context/Localization'
import { KeyboardStatusContextProvider } from './src/context/KeyboardStatusContextProvider'
import { ProductsRefreshContextProvider } from './src/context/ProductsRefreshContextProvider'
import { CustomerQueryFormContextProvider } from './src/context/CustomerQueryFormContextProvider'
import { AlertDropdownContextProvider } from './src/context/AlertDropdownContextProvider'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split
} from '@apollo/client'
import { getMainDefinition } from "@apollo/client/utilities";
import config from './config.json'
import SyncStorage from 'sync-storage'

import { WebSocketLink } from '@apollo/client/link/ws'
import SplashScreen from 'react-native-splash-screen'

//SplashScreen.preventAutoHideAsync()

const Stack = createStackNavigator()

const env = process.env.NODE_ENV
const config_ = config[env]

const graphQLLink = new HttpLink({
  uri: `${config_.backend_domain}${
    config_.port != '' ? `:${config_.port}` : ''
  }/${config_.graphql_endpoint}`,
})

const wsLink = new WebSocketLink({
  uri: `${config_.graphql_subscription_domain}${
    config_.port != '' ? `:${config_.port}` : ''
  }/${config_.graphql_subscription_endpoint}`,
  options: {
    timeout: 600000,
    minTimeout: 600000,
    reconnect: true,
    lazy:true
  },
})
const splitLink = split(
  ({ query }) => {
   
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  graphQLLink
);
wsLink.subscriptionClient.on('connecting', () => {
  console.log('connecting subs ' + new Date().toString())
})

wsLink.subscriptionClient.on('connected', () => {
  console.log('connected subs ' + new Date().toString())
})

wsLink.subscriptionClient.on('reconnecting', () => {
  console.log('reconnecting subs ' + new Date().toString())
})

wsLink.subscriptionClient.on('reconnected', () => {
  console.log('reconnected subs ' + new Date().toString())
})

wsLink.subscriptionClient.on('disconnected', () => {
  console.log('disconnected subs ' + new Date().toString())
})
wsLink.subscriptionClient.on('onError', (error) => {
  console.log(error.message + '  ' + new Date().toString())
})

wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  },
})
export default function App() {
  const [appReady, setAppReady] = useState(false)

  useLayoutEffect(() => {
    init()
  }, [])

  const init = async () => {
    await SyncStorage.init()
    setAppReady(true)
    //await SplashScreen.hideAsync()
    SplashScreen.hide();
  }

  return (
    <>
      {appReady && (
        <LanguageProvider>
          <KeyboardStatusContextProvider>
            <AlertDropdownContextProvider>
              <StatusBar hidden />
              <ApolloProvider client={apolloClient}>
                <ReduxProvider store={store}>
                  <ProductsRefreshContextProvider>
                    <CustomerQueryFormContextProvider>
                      <Provider theme={theme}>
                        <NavigationContainer>
                          <Stack.Navigator
                            initialRouteName="StartScreen"
                            screenOptions={{
                              headerShown: false,
                            }}
                          >
                            <Stack.Screen
                              name="StartScreen"
                              component={StartScreen}
                            />
                            <Stack.Screen
                              name="LoginScreen"
                              component={LoginScreen}
                            />
                            <Stack.Screen
                              name="RegisterScreen"
                              component={RegisterScreen}
                            />
                            <Stack.Screen
                              name="RegisterScreenFinal"
                              component={RegisterScreenFinal}
                            />
                            <Stack.Screen
                              name="VendorScreen"
                              component={VendorScreen}
                            />
                            <Stack.Screen
                              name="ContactUsScreen"
                              component={ContactUsScreen}
                            />
                            <Stack.Screen
                              name="ResetPasswordScreen"
                              component={ResetPasswordScreen}
                            />
                            <Stack.Screen
                              name="MobileConfirmationScreen"
                              component={MobileConfirmationScreen}
                            />
                            <Stack.Screen
                              name="ChangePasswordScreen"
                              component={ChangePasswordScreen}
                            />
                            <Stack.Screen
                              name="AddEditProduct"
                              component={AddEditProduct}
                            />
                            <Stack.Screen
                              name="UserProfileScreen"
                              component={UserProfileScreen}
                            />
                            <Stack.Screen
                              name="CustomerQueryForm"
                              component={CustomerQueryForm}
                            />
                            <Stack.Screen
                              name="EmailConfirmationScreen"
                              component={EmailConfirmationScreen}
                            />
                            <Stack.Screen
                              name="InfoForProductsForm"
                              component={InfoForProductsForm}
                            />
                            <Stack.Screen
                              name="InternalStandardsForm"
                              component={InternalStandardsForm}
                            />
                          </Stack.Navigator>
                        </NavigationContainer>
                      </Provider>
                    </CustomerQueryFormContextProvider>
                  </ProductsRefreshContextProvider>
                </ReduxProvider>
              </ApolloProvider>
            </AlertDropdownContextProvider>
          </KeyboardStatusContextProvider>
        </LanguageProvider>
      )}
    </>
  )
}
