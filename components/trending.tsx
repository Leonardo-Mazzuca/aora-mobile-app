

import {  Text, FlatList, TouchableOpacity, ImageBackground, Image, ViewToken, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as Animatable from 'react-native-animatable'
import { icons } from '@/constants'
import {Video as AvVideo, ResizeMode} from 'expo-av'

type Props = {
    posts: any[]
}

type TrendingItemProps = {
  activeItem: string
  item: Video
}

const zoomIn = {
  from: {
    scale: 0.9
  },
  to: {
    scale: 1.1
  }
}

const zoomOut = {
  from: {
    scale: 1
  },
  to: {
    scale: 0.9
  }
}

const TrendingItem = ({activeItem,item}:TrendingItemProps) => {

  const [play, setPlay] = useState(false);

  return (  


    <Animatable.View
      className='mr-5'
      //@ts-ignore
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
        {play ? (
          <View>

            <AvVideo 
              source={{
                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
              }}
              style={{ width: 208, height: 288, borderRadius: 35, marginTop: 12, backgroundColor: 'rgba(255,255,255,0.1)' }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              onPlaybackStatusUpdate={(status)=> {
                //@ts-ignore
                if(status.didJustFinish) {
                  setPlay(false)
                }
                
              }}
            />

          </View>
        ) : (
          <TouchableOpacity onPress={()=>setPlay(true)} 
          activeOpacity={0.7} 
          className='relative justify-center items-center'>
              <ImageBackground 
                source={{
                  uri: item.thumbnail
                }}
                className='w-52 h-72 rounded-[35px]
                 my-5 overflow-hidden shadow-lg shadow-black/40'
                 resizeMode='cover'
              />
              <Image 
                source={icons.play}
                className='w-12 h-12 absolute'
                resizeMode='contain'
              />
          </TouchableOpacity>
        )}
    </Animatable.View>

  )
}
const Trending = ({posts}:Props) => {

  const [activeItem, setActiveItem] = useState("");

  useEffect(()=> {
    setActiveItem(posts[0])
  },[posts])

  const viewableItemsChange = ({viewableItems}:{viewableItems:ViewToken<Video>[]}) => {

    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }

  }

  return (

    <FlatList 
        horizontal
        data={posts}
        keyExtractor={(item)=>item.$id}
        onViewableItemsChanged={viewableItemsChange}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{
          x: 170,
          y: 0
        }}
        renderItem={({item})=> (
            <TrendingItem 
            activeItem={activeItem}
            item={item}
            />
        )}
        
    />

  )
}

export default Trending