
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../../constants/images'
import FormField from '@/components/form-field'
import CustomButton from '@/components/custom-buttom'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/global-provider'

const SignUp = () => {

  const [form, setform] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const submit = async () => {

    if(!form.username || !form.email || !form.password) {

      Alert.alert('Error', 'All fill in all the fields!')
    }

    setIsSubmitting(true)

    try {
      
      const result = await createUser(form.email, form.password, form.username)
      setUser(result);
      setIsLoggedIn(true)
      router.replace('/home')


    } catch (error:any) {

        Alert.alert('Error',error.message)

    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <SafeAreaView className='bg-primary h-full'>

      <ScrollView>

        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>

        <Image 
          source={images.logo}
          resizeMode='contain'
          className='w-[115px] h-[35px]'
        />

        <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
          Sign up to Aora
        </Text>

        <FormField 
          title='Username'
          value={form.username}
          handleChangeText={(e) => setform({...form, username: e})}
          otherStyles="mt-10"
        />

        <FormField 
          title='Email'
          value={form.email}
          handleChangeText={(e) => setform({...form, email: e})}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField 
          title='Password'
          value={form.password}
          handleChangeText={(e) => setform({...form, password: e})}
          otherStyles="mt-7"
        />

        <CustomButton 
          title='Sign up'
          containerStyles='mt-7'
          handlePress={submit}
          isLoading={isSubmitting}
        />

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-100 font-pregular'>
           have an account already?
          </Text>
          <Link 
            className='text-lg font-psemibold text-secondary'
            href={'/sign-in'}
          >
            Sign in
          </Link>

        </View>

        </View>

      </ScrollView>
    </SafeAreaView>

  )
}

export default SignUp

