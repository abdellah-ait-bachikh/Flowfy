import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const RestautantDetails = () => {
  const {id} = useLocalSearchParams<{id:string}>()
  return (
    <View>
      <Text>RestautantDetails {id}</Text>
    </View>
  )
}

export default RestautantDetails