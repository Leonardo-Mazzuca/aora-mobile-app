import { View, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

type Props = {

  initialQuery?:string
  placehoder?: string;

};

const SearchInput = ({
  placehoder,
  initialQuery
}: Props) => {

  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View
      className="flex-row w-full h-16 px-4 border border-black-200
       bg-black-100 rounded-2xl focus:border-secondary items-center space-x-4"
    >
      <TextInput
        className="text-base mt-0.5 flex-1 text-white font-pregular"
        value={query}
        placeholder={placehoder}
        placeholderTextColor={"#cdcde0"}
        onChangeText={(e)=>setQuery(e)}
      />

      <TouchableOpacity
       onPress={()=>{

        if(!query){
            return Alert.alert('Missing query!', 'Please enter a search query')
        }

        if(pathname.startsWith('/search')){
            router.setParams({
                query
            })
        } else {
            router.push(`/search/${query}`)
        }
       }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
