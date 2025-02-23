import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const {query} = useLocalSearchParams() // Get the query from the URL
  
  return (
    <SafeAreaView
      className="bg-primary h-full"
    >
      <Text className="text-white text-3xl">{query}</Text>
    </SafeAreaView>
  )
}

export default Search
