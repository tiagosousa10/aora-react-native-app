import React, { useEffect } from 'react'
import {  FlatList, Text, View } from 'react-native'
import {  SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useLocalSearchParams } from 'expo-router'


const Search = () => {
  const {query} = useLocalSearchParams() // to get the query from the url params
  const {data: posts, refetch } = useAppwrite(() => searchPosts(query))

  console.log(query, posts)

  useEffect(() => {
    refetch() // to refetch the data when the query changes
  }, [query])


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
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={query}
              />
            </View>
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

export default Search

