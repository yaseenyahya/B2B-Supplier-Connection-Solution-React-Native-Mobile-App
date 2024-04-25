import React, { useEffect, useContext } from 'react'
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux'
import { gql, useSubscription } from '@apollo/client'
import { useDropdownAlert } from '../../../context/AlertDropdownContextProvider'
import { theme } from '../../../core/theme'
import { ActivityIndicator } from 'react-native-paper'
import {
  SvgCss,
  Path,
  Ellipse,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Mask,
  Marker,
  ForeignObject,
} from 'react-native-svg'
import ImageSvg from 'react-native-remote-svg'
import { useTranslation } from '../../../context/Localization'
import { setVendorWelcomeCallPopUpToggle } from '../../../store/actions/VendorActions'
import { CustomerQueryFormContext } from '../../../context/CustomerQueryFormContextProvider'
import ReportingScreenProductsByColor from './ReportingScreenProductsByColor'
import CustomButton from '../../../components/Button'

const styles = StyleSheet.create({
  topTotalCountBoxesContainer: {},
  topTotalCountBoxes: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    width: 140,
    borderColor: theme.colors.primary,
    borderWidth: 2,

    backgroundColor: 'white',
  },
  topTotalCount: {
    textAlign: 'center',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 0,
    fontSize: 22,
    color: '#4a4949',
    fontWeight: 'bold',
  },
  contentLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    position: 'absolute',
    width: '100%',

    backgroundColor: 'white',
    zIndex: 10000,
    height: 500,
  },
  topTotalCountDescription: {
    textAlign: 'center',
    marginBottom: 8,
    marginRight: 5,
    marginLeft: 5,
    color: 'gray',
  },
  scrollViewContainer: {
    paddingVertical: 5,
  },
  welcomeCallBtn: {
    width: 120,
    paddingHorizontal: 0,
    minWidth: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    position: 'absolute',
    bottom: 146,
    marginHorizontal: 2,
  },
  welcomeCallBtnText: {
    marginHorizontal: 0,
    fontSize: 12,
    paddingHorizontal: 0,
    height: 14,
    lineHeight: 17,
  },
})

