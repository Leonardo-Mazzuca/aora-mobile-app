


import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {icons} from '../constants'

type Props = {
    title: string,
    value: string
    handleChangeText: (e:string) => void
    keyboardType?:string,
    placehoder?:string,
    otherStyles?:string
}

const FormField = ({
    handleChangeText,
    title,
    value,
    keyboardType,
    otherStyles,
    placehoder
}:Props) => {


  const [showPassword, setShowPassword] = useState(false)


  return (


    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>
        {title}
      </Text>
      <View className='flex-row w-full h-16 px-4 border border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center'>
        <TextInput 
            className='flex-1 text-white font-psemibold text-base'
            value={value}
            placeholder={placehoder}
            placeholderTextColor={"#7b7b8b"}
            onChangeText={handleChangeText}
            secureTextEntry={title==='Password'&& !showPassword}

        />

        {title === 'Password' && 
            <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
            >
                <Image
                    source={!showPassword ? icons.eye : icons.eyeHide}
                    className='w-6 h-6'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        }
      </View>
    </View>

  )

}

export default FormField