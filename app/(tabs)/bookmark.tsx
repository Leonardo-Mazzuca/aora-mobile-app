
import { FlatList, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoCard from '@/components/video-card'
import SearchInput from '@/components/search-input'
import EmptyState from '@/components/empty-state'
import useAppwrite from '@/lib/useAppwrite'
import { getSavedVideos } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/global-provider'

const BookMark = () => {

  const {user} = useGlobalContext();
  const {data:posts,refecth} = useAppwrite<Video>({
    fn: ()=>getSavedVideos(user.$id)
  })
  
  useEffect(()=> {

    refecth();

  },[])

  return (

    <SafeAreaView className='bg-primary h-full'>

      <FlatList
        data={posts}
        keyExtractor={(item)=>item.title}
        renderItem={({item})=> (
          <VideoCard
            video={item}
          />
        )}
        ListHeaderComponent={()=> (
          <View className='my-6 px-4 space-y-6 py-5'>
            <View className='justify-between items-start flex-row mb-6'>
      
                <Text className='font-psemibold text-2xl text-white'>
                  Saved videos
                </Text>
      
  
            </View>

            <SearchInput
              placehoder='Search your saved videos'
            />
            
          </View>
        )}

        ListEmptyComponent={()=> (
          <EmptyState
            title="No videos found"
            subtitle="Try to save some videos!"
          />
        )}
   
      />

    </SafeAreaView>

  )
}

export default BookMark