function ReportingScreen(props) {
  const { translation } = useTranslation()
  const { alertWithType } = useDropdownAlert()

 

  const {
    customerQueryFormData,
    customerQueryFormRefresh,
    customerQueryFormLoading,
  } = useContext(CustomerQueryFormContext)
  const productCircle1 =
    customerQueryFormData &&
    customerQueryFormData[4] &&
    `<circle  class="cls-circle-orange" cx="235" cx="235" transform="translate(-90 495)" r="36.599399578928764"  opacity="1">
    <animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;-90 495"></animateTransform>
  </circle>`
  const productCircleDetails1 =
    customerQueryFormData &&
    customerQueryFormData[4] &&
    `<line class="st1" x1="0" y1="0" x2="60" y2="0" style="stroke:black;stroke-idth:2" />
  <text font-weight="bolder" class="box" x="-115" y="5" font-size="20" font-family="courier new" dy="0">
  ${customerQueryFormData[4].company_name}
  </text>`
  const productCircle2 =
    customerQueryFormData &&
    customerQueryFormData[3] &&
    ` <circle  class="cls-circle" cx="235"  transform="translate(0 505)" r="40.599399578928764" fill="blue" opacity="1">
    </circle>`
  const productCircleDetails2 =
    customerQueryFormData &&
    customerQueryFormData[3] &&
    `<line class="st1" x1="142" y1="0" x2="240" y2="0" style="stroke:black;stroke-idth:2" />
  <text font-weight="bolder" class="box" x="245" y="0" font-size="20" font-family="courier new" >
  ${customerQueryFormData[3].company_name}
  </text>`
  const productCircle3 =
    customerQueryFormData &&
    customerQueryFormData[2] &&
    `<circle  class="cls-circle-green" cx="235" cx="235" transform="translate(90 555)" r="33.599399578928764"  opacity="1">
    <animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;90 555"></animateTransform>
    </circle>`
  const productCircleDetails3 =
    customerQueryFormData &&
    customerQueryFormData[2] &&
    `<line class="st1" x1="183" y1="27" x2="230" y2="27" style="stroke:black;stroke-idth:2" />
  <text font-weight="bolder" class="box" x="245" y="30" font-size="20" font-family="courier new" >
  ${customerQueryFormData[2].company_name}
  </text>`
  const productCircle4 =
    customerQueryFormData &&
    customerQueryFormData[1] &&
    `  <circle  class="cls-circle" cx="235" cx="235" transform="translate(-80 615)" r="50.599399578928764"  opacity="1">
    <animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;-80 615"></animateTransform>
  </circle> `
  const productCircleDetails4 =
    customerQueryFormData &&
    customerQueryFormData[1] &&
    `<line class="st1" x1="0" y1="60" x2="60" y2="60" style="stroke:black;stroke-idth:2" />
  <text font-weight="bolder" class="box" x="-115" y="65" font-size="20" font-family="courier new" dy="0">
  ${customerQueryFormData[1].company_name}
  </text>`
  const productCircle5 =
    customerQueryFormData &&
    customerQueryFormData[0] &&
    ` <circle  class="cls-circle" cx="235" cx="235"  transform="translate(60 650)" r="25.599399578928764"  opacity="1">
    <animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;60 650"></animateTransform>
    </circle> `
  const productCircleDetails5 =
    customerQueryFormData &&
    customerQueryFormData[0] &&
    ` <line class="st1" x1="165" y1="75" x2="205" y2="75" style="stroke:black;stroke-idth:2" />
  <text font-weight="bolder" class="box"  x="210" y="77" font-size="20" font-family="courier new" >
  
    ${customerQueryFormData[0].company_name}

  </text>`
  useEffect(() => {
    customerQueryFormRefresh(props.userAuthData.id)
  }, [])
  const CustomerQueryFormsAddedSubscription = gql`
    subscription CustomerQueryFormsAdded {
      customerqueryformsadded {
        user_id
       
      }
    }
  `

  const { data: customerQueryFormsAddedSubscriptionResult, error: eroooraa,loading } =
    useSubscription(CustomerQueryFormsAddedSubscription)
   
  useEffect(() => {
 
    if (props.userAuthData.id != null) {
      
      if (
        customerQueryFormsAddedSubscriptionResult &&
        customerQueryFormsAddedSubscriptionResult.customerqueryformsadded
      ) {
      
        if (
          customerQueryFormsAddedSubscriptionResult.customerqueryformsadded
            .user_id == props.userAuthData.id
        ) {
          customerQueryFormRefresh(props.userAuthData.id);
        }
      }
    }
  }, [customerQueryFormsAddedSubscriptionResult])
  return (
    <View style={customerQueryFormLoading ? { flex: 1 } : null}>
      <View>
        <ScrollView
          horizontal={true}
          styles={styles.topTotalCountBoxesContainer}
          contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.topTotalCountBoxes}>
            <Text style={styles.topTotalCount}>432 USD</Text>
            <Text style={styles.topTotalCountDescription}>
              {translation('Sales today so far')}
            </Text>
          </View>
          <View style={styles.topTotalCountBoxes}>
            <Text style={styles.topTotalCount}>30</Text>
            <Text style={styles.topTotalCountDescription}>
              {translation('Monthly sales')}
            </Text>
          </View>
          <View style={styles.topTotalCountBoxes}>
            <Text style={styles.topTotalCount}>10</Text>
            <Text style={styles.topTotalCountDescription}>
              {translation('Today View')}
            </Text>
          </View>
          <View style={styles.topTotalCountBoxes}>
            <Text style={styles.topTotalCount}>432</Text>
            <Text style={styles.topTotalCountDescription}>
              {translation('Sales today so far')}
            </Text>
          </View>
        </ScrollView>
      </View>
      {customerQueryFormLoading && (
        <View style={styles.contentLoadingContainer}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <ScrollView
        styles={[styles.topTotalCountBoxesContainer]}
        contentContainerStyle={{ paddingBottom: 75 }}
      >
        <ImageSvg
          source={{
            uri:
              `data:image/svg+xml;utf8,
          
          <svg width="120" height="120" filter="url(#shadow2)"  viewBox="-250 500 1000 1500">` +
              productCircle1 +
              productCircle2 +
              productCircle3 +
              productCircle4 +
              productCircle5 +
              `<defs>
          <filter id="shadow2">
          <feDropShadow in="SourceGraphic" 
          dx="8" dy="12" stdDeviation="25" 
          flood-color="gray" />
        </filter>
        <linearGradient id="cicles-bg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#0a8ddf;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#00588f;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="cicles-bg-green" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#73b53c;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#247635;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="cicles-bg-orange" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#f8901e;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#bd6607;stop-opacity:1" />
        </linearGradient>
        </defs>
        <style>
          .cls-circle{fill:url(#cicles-bg);}
          .cls-circle-green{fill:url(#cicles-bg-green);}
          .cls-circle-orange{fill:url(#cicles-bg-orange);}
          </style>
          </svg>
          
          
          
          <svg width="120" height="120" filter="url(#shadow2)" viewBox="-100 200 900 716">
  <ellipse  class="cls-upperpart-circle-container" cx="338.98" cy="88.39" rx="327.28" ry="29.29">
  <animate id="upperpart-circle-container-animate" attributeName="fill"
  from="#709ec3" to="#003560" begin="0s" dur="1s"
  fill="freeze" repeatCount="1" />
  </ellipse>
  <path    class="cls-upperpart-mid-white-bg" d="M351.43,108.94C104.61,118.68,27.65,94.17,13.16,88.38a.91.91,0,0,0-1.1,1.34L173.3,343.51a11.77,11.77,0,0,0,6.26,4.88c153.85,50.12,291.37,8.37,316,.05a11.79,11.79,0,0,0,6.07-4.72L665.22,92.84a.92.92,0,0,0-.86-1.41C543.15,103.12,438.88,108,351.48,108.94Z"/>
  <path    class="cls-upperpart-mid-white-bg-gradient" d="M351.43,108.94C104.61,118.68,27.65,94.17,13.16,88.38a.91.91,0,0,0-1.1,1.34L173.3,343.51a11.77,11.77,0,0,0,6.26,4.88c153.85,50.12,291.37,8.37,316,.05a11.79,11.79,0,0,0,6.07-4.72L665.22,92.84a.92.92,0,0,0-.86-1.41C543.15,103.12,438.88,108,351.48,108.94Z"/>
 
  <ellipse  class="cls-upperpart-inner-circle" cx="337.32" cy="87.98" rx="221.16" ry="12.3"/>
  <defs>
  <filter id="shadow2">
  <feDropShadow in="SourceGraphic" 
  dx="8" dy="12" stdDeviation="25" 
  flood-color="gray" />
</filter>

  <linearGradient id="upperpart-funnelbg" x1="0%" y1="0%" x2="0%" y2="100%">

  <stop offset="100%" style="stop-color:white;stop-opacity:0" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
 
  <stop offset="100%" style="stop-color:#0a8ddf;stop-opacity:0.8" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
  <stop offset="100%" style="stop-color:#00588f;stop-opacity:1" >
  <animate
  dur="2s"
  begin={"1s"}
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
</linearGradient>
<linearGradient id="upperpart-upperpart-mid-white-bg" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#a7becd;stop-opacity:1" />
</linearGradient>
<linearGradient id="upperpart-inner-circle" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#b7b7b8;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
</linearGradient>
  <style>
  .cls-upperpart-circle-container{fill:#003560;stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-upperpart-mid-white-bg-gradient{fill:url(#upperpart-funnelbg);stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-upperpart-inner-circle{fill:url(#upperpart-inner-circle);}
.cls-upperpart-mid-white-bg{fill:url(#upperpart-upperpart-mid-white-bg);}
  </style>
  </defs>
  </svg>



  <svg width="120" height="120" filter="url(#shadow2)" viewBox="-270 200 900 4">
 
 
  <animate id="midpart-circle-container-animate" attributeName="fill"
  from="#709ec3" to="#003560" begin="0s" dur="1s"
  fill="freeze" repeatCount="1" />
  </ellipse>
  <path    class="cls-midpart-mid-white-bg" d="M55.75,163.48a11.79,11.79,0,0,0,3.06,4.23c6.62,5.82,30.25,20.91,97.24,21.55,66.81.64,100.24-13.62,110.76-19.21a12,12,0,0,0,5.31-5.77l43-98.63H13.76Z"/>
  <path    class="cls-midpart-mid-white-bg-gradient" d="M55.75,163.48a11.79,11.79,0,0,0,3.06,4.23c6.62,5.82,30.25,20.91,97.24,21.55,66.81.64,100.24-13.62,110.76-19.21a12,12,0,0,0,5.31-5.77l43-98.63H13.76Z"/>
  <ellipse class="cls-midpart-circle-container" cx="164.04" cy="58.08" rx="154.86" ry="30.68"/>
  <ellipse class="cls-midpart-inner-circle" cx="163.98" cy="56.63" rx="78.28" ry="16"/>
  
  <defs>
  <filter id="shadow2">
  <feDropShadow in="SourceGraphic" 
  dx="8" dy="12" stdDeviation="25" 
  flood-color="gray" />
</filter>

  <linearGradient id="midpart-funnelbg" x1="0%" y1="0%" x2="0%" y2="100%">

  <stop offset="100%" style="stop-color:white;stop-opacity:0" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
 
  <stop offset="100%" style="stop-color:#0a8ddf;stop-opacity:0.8" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
  <stop offset="100%" style="stop-color:#00588f;stop-opacity:1" >
  <animate
  dur="2s"
  begin={"1s"}
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
</linearGradient>
<linearGradient id="midpart-midpart-mid-white-bg" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#a7becd;stop-opacity:1" />
</linearGradient>
<linearGradient id="midpart-inner-circle" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#b7b7b8;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
</linearGradient>
  <style>
  .cls-midpart-circle-container{fill:#003560;stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-midpart-mid-white-bg-gradient{fill:url(#midpart-funnelbg);stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-midpart-inner-circle{fill:url(#midpart-inner-circle);}
.cls-midpart-mid-white-bg{fill:url(#midpart-midpart-mid-white-bg);}
  </style>
  </defs>
  </svg>




  <svg width="120" height="120" filter="url(#shadow2)" viewBox="-320 10 900 3">
 
 
  <animate id="bottompart-circle-container-animate" attributeName="fill"
  from="#709ec3" to="#003560" begin="0s" dur="1s"
  fill="freeze" repeatCount="1" />
  </ellipse>
  <path class="cls-bottompart-mid-white-bg" d="M68.54,134.6v77.85s9.55,18.11,53.58,17.53,53.15-15.76,53.15-15.76l.3-77.48s-17.59,7-55.19,6.07C88.5,142,68.54,134.6,68.54,134.6Z M232.23,48.39,204.46,120a7.31,7.31,0,0,1-2.13,3c-5.91,5-29.66,21.77-78.3,20.09-45.69-1.58-71.47-13.69-79.13-17.91a7.22,7.22,0,0,1-3.33-3.9L16.49,51.84Z"/>
  <path class="cls-bottompart-mid-white-bg-gradient" d="M68.54,134.6v77.85s9.55,18.11,53.58,17.53,53.15-15.76,53.15-15.76l.3-77.48s-17.59,7-55.19,6.07C88.5,142,68.54,134.6,68.54,134.6Z M232.23,48.39,204.46,120a7.31,7.31,0,0,1-2.13,3c-5.91,5-29.66,21.77-78.3,20.09-45.69-1.58-71.47-13.69-79.13-17.91a7.22,7.22,0,0,1-3.33-3.9L16.49,51.84Z"/>
 
  <ellipse class="cls-bottompart-circle-container" cx="122.71" cy="42.95" rx="111.46" ry="29.26"/>
  <ellipse class="cls-bottompart-inner-circle" cx="122.12" cy="41.8" rx="47.85" ry="13.1"/>
  
  <defs>
  <filter id="shadow2">
  <feDropShadow in="SourceGraphic" 
  dx="8" dy="12" stdDeviation="25" 
  flood-color="gray" />
</filter>

  <linearGradient id="bottompart-funnelbg" x1="0%" y1="0%" x2="0%" y2="100%">

  <stop offset="100%" style="stop-color:white;stop-opacity:0" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
 
  <stop offset="100%" style="stop-color:#0a8ddf;stop-opacity:0.8" >
  <animate
  dur="2s"
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
  <stop offset="100%" style="stop-color:#00588f;stop-opacity:1" >
  <animate
  dur="2s"
  begin={"1s"}
  attributeName="offset"
  fill="freeze"
  repeatCount="0"
  from="1"
  to="0.3"
/>
  </stop>
</linearGradient>
<linearGradient id="bottompart-bottompart-mid-white-bg" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#a7becd;stop-opacity:1" />
</linearGradient>
<linearGradient id="bottompart-inner-circle" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#b7b7b8;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
</linearGradient>
  <style>
  .cls-bottompart-circle-container{fill:#003560;stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-bottompart-mid-white-bg-gradient{fill:url(#bottompart-funnelbg);stroke:#005e9e;strokeWidth: 2;stroke-miterlimit:10;}
  .cls-bottompart-inner-circle{fill:url(#bottompart-inner-circle);}
.cls-bottompart-mid-white-bg{fill:url(#bottompart-bottompart-mid-white-bg);}
  </style>
  </defs>
  </svg>




  <svg width="120" height="120" filter="url(#shadow2)"  viewBox="-250 200 1000 3">
  <circle  class="cls-circle" cx="235"  transform="translate(0 505)" r="40.599399578928764" fill="blue" opacity="1">
</circle>
<circle  class="cls-circle" cx="235" cx="235"  transform="translate(70 550)" r="25.599399578928764" fill="green" opacity="1">
<animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;70 550"></animateTransform>
</circle>
  <circle  class="cls-circle" cx="235" cx="235" transform="translate(-40 615)" r="50.599399578928764" fill="red" opacity="1">
  <animateTransform attributeName="transform" type="translate" begin="0s" dur="2s" repeatCount="1" keyTimes="0;1" values="0 505;-40 615"></animateTransform>
</circle>
  <defs>
  <filter id="shadow2">
  <feDropShadow in="SourceGraphic" 
  dx="8" dy="12" stdDeviation="25" 
  flood-color="gray" />
</filter>
<linearGradient id="cicles-bg" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:#0a8ddf;stop-opacity:0.5" />
<stop offset="100%" style="stop-color:#00588f;stop-opacity:1" />
</linearGradient>
</defs>
<style>
  .cls-circle{fill:url(#cicles-bg);}
  </style>
  </svg>

  


























  <svg width="160" height="120" filter="url(#shadow2)"  viewBox="-120 200 500 350">` +
              productCircleDetails1 +
              productCircleDetails2 +
              productCircleDetails3 +
              productCircleDetails4 +
              productCircleDetails5 +
              `<style>
.st1{
  fill:none;
  stroke:#000000;
  stroke-miterlimit:10;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  -webkit-animation: draw2 3s linear 0s forwards;
  animation: draw2 3s linear 0s forwards;
  }
  @-webkit-keyframes draw2{
    to {stroke-dashoffset: 0;}
  }
@keyframes colorChange {
  0% {
      fill:#ffffff
  }

  50% {
      fill:#898989
  }

  100% {
      fill: #000000
  }
}

.box {
  width:200px;
  height:200px;
  animation: colorChange 3s 1;
}
  </style>
  </svg>
          `,
          }}
          style={{
            width: 300,
            height: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </ScrollView>

      <CustomButton
        onPress={() => {
          props.setVendorWelcomeCallPopUpToggle(true)
        }}
        mode={'contained'}
        textStyle={styles.welcomeCallBtnText}
        style={styles.welcomeCallBtn}
      >
        Welcome Call
      </CustomButton>
      <ReportingScreenProductsByColor />
    </View>
  )
}
const mapStateToProps = (state) => {
  return { ...state.UserAuthDataReducer }
}
export default connect(mapStateToProps, { setVendorWelcomeCallPopUpToggle })(
  ReportingScreen
)
