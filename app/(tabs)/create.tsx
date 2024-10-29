

import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/form-field'
import { ResizeMode, Video } from 'expo-av'
import {icons} from '../../constants'
import CustomButton from '@/components/custom-buttom'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'
import { createVideo } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/global-provider'
const Create = () => {

  const [uploading, setUploading] = useState(false)
  const [form, setform] = useState({
    title: '',
    thumbnail: null,
    video: null,
    prompt: ''
  })

  const {user} = useGlobalContext()

  const openPicker = async (selectType:string) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images :
       ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled){
      if(selectType === 'image'){
        //@ts-ignore
        setform({ ...form, thumbnail: result.assets[0] })
      }
      if(selectType === 'video'){
        //@ts-ignore
        setform({ ...form, video: result.assets[0] })
      }

    } 

  }

  const submit = async () => {

    if(!form.prompt || !form.video || !form.thumbnail || !form.title)  {
      Alert.alert('Error', 'All fill in all the fields!')
    }

    setUploading(true)

    try {

      
      await createVideo({
        title: form.title,
        thumbnail: form.thumbnail || "",
        video: form.video || "",
        prompt: form.prompt,
        userId: user?.$id as string
      })


      Alert.alert('Success', 'Post upload succefully!')
      router.push('/home')

      
    } catch (error:any) {
        Alert.alert('Error',error.message)
    } finally {
      setUploading(false)
      setform({
        title: '',
        thumbnail: null,
        video: null,
        prompt: ''
      })
    }
  }

  return (

    <SafeAreaView className='bg-primary h-full'>

      <ScrollView className='px-4 my-5'>

        <Text className='text-white text-2xl font-psemibold'>
          Upload video
        </Text>

        <FormField 
          title='Video title'
          value={form.title}
          placehoder='Give your video a catch title...'
          handleChangeText={(e) => setform({ ...form, title: e })}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>

          <Text className='text-gray-100 font-pmedium text-base'>
            Upload video
          </Text>

          <TouchableOpacity
            onPress={()=>openPicker('video')}
          >
            {form.video ? (

              <Video 
                source={{
                  //@ts-ignore
                  uri: form.video.uri
                }}
                style={{
                  width: '100%',
                  height: 300,
                  borderRadius: 10
                }}

                resizeMode={ResizeMode.COVER}
            
              />

            ) : (

              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>

                  <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>

                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      className='w-1/2 h-1/2'
                    />
                  </View>

              </View>

            )}
          </TouchableOpacity>



        </View>

        <View className='mt-7 space-y-2'>

         <Text className='text-gray-100 font-pmedium text-base'>
            Thumbnail image
          </Text>


          <TouchableOpacity
            onPress={()=>openPicker('image')}
          >
            {form.thumbnail ? (

              <Image 
                source={{
                  //@ts-ignore
                  uri: form.thumbnail.uri
                }}
                className='w-full h-64 rounded-2xl'
                resizeMode='cover'
              />

            ) : (

              <View className='w-full h-16 border-2 border-black-200 flex-row space-x-2
               px-4 bg-black-100 rounded-2xl justify-center items-center'>

             
                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      className='w-5 h-5'
                    />

                    <Text className='text-sm text-gray-100 px-2 font-pmedium'>

                    Choose a file

                    </Text>
          

              </View>

            )}
          </TouchableOpacity>

        </View>

        <FormField 
          title='AI prompt'
          value={form.prompt}
          placehoder='The prompt you used to create this video'
          handleChangeText={(e) => setform({ ...form, prompt: e })}
          otherStyles='mt-7'
        />

        <CustomButton 
          title='Submit & publish'
          containerStyles='mt-7'
          handlePress={submit}
          isLoading={uploading}
        />

      </ScrollView>

    </SafeAreaView>

  )
}

export default Create