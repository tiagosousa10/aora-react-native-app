import React, { useEffect } from 'react'
import {  FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import {  SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

import { getUserPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'


const Profile = () => {
  const {user, setUser, setIsLogged} = useGlobalContext()
  const {data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id))

  const logout = () => {}

  return (
      <SafeAreaView className="bg-primary h-full">
      <FlatList 
        key={posts.id}     
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
         <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
            className="w-full items-end mb-10"
            onPress={logout}
          >
            <Image
              source={icons.logout}
              resizeMode='contain'
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <View
            className="w-16 h-16 border border-secondary rounded-lg justify-center items-center"
          >
            <Image 
              source={{uri: user?.avatar}}
              className="w-[90%] h-[90%]  rounded-lg "
              resizeMode='cover'
            />
          </View>

          <InfoBox />
         </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="No videos found for this search"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile

