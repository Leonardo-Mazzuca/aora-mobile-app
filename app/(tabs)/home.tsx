

import { Text, FlatList, View, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import SearchInput from '@/components/search-input'
import Trending from '@/components/trending'
import EmptyState from '@/components/empty-state'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/video-card'
import { useGlobalContext } from '@/context/global-provider'


const Home = () => {

  const [refreshing, setRefreshing] = useState(false)

  const {user} = useGlobalContext();

  const {data:posts,refecth} = useAppwrite<Video>({
    fn: getAllPosts
  });
  const {data:latestPosts} = useAppwrite<Video>({
    fn: getLatestPosts
  });


  
  const onRefresh = async () => {

    setRefreshing(true)

    await refecth();

    setRefreshing(false)
  }


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
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome back!
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user?.username}
                </Text>
              </View>

              <View className='mt-1.5'>

                <Image
                  source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />

              </View>
            </View>

            <SearchInput
              placehoder='Search for a video topic'
            />

            <View className='w-full flex-1 pt-5 pb-8'>

              <Text className='text-gray-100 text-lg font-pregular mb-3'>
                Latest Videos
              </Text>

              <Trending
                posts={latestPosts ?? []}
              />

            </View>

            
          </View>
        )}

        ListEmptyComponent={()=> (
          <EmptyState
            title="No videos found"
            subtitle="Be the first one to upload a video!"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

    </SafeAreaView>

  )
}

export default Home