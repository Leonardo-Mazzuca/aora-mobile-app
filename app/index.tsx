


import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import {Link} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../constants/images'
import CustomButton from '@/components/custom-buttom'
import {StatusBar} from 'expo-status-bar'
import {Redirect,router} from 'expo-router'
import { useGlobalContext } from '@/context/global-provider'

const App = () => {

  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) {
    return <Redirect href={"/home"} />
  }

  return (



        <SafeAreaView className='bg-primary h-full'>

          <ScrollView contentContainerStyle={{height:'100%'}}>

            <View className='w-full justify-center items-center min-h-[85vh] px-4'>

              <Image 
                source={images.logo}
                className='w-[130px] h-[84px]'
                resizeMode='contain'
              />
              <Image
                source={images.cards}
                className='max-w-[380px] w-full h-[300px]'
                resizeMode='contain'
              
              />

              <View className='relative mt-5'>

                <Text className='text-3xl text-white font-bold text-center'>
                  Discover endless possibilites with <Text className='text-secondary-200'>
                    Aora
                  </Text>
                </Text>
                <Image 
                  source={images.path}
                  className='w-[136px] h-[15px] absolute -bottom-2 left-2/4 -translate-x-1/2'
                  resizeMode='contain'
                />  


              </View>
              
              <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
                  Where creativity meets inovation: embark on a journey of limitless exploration
                  with aora
                </Text>

                <CustomButton
                  title='Continue with email'
 
                  handlePress={()=>router.push('/sign-in')}
                  containerStyles='w-full mt-7'
                />

            </View>

          </ScrollView>

          <StatusBar style='light' backgroundColor='#161622' />

        </SafeAreaView>



  )

}

export default App