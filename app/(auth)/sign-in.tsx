
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../../constants/images'
import FormField from '@/components/form-field'
import CustomButton from '@/components/custom-buttom'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/global-provider'

const SignIn = () => {

  const [form, setform] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {setUser, setIsLoggedIn} = useGlobalContext();
 
  const submit = async () => {

    if(!form.email || !form.password) {

      Alert.alert('Error', 'All fill in all the fields!')
    }

    setIsSubmitting(true)

    try {
      
      await signIn(form.email, form.password)

      const result = await getCurrentUser();
      setUser(result)
      setIsLoggedIn(true)
      Alert.alert('Success', 'Logged in successfully!')
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
          Log in to Aora
        </Text>

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
          title='Sign in'
          containerStyles='mt-7'
          handlePress={submit}
          isLoading={isSubmitting}
        />

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-100 font-pregular'>
            Don't have an account?
          </Text>
          <Link 
            className='text-lg font-psemibold text-secondary'
            href={'/sign-up'}
          >
            Sign up
          </Link>

        </View>

        </View>

      </ScrollView>
    </SafeAreaView>

  )
}

export default SignIn

