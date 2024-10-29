import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import {Video as AvVideo, ResizeMode} from 'expo-av'
import { getSavedVideos, saveVideo, unsaveVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/global-provider";
import useAppwrite from "@/lib/useAppwrite";

type Props = {
  video: Video;
};

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    users: { username, avatar },
  },
}: Props) => {

  const [showMenu, setShowMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {user} = useGlobalContext();

  const {data:savedVideos} = useAppwrite<Video>({
    fn: () => getSavedVideos(user?.$id as string)
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(()=> {
    if(savedVideos) {

      const isSaved = savedVideos.find(video => video.$id === $id)

      if(isSaved) {
        setIsSaved(true)
      }
    }
  },[savedVideos])

  const handleSave =async  () => {

    if(!video){
      Alert.alert('Error', 'Video not found!')
    }

    setIsSaving(true)

    try {

      await saveVideo($id, user.$id as string)
      Alert.alert('Success', 'Video saved successfully!')
      
    } catch (error:any) {
        Alert.alert('Error',error.message)
    } finally {
      setIsSaving(false)
    }

    
  }

  const handleUnSave = async  () => {

    if(!video){
      Alert.alert('Error', 'Video not found!')
    }

    setIsSaving(true)

    try {

      await unsaveVideo($id)
      Alert.alert('Success', 'Video unsaved successfully!')
      
    } catch (error:any) {
        Alert.alert('Error',error.message)
    } finally {
      setIsSaving(false)
    }

  }

  const [play, setPlay] = useState(false);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View
            className="w-[46px] h-[46px] rounded-lg border border-secondary 
                justify-center items-center p-0.5 "
          >
            <Image
              source={{
                uri: avatar,
              }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              numberOfLines={1}
              className="text-white font-psemibold text-sm"
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-xs text-gray-100 font-pregular"
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="relative">

          <TouchableOpacity disabled={isSaving} onPress={()=>setShowMenu(!showMenu)} className="pt-2">
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>

          {showMenu && (
            <View className="bg-black-100 p-2 flex-row 
            items-center justify-center z-10
             w-[150px] h-[55px] gap-5 space-x-2 rounded-lg absolute top-10 right-0">
              
              {!isSaved ? (

                <>
                
                  <Text className="font-pregular text-sm text-white">
                    Save video
                  </Text>

                  <TouchableOpacity onPress={handleSave}>

                      <Image
                        source={icons.bookmark}
                        resizeMode="contain"
                        className="w-6 h-6"
                      />

                  </TouchableOpacity>
                
                </>


              ) : (
                <>
                  <TouchableOpacity onPress={handleUnSave}>

                  <Image
                    source={icons.bookmark}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />

              </TouchableOpacity>
                  <Text className="font-pregular text-sm text-white">
                  Unsave Video
                  </Text>
                
                </>
              )}

              

            </View>
          )}

        </View>
      </View>

      {play ? (
                <AvVideo 
                source={{
                  uri: video,
                }}
                style={{ width: '100%', height: 300, borderRadius: 35, marginTop: 9}}
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
      ) : (
        <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            activeOpacity={0.7}
            onPress={()=>setPlay(true)}
        >
            <Image
                source={{
                    uri: thumbnail
                }}
                className="w-full h-full rounded-xl mt-3"
                resizeMode="cover"
            />
            <Image 
                source={icons.play}
                className="w-20 h-20 absolute"
                resizeMode="contain"
            />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
