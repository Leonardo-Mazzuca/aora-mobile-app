

import { View, Text, Image } from 'react-native'
import React from 'react'
import {images} from '../constants'
import CustomButton from './custom-buttom'
import { router } from 'expo-router'

type Props = {
    title:string,
    subtitle: string
}

const EmptyState = ({title,subtitle}:Props) => {
  return (
    <View className='justify-center items-center px-4'>

      <Image
        source={images.empty}
        className='w-[270px] h-[215px]'
        resizeMode='contain'
      />
                <Text className='text-xl text-center font-psemibold mt-2 text-white'>
                 {title}
                </Text>
             <Text className='font-pmedium text-sm text-gray-100'>
                  {subtitle}
                </Text>

                <CustomButton 
                    title='Create video'
                    handlePress={()=>router.push('/create')}
                    containerStyles='w-full my-5'
                />
      
    </View>
  )
}

export default EmptyState