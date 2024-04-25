import React, { Component, useRef } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Button,
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel' // 3.6.0
import Lightbox from 'react-native-lightbox'
import Icon from 'react-native-vector-icons/FontAwesome5'
const styles = StyleSheet.create({
  mainContainer: {
    height: 200,
    marginTop:9
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSliderContainer: {
    backgroundColor: '#ffffffa6',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
  },
  thumbnailImage: {
    width: 45,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    resizeMode: 'contain',
  },
  imageSlider: {
    minWidth: 130,
    height: 150,
    // minWidth: 130,
    // height: 80,
    backgroundColor: 'white',
  },
  thumbnailBottomBar: {
    backgroundColor: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 50,
    paddingTop: 0,
    paddingBottom: 0,
  },
  deleteBtn: {
    position: 'absolute',
    zIndex: 10000,
    left: 30,
    top: 4,
    borderWidth: 1,
    borderColor: '#cd3232',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#ff5353',
    borderRadius: 50,
  },
  editBtn: {
    position: 'absolute',
    zIndex: 10000,
    right: 30,
    top: 4,
    borderWidth: 1,
    borderColor: '#505050',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'gray',
    borderRadius: 50,
  },
})

const SCREEN_WIDTH = Dimensions.get('window').width
export default function ProductsSlider({
  activeTab,
  activeTabChanged,
  imagesArray,
  onAddImagePress,
  onEditPress,
  onDeletePress,
}) {
  const getImage = (i) => {
    return (
      <Image
        style={[
          styles.imageSlider,
          { resizeMode: imagesArray[i] != undefined ? 'cover' : 'contain' },
        ]}
        source={
          imagesArray[i] != undefined
            ? {
                uri: imagesArray[i],
              }
            : require('../../assets/noimage.jpg')
        }
      />
    )
  }
  const getImageWithPressEffects = (i) => {
    return imagesArray[i] == undefined ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          onAddImagePress && onAddImagePress()
        }}
      >
        {getImage(i)}
      </TouchableOpacity>
    ) : (
      <Lightbox underlayColor="white">{getImage(i)}</Lightbox>
    )
  }
  const getDeleteEditButtons = () => {
    return (
      <>
        <TouchableOpacity onPress={onEditPress} style={styles.editBtn}>
          <Icon name={'pen'} size={17} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeletePress} style={styles.deleteBtn}>
          <Icon name={'trash'} size={17} color={'white'} />
        </TouchableOpacity>
      </>
    )
  }
  const carouselRef = useRef(null)
  const SCREENS = [
    <View style={styles.imageSliderContainer}>
      {imagesArray[0] != undefined && getDeleteEditButtons()}
      {getImageWithPressEffects(0)}
    </View>,
    <View style={styles.imageSliderContainer}>
      {imagesArray[1] != undefined && getDeleteEditButtons()}
      {getImageWithPressEffects(1)}
    </View>,
    <View style={styles.imageSliderContainer}>
      {imagesArray[2] != undefined && getDeleteEditButtons()}
      {getImageWithPressEffects(2)}
    </View>,
  ]

  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.container}>
          <Carousel
            scrollEnabled={false}
            ref={carouselRef}
            data={SCREENS}
            renderItem={({ item }) => item}
            layout={'default'}
            onSnapToItem={(i) => activeTabChanged(i)}
            sliderWidth={SCREEN_WIDTH - 20}
            itemWidth={SCREEN_WIDTH - 20}
            slideStyle={{ width: SCREEN_WIDTH - 20 }}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
          />
        </View>
        <View style={styles.thumbnailBottomBar}>
          <Pagination
            containerStyle={styles.tabsContainer}
            renderDots={(activeIndex) =>
              SCREENS.map((screen, i) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ flex: 1, alignItems: 'center' }}
                  key={i}
                  onPress={() => {
                    carouselRef.current._snapToItem(
                      carouselRef.current._getPositionIndex(i)
                    )
                  }}
                >
                  <Image
                    style={[
                      styles.thumbnailImage,
                      { borderColor: activeIndex === i ? '#ddd' : 'white' },
                    ]}
                    source={
                      imagesArray[i] != undefined
                        ? {
                            uri: imagesArray[i],
                          }
                        : require('../../assets/noimage.jpg')
                    }
                  />
                </TouchableOpacity>
              ))
            }
            activeDotIndex={activeTab}
            dotsLength={3}
          />
        </View>
      </View>
    </View>
  )
}
